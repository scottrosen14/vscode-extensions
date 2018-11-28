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
const path = require("path");
const vscode_1 = require("vscode");
const Cache_1 = require("../lib/Cache");
const TreeWalker_1 = require("../lib/TreeWalker");
class TypeAheadController {
    showDialog(sourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = new Cache_1.Cache(`workspace:${sourcePath}`);
            const choices = yield this.buildChoices(sourcePath, cache);
            if (choices.length < 2) {
                return sourcePath;
            }
            const item = yield this.showQuickPick(choices);
            if (!item) {
                throw new Error();
            }
            const selection = item.label;
            cache.put('last', selection);
            return path.join(sourcePath, selection);
        });
    }
    buildChoices(sourcePath, cache) {
        return __awaiter(this, void 0, void 0, function* () {
            const treeWalker = new TreeWalker_1.TreeWalker();
            return treeWalker.directories(sourcePath)
                .then(this.toQuickPickItems)
                .then(this.prependChoice('/', '- workspace root'))
                .then(this.prependChoice(cache.get('last'), '- last selection'));
        });
    }
    prependChoice(label, description) {
        return (choices) => {
            if (label) {
                const choice = { description, label };
                choices.unshift(choice);
            }
            return choices;
        };
    }
    toQuickPickItems(choices) {
        return __awaiter(this, void 0, void 0, function* () {
            return choices.map((choice) => ({ label: choice, description: null }));
        });
    }
    showQuickPick(choices) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeHolder = `
            First, select an existing path to create relative to (larger projects may take a moment to load)
        `;
            return vscode_1.window.showQuickPick(choices, { placeHolder });
        });
    }
}
exports.TypeAheadController = TypeAheadController;
//# sourceMappingURL=TypeAheadController.js.map