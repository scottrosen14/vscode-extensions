"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const bitbucketServer_1 = require("./bitbucketServer");
function fileCommand() {
    common_1.baseCommand('file', { github: formatGitHubFileUrl, bitbucket: formatBitbucketFileUrl, bitbucketServer: bitbucketServer_1.formatBitbucketServerUrl });
}
exports.default = fileCommand;
function formatGitHubFileUrl(remote, branch, filePath, lines) {
    return `${remote}/blob/${branch}/${filePath}${common_1.formatGitHubLinePointer(lines)}`;
}
exports.formatGitHubFileUrl = formatGitHubFileUrl;
function formatBitbucketFileUrl(remote, branch, filePath, lines) {
    return `${remote}/src/${branch}/${filePath}${common_1.formatBitbucketLinePointer(filePath, lines)}`;
}
exports.formatBitbucketFileUrl = formatBitbucketFileUrl;
//# sourceMappingURL=file.js.map