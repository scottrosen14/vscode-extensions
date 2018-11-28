"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
/**
 * Config store.
 */
class Config {
}
Config.isSplit = vscode_1.workspace
    .getConfiguration("openFile")
    .get("openSideBySide");
exports.Config = Config;
//# sourceMappingURL=config.js.map