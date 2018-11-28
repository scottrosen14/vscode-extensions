'use strict';
const vscode = require("vscode");
const CustomPattern = require("./CustomPattern");
class CustomPatternDecorator {
    constructor() {
        this._configPattern = [];
        this._cache = new Map();
    }
    updateConfiguration() {
        const configPatterns = vscode.workspace.getConfiguration('logFileHighlighter').get('customPatterns');
        for (const pattern of this._configPattern) {
            pattern.dispose();
        }
        this._configPattern = [];
        for (const item of configPatterns) {
            if (item.foreground !== undefined && item.pattern !== undefined) {
                this._configPattern.push(new CustomPattern(item.pattern, item.foreground));
            }
        }
    }
    decorateDocument(changedEvent) {
        if (this._configPattern.length === 0 || changedEvent.contentChanges.length === 0) {
            return;
        }
        const doc = changedEvent.document;
        const editors = vscode.window.visibleTextEditors.filter((editor) => {
            return editor.document.fileName === doc.fileName;
        });
        const change = changedEvent.contentChanges.sort((a, b) => Math.abs(a.range.start.line - b.range.start.line))[0];
        // Start always at the beginning of the line.
        const startPos = new vscode.Position(change.range.start.line, 0);
        const docCache = this._cache.get(doc.uri);
        const contentToEnd = doc.getText(new vscode.Range(startPos, doc.lineAt(doc.lineCount - 1).range.end));
        for (const logLevel of this._configPattern) {
            const patternCache = docCache.get(logLevel);
            // Remove all ranges from the cache that occur after the changed range (change.range).
            const logLevelRanges = patternCache.filter((range) => {
                return range.end.isBefore(change.range.start);
            });
            for (const regex of logLevel.regexes) {
                let matches = regex.exec(contentToEnd);
                while (matches) {
                    const start = doc.positionAt(doc.offsetAt(startPos) + matches.index);
                    const end = start.translate(0, matches[0].length);
                    logLevelRanges.push(new vscode.Range(start, end));
                    matches = regex.exec(contentToEnd);
                }
            }
            // Update cache and set decorations.
            docCache.set(logLevel, logLevelRanges);
            editors[0].setDecorations(logLevel.decoration, logLevelRanges);
        }
        this._cache.set(doc.uri, docCache);
    }
    decorateEditors(editors, changes) {
        if (editors.length >= 1) {
            for (const editor of editors) {
                const content = editor.document.getText();
                const docRanges = new Map();
                for (const logLevel of this._configPattern) {
                    const logLevelRanges = [];
                    for (const regex of logLevel.regexes) {
                        let matches = regex.exec(content);
                        while (matches) {
                            const start = editor.document.positionAt(matches.index);
                            const end = start.translate(0, matches[0].length);
                            logLevelRanges.push(new vscode.Range(start, end));
                            matches = regex.exec(content);
                        }
                    }
                    // Update cache and set decorations.
                    editor.setDecorations(logLevel.decoration, logLevelRanges);
                    docRanges.set(logLevel, logLevelRanges);
                }
                this._cache.set(editor.document.uri, docRanges);
            }
        }
    }
    dispose() {
        for (const level of this._configPattern) {
            level.dispose();
        }
        this._cache.forEach((patternCache) => {
            for (const pattern of patternCache.keys()) {
                pattern.dispose();
            }
        });
    }
}
module.exports = CustomPatternDecorator;
//# sourceMappingURL=CustomPatternDecorator.js.map