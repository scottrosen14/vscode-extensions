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
const controller_1 = require("../controller");
const BaseCommand_1 = require("./BaseCommand");
class RemoveFileCommand extends BaseCommand_1.BaseCommand {
    constructor(controller) {
        super(controller || new controller_1.RemoveFileController());
    }
    execute(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileItem = yield this.controller.showDialog();
            yield this.controller.execute({ fileItem });
            return this.controller.closeCurrentFileEditor();
        });
    }
}
exports.RemoveFileCommand = RemoveFileCommand;
//# sourceMappingURL=RemoveFileCommand.js.map