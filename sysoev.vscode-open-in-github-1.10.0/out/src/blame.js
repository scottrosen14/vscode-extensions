"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const bitbucketServer_1 = require("./bitbucketServer");
function blameCommand() {
    common_1.baseCommand('blame', { github: formatGitHubBlameUrl, bitbucket: formatBitbucketBlameUrl, bitbucketServer: bitbucketServer_1.formatBitbucketServerUrl });
}
exports.default = blameCommand;
function formatGitHubBlameUrl(remote, branch, filePath, lines) {
    return `${remote}/blame/${branch}/${filePath}${common_1.formatGitHubLinePointer(lines)}`;
}
exports.formatGitHubBlameUrl = formatGitHubBlameUrl;
function formatBitbucketBlameUrl(remote, branch, filePath, lines) {
    return `${remote}/annotate/${branch}/${filePath}${common_1.formatBitbucketLinePointer(filePath, lines)}`;
}
exports.formatBitbucketBlameUrl = formatBitbucketBlameUrl;
//# sourceMappingURL=blame.js.map