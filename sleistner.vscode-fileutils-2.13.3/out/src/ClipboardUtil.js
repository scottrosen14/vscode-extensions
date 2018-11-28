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
const copy_paste_win32fix_1 = require("copy-paste-win32fix");
const util_1 = require("util");
const clipboardCopy = util_1.promisify(copy_paste_win32fix_1.copy);
const clipboardPaste = util_1.promisify(copy_paste_win32fix_1.paste);
const GENERIC_ERROR_MESSAGE = 'Could not perform copy file name to clipboard';
// Possible errors and their suggested solutions
const POSSIBLE_ERROR_MAP = {
    'spawn xclip ENOENT': 'Please install xclip package (`apt-get install xclip`)'
};
class ClipboardUtil {
    static getClipboardContent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return clipboardPaste();
            }
            catch (error) {
                this.handleError(error.message);
            }
        });
    }
    static setClipboardContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return clipboardCopy(content);
            }
            catch (error) {
                this.handleError(error.message);
            }
        });
    }
    static handleClipboardError(error) {
        // As explained in BaseFileController.getSourcePath(),
        // Whenever the window.activeTextEditor doesn't exist, we attempt to retrieve the source path
        // using clipboard manipulations.
        // This can lead to errors in unsupported platforms, which are suppressed during tests.
        if (POSSIBLE_ERROR_MAP[error.message]) {
            return;
        }
        // If error is not a known clipboard error - re-throw it.
        throw (error);
    }
    static handleError(errorMessage) {
        // Can happen on unsupported platforms (e.g Linux machine without the xclip package installed).
        // Attempting to provide a solution according to the error received
        const errorSolution = POSSIBLE_ERROR_MAP[errorMessage];
        const errorMessageSuffix = errorSolution || errorMessage;
        throw new Error(`${GENERIC_ERROR_MESSAGE}: ${errorMessageSuffix}`);
    }
}
exports.ClipboardUtil = ClipboardUtil;
//# sourceMappingURL=ClipboardUtil.js.map