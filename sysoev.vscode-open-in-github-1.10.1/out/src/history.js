"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const bitbucketServer_1 = require("./bitbucketServer");
function historyCommand() {
    common_1.baseCommand('history', { github: formatGitHubHistoryUrl, bitbucket: formatBitbucketHistoryUrl, bitbucketServer: bitbucketServer_1.formatBitbucketServerUrl });
}
exports.default = historyCommand;
function formatGitHubHistoryUrl(remote, branch, filePath, lines) {
    return `${remote}/commits/${branch}/${filePath}`;
}
exports.formatGitHubHistoryUrl = formatGitHubHistoryUrl;
function formatBitbucketHistoryUrl(remote, branch, filePath, lines) {
    return `${remote}/history-node/${branch}/${filePath}`;
}
exports.formatBitbucketHistoryUrl = formatBitbucketHistoryUrl;
//# sourceMappingURL=history.js.map