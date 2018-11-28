"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VSCodeCache = require("vscode-cache");
class Cache extends VSCodeCache {
    constructor(namespace) {
        super(Cache.Context, namespace);
    }
    static set context(context) {
        Cache.Context = context;
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map