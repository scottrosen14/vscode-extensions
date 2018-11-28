"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatBitbucketServerUrl(remote, branch, filePath, lines) {
    const re = /(https\:\/\/[^\/]+)\/([^\/]+)\/([^\/]+)/;
    const matches = remote.match(re);
    if (matches.length != 4) {
        return '';
    }
    const host = matches[1];
    const project = matches[2];
    const repo = matches[3];
    const branchRef = encodeURIComponent(`refs/heads/${branch}`);
    const linePointer = formatBitbucketServerLinePointer(lines);
    return `${host}/projects/${project}/repos/${repo}/browse/${filePath}?at=${branchRef}${linePointer}`;
}
exports.formatBitbucketServerUrl = formatBitbucketServerUrl;
function formatBitbucketServerLinePointer(lines) {
    if (!lines || !lines.start) {
        return '';
    }
    let linePointer = `#${lines.start}`;
    if (lines.end && lines.end != lines.start)
        linePointer += `-${lines.end}`;
    return linePointer;
}
//# sourceMappingURL=bitbucketServer.js.map