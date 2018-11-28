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
const fs = require("fs");
const gitignoreToGlob = require("gitignore-to-glob");
const glob_1 = require("glob");
const path = require("path");
const vscode_1 = require("vscode");
const config_1 = require("../lib/config");
class TreeWalker {
    directories(sourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const ignore = [
                ...this.gitignoreGlobs(sourcePath),
                ...this.configIgnoredGlobs()
            ]
                .map(this.invertGlob);
            const results = glob_1.sync('**', { cwd: sourcePath, ignore })
                .filter((file) => fs.statSync(path.join(sourcePath, file)).isDirectory())
                .map((file) => path.sep + file);
            return results;
        });
    }
    gitignoreGlobs(sourcePath) {
        const gitignoreFiles = this.walkupGitignores(sourcePath);
        return gitignoreFiles
            .map(gitignoreToGlob)
            .reduce(this.flatten, []);
    }
    walkupGitignores(dir, found = []) {
        const gitignore = path.join(dir, '.gitignore');
        if (fs.existsSync(gitignore)) {
            found.push(gitignore);
        }
        const parentDir = path.resolve(dir, '..');
        const reachedSystemRoot = dir === parentDir;
        if (!reachedSystemRoot) {
            return this.walkupGitignores(parentDir, found);
        }
        return found;
    }
    configIgnoredGlobs() {
        const configFilesExclude = Object.assign({}, config_1.getConfiguration('typeahead.exclude'), vscode_1.workspace.getConfiguration('files.exclude'));
        const configIgnored = Object.keys(configFilesExclude)
            .filter((key) => configFilesExclude[key] === true);
        return gitignoreToGlob(configIgnored.join('\n'), { string: true });
    }
    invertGlob(pattern) {
        return pattern.replace(/^!/, '');
    }
    flatten(memo, item) {
        return memo.concat(item);
    }
}
exports.TreeWalker = TreeWalker;
//# sourceMappingURL=TreeWalker.js.map