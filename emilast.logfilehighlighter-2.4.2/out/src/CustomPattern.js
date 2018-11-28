'use strict';
const vscode = require("vscode");
class CustomPattern {
    constructor(pattern, foreground) {
        this.pattern = pattern;
        this.foreground = foreground;
        this.regexes = this.createRegex(pattern);
        this.decoration = vscode.window.createTextEditorDecorationType({
            color: this.foreground,
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }
    dispose() {
        this.decoration.dispose();
    }
    createRegex(pattern) {
        const result = [];
        // Check if the log level value is a "simple" string or not.
        if (!/^\w+$/g.test(pattern)) {
            // log level is already regex.
            try {
                result.push(new RegExp(pattern, 'gm'));
            }
            catch (err) {
                vscode.window.showErrorMessage('Regex of custom log level is invalid. Error: ' + err);
            }
        }
        else {
            // Log level consists only of "simple" characters -> build regex.
            const first = new RegExp('\\b(?!\\[)(' + pattern.toUpperCase() +
                '|' + pattern + ')(?!\\]|\\:)\\b', 'gm');
            const second = new RegExp('\\[(' + pattern + ')\\]|\\b(' + pattern + ')\\:', 'ig');
            result.push(first, second);
        }
        return result;
    }
}
module.exports = CustomPattern;
//# sourceMappingURL=CustomPattern.js.map