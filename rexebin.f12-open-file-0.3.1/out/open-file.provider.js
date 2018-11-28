"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
/**
 * Definition Provider for the extension.
 */
class OpenRelativeFileDefinitionProvider {
    provideDefinition(document, position, token) {
        return this.provideOpenFileDefinition(document, position);
    }
    provideOpenFileDefinition(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileName = this._getRelativePath(document, position);
                if (fileName === "") {
                    throw new Error("File not valid");
                }
                const targetFile = this._getAbsolutePath(document.fileName, fileName);
                const doc = yield vscode_1.workspace.openTextDocument(targetFile);
                return new vscode_1.Location(doc.uri, new vscode_1.Position(0, 0));
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Get a valid relative path from given document and position.
     * @param document current text document
     * @param position current cursor position
     *
     * @returns a valid relative path or empty string
     */
    _getRelativePath(document, position) {
        const text = document.lineAt(position).text;
        const indexOfCursor = position.character;
        let relativePath = "";
        if (/(?:"|')/.test(text)) {
            let stack = text.match(/(?:'|")(.*?)(?:'|")/g);
            if (stack) {
                stack.forEach(string => {
                    const start = text.indexOf(string);
                    const end = start + string.length;
                    if (indexOfCursor >= start && indexOfCursor <= end) {
                        relativePath = string;
                    }
                });
            }
        }
        relativePath = relativePath.replace(/['"]+/g, "");
        if (!relativePath || !relativePath.startsWith(".")) {
            return "";
        }
        return relativePath;
    }
    /**
     * Get absolute path of a relative path from a base path.
     * @param baseAbsolutePath base path on which a new path will be computing on
     * @param relativePath relative path to the above base path
     *
     * @returns a new absolute path of the given relative path.
     */
    _getAbsolutePath(baseAbsolutePath, relativePath) {
        let stack = [];
        let isWindows = false;
        if (baseAbsolutePath.indexOf("\\") !== -1) {
            stack = baseAbsolutePath.split("\\");
            isWindows = true;
        }
        else {
            stack = baseAbsolutePath.split("/");
        }
        let parts = relativePath.split("/");
        stack.pop();
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === ".") {
                continue;
            }
            if (parts[i] === "..") {
                stack.pop();
            }
            else {
                stack.push(parts[i]);
            }
        }
        if (isWindows) {
            return stack.join("\\");
        }
        return stack.join("/");
    }
}
exports.OpenRelativeFileDefinitionProvider = OpenRelativeFileDefinitionProvider;
//# sourceMappingURL=open-file.provider.js.map