'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
const appPaths = require('registry-apppaths');
const EXT_BROWSERS = ['chrome.exe', 'firefox.exe', 'opera.exe'];
const config = vscode_1.workspace.getConfiguration('openInBrowser');
let status;
let browsers;
let picker;
function getBrowsers() {
    return appPaths.has(EXT_BROWSERS);
}
function setupStatusBar(context) {
    status = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
    context.subscriptions.push(status);
}
function generatePicker(browsers) {
    let picker = [];
    if (browsers[0])
        picker.push('Open in Chrome...');
    if (browsers[1])
        picker.push('Open in Firefox...');
    if (browsers[2])
        picker.push('Open in Opera...');
    if (picker.length > 0)
        picker.push('Cancel');
    return picker;
}
function getOption(option) {
    let result = '';
    switch (option) {
        case 'Open in Chrome...': {
            result = 'chrome';
            break;
        }
        case 'Open in Firefox...': {
            result = 'firefox';
            break;
        }
        case 'Open in Opera...': {
            result = 'opera';
            break;
        }
    }
    return result;
}
function openInBrowser(browserName, path) {
    let browser;
    if (browserName === '' || browserName === 'Default')
        browser = child_process_1.exec(`"${path}"`);
    else {
        browser = child_process_1.spawn(`start ${browserName}.exe "${path}"`);
        browser.on('error', (err) => {
            config.update('defaultBrowser', 'Default');
            vscode_1.window.showErrorMessage(`${browserName} is not installed, the default browser will be used.`);
            openInBrowser(browserName, path);
        });
    }
    status.text = 'Opening...';
    status.show();
    const timer = setTimeout(() => {
        status.hide();
        clearTimeout(timer);
    }, 1100);
}
function getExtension(filename) {
    const extension = filename.split('.');
    if (extension.length === 0)
        return '';
    return extension[extension.length - 1].toLowerCase();
}
function select(browsers) {
    vscode_1.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: 'Chrome',
        prompt: 'Type in your favorite browser, e.g. Chrome'
    }).then((value) => {
        value = value.toLowerCase();
        vscode_1.window.showInformationMessage(value);
    });
}
function activate(context) {
    browsers = browsers || getBrowsers();
    let commandSelect = vscode_1.commands.registerCommand('extension.select', () => {
        select(browsers);
    });
    let commandOpen = vscode_1.commands.registerCommand('extension.open', () => {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return;
        const filePath = editor.document.uri.fsPath;
        const extension = getExtension(filePath);
        if (extension !== 'html' && extension !== 'xhtml' && extension !== 'htm') {
            vscode_1.window.showInformationMessage('No active HTML file.');
            return;
        }
        setupStatusBar(context);
        picker = picker || generatePicker(browsers);
        vscode_1.window.showQuickPick(picker).then((option) => {
            const browser = getOption(option);
            openInBrowser(browser, filePath);
        });
    });
    context.subscriptions.push(commandSelect);
    context.subscriptions.push(commandOpen);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map