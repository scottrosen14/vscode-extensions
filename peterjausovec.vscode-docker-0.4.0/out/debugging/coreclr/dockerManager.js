"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("deep-equal");
const path = require("path");
const lazy_1 = require("./lazy");
exports.MacNuGetPackageFallbackFolderPath = '/usr/local/share/dotnet/sdk/NuGetFallbackFolder';
function compareProperty(obj1, obj2, getter) {
    const prop1 = obj1 ? getter(obj1) : undefined;
    const prop2 = obj2 ? getter(obj2) : undefined;
    return prop1 === prop2;
}
function compareDictionary(obj1, obj2, getter) {
    const dict1 = (obj1 ? getter(obj1) : {}) || {};
    const dict2 = (obj2 ? getter(obj2) : {}) || {};
    return deepEqual(dict1, dict2);
}
function compareBuildImageOptions(options1, options2) {
    // NOTE: We do not compare options.dockerfile as it (i.e. the name itself) has no impact on the built image.
    if (!compareProperty(options1, options2, options => options.context)) {
        return false;
    }
    if (!compareDictionary(options1, options2, options => options.args)) {
        return false;
    }
    if (!compareProperty(options1, options2, options => options.tag)) {
        return false;
    }
    if (!compareProperty(options1, options2, options => options.target)) {
        return false;
    }
    if (!compareDictionary(options1, options2, options => options.labels)) {
        return false;
    }
    return true;
}
exports.compareBuildImageOptions = compareBuildImageOptions;
class DefaultDockerManager {
    constructor(appCacheFactory, debuggerClient, dockerClient, dockerOutputManager, fileSystemProvider, osProvider, processProvider, workspaceState) {
        this.appCacheFactory = appCacheFactory;
        this.debuggerClient = debuggerClient;
        this.dockerClient = dockerClient;
        this.dockerOutputManager = dockerOutputManager;
        this.fileSystemProvider = fileSystemProvider;
        this.osProvider = osProvider;
        this.processProvider = processProvider;
        this.workspaceState = workspaceState;
    }
    async buildImage(options) {
        const cache = await this.appCacheFactory.getStorage(options.appFolder);
        const buildMetadata = await cache.get('build');
        const dockerIgnorePath = path.join(options.context, '.dockerignore');
        const dockerfileHasher = new lazy_1.default(async () => await this.fileSystemProvider.hashFile(options.dockerfile));
        const dockerIgnoreHasher = new lazy_1.default(async () => {
            if (await this.fileSystemProvider.fileExists(dockerIgnorePath)) {
                return await this.fileSystemProvider.hashFile(dockerIgnorePath);
            }
            else {
                return undefined;
            }
        });
        if (buildMetadata && buildMetadata.imageId) {
            const imageObject = await this.dockerClient.inspectObject(buildMetadata.imageId);
            if (imageObject && compareBuildImageOptions(buildMetadata.options, options)) {
                const currentDockerfileHash = await dockerfileHasher.value;
                const currentDockerIgnoreHash = await dockerIgnoreHasher.value;
                if (buildMetadata.dockerfileHash === currentDockerfileHash
                    && buildMetadata.dockerIgnoreHash === currentDockerIgnoreHash) {
                    // The image is up to date, no build is necessary...
                    return buildMetadata.imageId;
                }
            }
        }
        const imageId = await this.dockerOutputManager.performOperation('Building Docker image...', async (outputManager) => await this.dockerClient.buildImage(options, content => outputManager.append(content)), id => `Docker image ${this.dockerClient.trimId(id)} built.`, err => `Failed to build Docker image: ${err}`);
        const dockerfileHash = await dockerfileHasher.value;
        const dockerIgnoreHash = await dockerIgnoreHasher.value;
        await cache.update('build', {
            dockerfileHash,
            dockerIgnoreHash,
            imageId,
            options
        });
        return imageId;
    }
    async runContainer(imageTagOrId, options) {
        if (options.containerName === undefined) {
            throw new Error('No container name was provided.');
        }
        const containerName = options.containerName;
        const debuggerFolder = await this.debuggerClient.getDebugger(options.os);
        const command = options.os === 'Windows'
            ? '-t localhost'
            : '-f /dev/null';
        const entrypoint = options.os === 'Windows'
            ? 'ping'
            : 'tail';
        const volumes = this.getVolumes(debuggerFolder, options);
        const containerId = await this.dockerOutputManager.performOperation('Starting container...', async () => {
            const containers = (await this.dockerClient.listContainers({ format: '{{.Names}}' })).split('\n');
            if (containers.find(container => container === containerName)) {
                await this.dockerClient.removeContainer(containerName, { force: true });
            }
            return await this.dockerClient.runContainer(imageTagOrId, {
                command,
                containerName: options.containerName,
                entrypoint,
                env: options.env,
                envFiles: options.envFiles,
                labels: options.labels,
                volumes
            });
        }, id => `Container ${this.dockerClient.trimId(id)} started.`, err => `Unable to start container: ${err}`);
        return containerId;
    }
    async prepareForLaunch(options) {
        const imageId = await this.buildImage(Object.assign({ appFolder: options.appFolder }, options.build));
        const containerId = await this.runContainer(imageId, Object.assign({ appFolder: options.appFolder }, options.run));
        await this.addToDebugContainers(containerId);
        const browserUrl = await this.getContainerWebEndpoint(containerId);
        const additionalProbingPaths = options.run.os === 'Windows'
            ? [
                'C:\\.nuget\\packages',
                'C:\\.nuget\\fallbackpackages'
            ]
            : [
                '/root/.nuget/packages',
                '/root/.nuget/fallbackpackages'
            ];
        const additionalProbingPathsArgs = additionalProbingPaths.map(probingPath => `--additionalProbingPath ${probingPath}`).join(' ');
        const containerAppOutput = options.run.os === 'Windows'
            ? this.osProvider.pathJoin(options.run.os, 'C:\\app', options.appOutput)
            : this.osProvider.pathJoin(options.run.os, '/app', options.appOutput);
        return {
            browserUrl,
            debuggerPath: options.run.os === 'Windows' ? 'C:\\remote_debugger\\vsdbg' : '/remote_debugger/vsdbg',
            // tslint:disable-next-line:no-invalid-template-strings
            pipeArgs: ['exec', '-i', containerId, '${debuggerCommand}'],
            // tslint:disable-next-line:no-invalid-template-strings
            pipeCwd: '${workspaceFolder}',
            pipeProgram: 'docker',
            program: 'dotnet',
            programArgs: [additionalProbingPathsArgs, containerAppOutput],
            programCwd: options.run.os === 'Windows' ? 'C:\\app' : '/app'
        };
    }
    async cleanupAfterLaunch() {
        const debugContainers = this.workspaceState.get(DefaultDockerManager.DebugContainersKey, []);
        const runningContainers = (await this.dockerClient.listContainers({ format: '{{.ID}}' })).split('\n');
        let remainingContainers;
        if (runningContainers && runningContainers.length >= 0) {
            const removeContainerTasks = debugContainers
                .filter(containerId => runningContainers.find(runningContainerId => this.dockerClient.matchId(containerId, runningContainerId)))
                .map(async (containerId) => {
                try {
                    await this.dockerClient.removeContainer(containerId, { force: true });
                    return undefined;
                }
                catch (_a) {
                    return containerId;
                }
            });
            remainingContainers = (await Promise.all(removeContainerTasks)).filter(containerId => containerId !== undefined);
        }
        else {
            remainingContainers = [];
        }
        await this.workspaceState.update(DefaultDockerManager.DebugContainersKey, remainingContainers);
    }
    async addToDebugContainers(containerId) {
        const runningContainers = this.workspaceState.get(DefaultDockerManager.DebugContainersKey, []);
        runningContainers.push(containerId);
        await this.workspaceState.update(DefaultDockerManager.DebugContainersKey, runningContainers);
    }
    async getContainerWebEndpoint(containerNameOrId) {
        const webPorts = await this.dockerClient.inspectObject(containerNameOrId, { format: '{{(index (index .NetworkSettings.Ports \\\"80/tcp\\\") 0).HostPort}}' });
        if (webPorts) {
            const webPort = webPorts.split('\n')[0];
            // tslint:disable-next-line:no-http-string
            return `http://localhost:${webPort}`;
        }
        return undefined;
    }
    getVolumes(debuggerFolder, options) {
        const appVolume = {
            localPath: options.appFolder,
            containerPath: options.os === 'Windows' ? 'C:\\app' : '/app',
            permissions: 'rw'
        };
        const debuggerVolume = {
            localPath: debuggerFolder,
            containerPath: options.os === 'Windows' ? 'C:\\remote_debugger' : '/remote_debugger',
            permissions: 'ro'
        };
        const nugetVolume = {
            localPath: path.join(this.osProvider.homedir, '.nuget', 'packages'),
            containerPath: options.os === 'Windows' ? 'C:\\.nuget\\packages' : '/root/.nuget/packages',
            permissions: 'ro'
        };
        let programFilesEnvironmentVariable;
        if (this.osProvider.os === 'Windows') {
            programFilesEnvironmentVariable = this.processProvider.env[DefaultDockerManager.ProgramFilesEnvironmentVariable];
            if (programFilesEnvironmentVariable === undefined) {
                throw new Error(`The environment variable '${DefaultDockerManager.ProgramFilesEnvironmentVariable}' is not defined. This variable is used to locate the NuGet fallback folder.`);
            }
        }
        const nugetFallbackVolume = {
            localPath: this.osProvider.os === 'Windows' ? path.join(programFilesEnvironmentVariable, 'dotnet', 'sdk', 'NuGetFallbackFolder') : exports.MacNuGetPackageFallbackFolderPath,
            containerPath: options.os === 'Windows' ? 'C:\\.nuget\\fallbackpackages' : '/root/.nuget/fallbackpackages',
            permissions: 'ro'
        };
        const volumes = [
            appVolume,
            debuggerVolume,
            nugetVolume,
            nugetFallbackVolume
        ];
        return volumes;
    }
}
DefaultDockerManager.DebugContainersKey = 'DefaultDockerManager.debugContainers';
DefaultDockerManager.ProgramFilesEnvironmentVariable = 'ProgramFiles';
exports.DefaultDockerManager = DefaultDockerManager;
//# sourceMappingURL=dockerManager.js.map