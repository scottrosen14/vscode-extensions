"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipboardy = require("clipboardy");
const path = require("path");
const vscode = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const extensionVariables_1 = require("../../../extensionVariables");
const logFileManager_1 = require("./logFileManager");
class LogTableWebview {
    constructor(webviewName, logData) {
        this.logData = logData;
        this.panel = vscode.window.createWebviewPanel('log Viewer', webviewName, vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
        //Get path to resource on disk
        const extensionPath = extensionVariables_1.ext.context.extensionPath;
        const scriptFile = vscode.Uri.file(path.join(extensionPath, 'commands', 'azureCommands', 'acr-logs-utils', 'logScripts.js')).with({ scheme: 'vscode-resource' });
        const styleFile = vscode.Uri.file(path.join(extensionPath, 'commands', 'azureCommands', 'acr-logs-utils', 'style', 'stylesheet.css')).with({ scheme: 'vscode-resource' });
        const iconStyle = vscode.Uri.file(path.join(extensionPath, 'commands', 'azureCommands', 'acr-logs-utils', 'style', 'fabric-components', 'css', 'vscmdl2-icons.css')).with({ scheme: 'vscode-resource' });
        //Populate Webview
        this.panel.webview.html = this.getBaseHtml(scriptFile, styleFile, iconStyle);
        this.setupIncomingListeners();
        this.addLogsToWebView();
    }
    //Post Opening communication from webview
    /** Setup communication with the webview sorting out received mesages from its javascript file */
    setupIncomingListeners() {
        this.panel.webview.onDidReceiveMessage(async (message) => {
            if (message.logRequest) {
                const itemNumber = +message.logRequest.id;
                try {
                    await this.logData.getLink(itemNumber).then(async (url) => {
                        if (url !== 'requesting') {
                            await logFileManager_1.accessLog(url, this.logData.logs[itemNumber].runId, message.logRequest.download);
                        }
                    });
                }
                catch (err) {
                    const error = vscode_azureextensionui_1.parseError(err);
                    vscode.window.showErrorMessage(`Error '${error.errorType}': ${error.message}`);
                }
            }
            else if (message.copyRequest) {
                // tslint:disable-next-line:no-unsafe-any
                clipboardy.writeSync(message.copyRequest.text);
            }
            else if (message.loadMore) {
                const alreadyLoaded = this.logData.logs.length;
                await this.logData.loadLogs({
                    webViewEvent: true,
                    loadNext: true
                });
                this.addLogsToWebView(alreadyLoaded);
            }
            else if (message.loadFiltered) {
                await this.logData.loadLogs({
                    webViewEvent: true,
                    loadNext: false,
                    removeOld: true,
                    filter: message.loadFiltered.filterString
                });
                this.addLogsToWebView();
            }
        });
    }
    //Content Management
    /** Communicates with the webview javascript file through post requests to populate the log table */
    addLogsToWebView(startItem) {
        const begin = startItem ? startItem : 0;
        for (let i = begin; i < this.logData.logs.length; i++) {
            const log = this.logData.logs[i];
            this.panel.webview.postMessage({
                'type': 'populate',
                'id': i,
                'logComponent': this.getLogTableItem(log, i)
            });
        }
        if (startItem) {
            this.panel.webview.postMessage({ 'type': 'endContinued', 'canLoadMore': this.logData.hasNextPage() });
        }
        else {
            this.panel.webview.postMessage({ 'type': 'end', 'canLoadMore': this.logData.hasNextPage() });
        }
    }
    getImageOutputTable(log) {
        let imageOutput = '';
        if (log.outputImages) {
            //Adresses strange error where the image list can exist and contain only one null item.
            if (!log.outputImages[0]) {
                imageOutput += this.getImageItem(true);
            }
            else {
                for (let j = 0; j < log.outputImages.length; j++) {
                    let img = log.outputImages[j];
                    imageOutput += this.getImageItem(j === log.outputImages.length - 1, img);
                }
            }
        }
        else {
            imageOutput += this.getImageItem(true);
        }
        return imageOutput;
    }
    //HTML Content Loaders
    /** Create the table in which to push the logs */
    getBaseHtml(scriptFile, stylesheet, iconStyles) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="stylesheet" type="text/css" href="${stylesheet}">
            <link rel="stylesheet" type="text/css" href=${iconStyles}>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="frame-src vscode-resource:; img-src vscode-resource: https:; script-src vscode-resource:;">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Logs</title>
        </head>

        <body>
            <main>
                <form class="searchBoxes fixed solidBackground">
                    <div>
                        Filter by ID:<br>
                        <input type="text" name="id">
                    </div>
                    <div class = "middle">
                        Filter by Task:<br>
                        <input type="text" name="task">
                    </div>
                </form>
                <table id='core' class='resizable'>
                    <col class="arrowHolder">
                    <col class="widthControl">
                    <col class="widthControl">
                    <col class="widthControl">
                    <col class="widthControl">
                    <col class="widthControl">
                    <col class="widthControl">

                    <thead id = "tableHead" class = 'fixed solidBackground'>
                        <td></td>
                        <th><span class="colTitle" tabindex="0">ID<span class="sort">  </span></span></th>
                        <th><span class="colTitle" tabindex="0">Task<span class="sort">  </span></span></th>
                        <th><span class="colTitle" tabindex="0">Status<span class="sort">  </span></span></th>
                        <th><span class="colTitle" tabindex="0">Created<span class="sort">&#160<i class="ms-Icon ms-Icon--ChevronDown"></i></span></span></th>
                        <th><span class="colTitle" tabindex="0">Elapsed Time<span class="sort">  </span></span></th>
                        <th><span class="colTitle" tabindex="0">Platform<span class="sort">  </span></span></th>
                    </thead>

                </table>
            </main>
            <div id = 'loadingDiv'>
                Loading &#160 &#160 <span id= "loading"></span>
            </div>
            <div class = 'loadMoreBtn'>
                <button id= "loadBtn" class="viewLog">Load More Logs</button>
            </div>
            <script src= "${scriptFile}"></script>
        </body>`;
    }
    getLogTableItem(log, logId) {
        const task = log.task ? log.task : '';
        const prettyDate = log.createTime ? this.getPrettyDate(log.createTime) : '';
        const timeElapsed = log.startTime && log.finishTime ? Math.ceil((log.finishTime.valueOf() - log.startTime.valueOf()) / 1000).toString() + 's' : '';
        const osType = log.platform.os ? log.platform.os : '';
        const name = log.name ? log.name : '';
        const imageOutput = this.getImageOutputTable(log);
        const statusIcon = this.getLogStatusIcon(log.status);
        return `
         <tbody class = "holder">
            <tr id= "btn${logId}" class="accordion" tabindex="0">
                    <td class = 'arrowHolder'><div class = "arrow"><i class="ms-Icon ms-Icon--ChevronRight"></i></div></td>
                    <td>${name}</td>
                    <td>${task}</td>
                    <td class ='status ' data-status = '${log.status}'>${statusIcon} ${log.status}</td>
                    <td data-createdtime="${log.createTime.toLocaleString()}">${prettyDate}</td>
                    <td>${timeElapsed}</td>
                    <td>${osType}</td>
            </tr>
            <tr class="panel">
                <td colspan = "7">
                    <div class= "paddingDiv overflowX">
                        <table class="innerTable">
                            <tr>
                                <td class = "arrowHolder">&#160</td>
                                <th class = "borderLimit">Tag</th>
                                <th>Repository</th>
                                <th>Digest</th>
                                <th colspan = "3">
                                    <p class = "textAlignRight">Log  <i data-id = '${logId}' class="openLog ms-Icon ms-Icon--OpenInNewWindow" tabindex="0"></i>  <i data-id = '${logId}' class="downloadlog ms-Icon ms-Icon--Copy" tabindex="0"></i></p>
                                </th>
                            </tr>
                            ${imageOutput}
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>`;
    }
    getImageItem(islastTd, img) {
        if (img) {
            const tag = img.tag ? img.tag : '';
            const repository = img.repository ? img.repository : '';
            const digest = img.digest ? img.digest : '';
            const truncatedDigest = digest ? digest.substr(0, 5) + '...' + digest.substr(digest.length - 5) : '';
            const lastTd = islastTd ? 'lastTd' : '';
            return `<tr>
                        <td class = "arrowHolder">&#160</td>
                        <td class = "borderLimit  ${lastTd}">${tag}</td>
                        <td class = "${lastTd}">${repository}</td>
                        <td class = "${lastTd}" data-digest = "${digest}">
                            <span class = "tooltip">
                                ${truncatedDigest}
                                <span class="tooltiptext">${digest}</span>
                            </span>
                            <i class="copy downloadlog ms-Icon ms-Icon--Copy" tabindex="0"></i>
                        </td>
                        <td class = "${lastTd}" colspan = "3" ></td>
                    </tr>`;
        }
        else {
            return `<tr>
                        <td class = "arrowHolder lastTd">&#160</td>
                        <td class = "borderLimit lastTd">NA</td>
                        <td class = "lastTd">NA</td>
                        <td class = "lastTd">NA</td>
                        <td class = "lastTd" colspan = "3" ></td>
                    </tr>`;
        }
    }
    getLogStatusIcon(status) {
        if (!status) {
            return '';
        }
        switch (status) {
            case 'Error':
                return '<i class="ms-Icon ms-Icon--CriticalErrorSolid"></i>';
            case 'Failed':
                return '<i class="ms-Icon ms-Icon--StatusErrorFull"></i>';
            case 'Succeeded':
                return '<i class="ms-Icon ms-Icon--CompletedSolid"></i>';
            case 'Queued':
                return '<i class="ms-Icon ms-Icon--SkypeCircleClock"></i>';
            case 'Running':
                return '<i class="ms-Icon ms-Icon--MSNVideosSolid"></i>';
            default:
                return '';
        }
    }
    getPrettyDate(date) {
        let currentDate = new Date();
        let secs = Math.floor((currentDate.getTime() - date.getTime()) / 1000);
        if (secs === 1) {
            return "1 second ago";
        }
        if (secs < 60) {
            return secs + " seconds ago";
        }
        if (secs < 120) {
            return " 1 minute ago";
        }
        if (secs < 3600) {
            return Math.floor(secs / 60) + " minutes ago";
        }
        if (secs < 7200) {
            return Math.floor(secs / 60) + "1 hour ago";
        }
        if (secs < 86400) {
            return Math.floor(secs / 3600) + " hours ago";
        }
        if (secs < 172800) {
            return "1 day ago";
        }
        if (secs < 604800) {
            return Math.floor(secs / 86400) + " days ago";
        }
        if (secs < 1209600) {
            return "1 week ago";
        }
        if (secs < 2592000) {
            return Math.floor(secs / 604800) + " weeks ago";
        }
        if (secs < 5184000) {
            return "1 month ago";
        }
        if (secs < 31536000) {
            return Math.floor(secs / 2592000) + " months ago";
        }
        if (secs < 63072000) {
            return "1 year ago";
        }
        return Math.floor(secs / 31536000) + " years ago";
    }
}
exports.LogTableWebview = LogTableWebview;
//# sourceMappingURL=tableViewManager.js.map