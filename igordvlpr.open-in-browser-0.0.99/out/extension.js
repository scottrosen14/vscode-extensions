'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
const appPaths = require('registry-apppaths');
const EXT_BROWSERS = ['chrome.exe', 'firefox.exe', 'iexplore.exe', 'opera.exe', 'safari.exe'];
let config;
let status;
let browsers;
let picker;
function loadConfig() {
    config = vscode_1.workspace.getConfiguration('openInBrowser');
}
function isWindows10() {
    return os.release().startsWith('10');
}
function getBrowsers() {
    let browsers = appPaths.has(EXT_BROWSERS);
    return browsers;
}
function getExecutable(browser) {
    let result = '';
    switch (browser) {
        case 'Internet Explorer': {
            result = 'iexplore';
            break;
        }
        default: {
            result = browser.toLowerCase();
        }
    }
    return result;
}
function setupStatusBar(context) {
    status = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
    context.subscriptions.push(status);
}
function generatePicker(browsers) {
    let picker = [];
    picker.push('Default');
    if (browsers[0])
        picker.push('Chrome');
    if (browsers[1])
        picker.push('Firefox');
    if (browsers[2])
        picker.push('Internet Explorer');
    if (browsers[3])
        picker.push('Opera');
    if (browsers[4])
        picker.push('Safari');
    picker.push('Cancel');
    return picker;
}
function openInBrowser(path, browserName = null) {
    let browser;
    let defaultBrowser;
    loadConfig();
    defaultBrowser = config.get('defaultBrowser');
    if (browserName === null || browserName === 'Default') {
        if (defaultBrowser && defaultBrowser.length && defaultBrowser !== 'Default') {
            defaultBrowser = getExecutable(defaultBrowser);
            browser = child_process_1.exec(`start ${defaultBrowser}.exe "${path}" && exit`);
        }
        else
            browser = child_process_1.exec(`"${path}"`);
    }
    else {
        browserName = getExecutable(browserName);
        browser = child_process_1.exec(`start ${browserName}.exe "${path}" && exit`);
        browser.on('error', (err) => {
            config.update('defaultBrowser', 'Default', vscode_1.ConfigurationTarget.Global);
            vscode_1.window.showErrorMessage(`${browserName} is not installed, the default browser will be used.`);
            openInBrowser(path);
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
function setBrowser(browserName) {
    config.update('defaultBrowser', browserName, vscode_1.ConfigurationTarget.Global);
    if (browserName === '' || browserName === 'Default')
        vscode_1.window.showInformationMessage('The default browser will be used for previewing HTML files.');
    else
        vscode_1.window.showInformationMessage(`${browserName} has been set as the default browser.`);
}
function activate(context) {
    loadConfig();
    let commandSelect = vscode_1.commands.registerCommand('extension.select', () => {
        browsers = browsers || getBrowsers();
        picker = picker || generatePicker(browsers);
        vscode_1.window.showQuickPick(picker).then((option) => {
            if (!option || option === '' || option === 'Cancel')
                return;
            setBrowser(option);
        });
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
        openInBrowser(filePath);
    });
    context.subscriptions.push(commandSelect);
    context.subscriptions.push(commandOpen);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map