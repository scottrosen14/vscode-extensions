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
const fs = require("fs-extra");
const path = require("path");
const trash = require("trash");
class FileItem {
    constructor(SourcePath, TargetPath, IsDir = false) {
        this.SourcePath = SourcePath;
        this.TargetPath = TargetPath;
        this.IsDir = IsDir;
    }
    get name() {
        return path.basename(this.SourcePath);
    }
    get path() {
        return this.SourcePath;
    }
    get targetPath() {
        return this.TargetPath;
    }
    get exists() {
        return fs.existsSync(this.targetPath);
    }
    get isDir() {
        return this.IsDir;
    }
    move() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDir();
            yield fs.rename(this.path, this.targetPath);
            this.SourcePath = this.targetPath;
            return this;
        });
    }
    duplicate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDir();
            yield fs.copy(this.path, this.targetPath);
            return new FileItem(this.targetPath);
        });
    }
    remove(useTrash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield useTrash) ? trash([this.path]) : fs.remove(this.path);
            return this;
        });
    }
    create(mkDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = mkDir === true || this.isDir ? fs.ensureDir : fs.createFile;
            yield fs.remove(this.targetPath);
            yield fn(this.targetPath);
            return new FileItem(this.targetPath);
        });
    }
    ensureDir() {
        return __awaiter(this, void 0, void 0, function* () {
            return fs.ensureDir(path.dirname(this.targetPath));
        });
    }
}
exports.FileItem = FileItem;
//# sourceMappingURL=Item.js.map