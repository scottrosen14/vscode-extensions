'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const CustomPatternController = require("./CustomPatternController");
const CustomPatternDecorator = require("./CustomPatternDecorator");
const TimePeriodCalculator = require("./TimePeriodCalculator");
const TimePeriodController = require("./TimePeriodController");
// this method is called when the extension is activated
function activate(context) {
    // create a new time calculator and controller
    const timeCalculator = new TimePeriodCalculator();
    const timeController = new TimePeriodController(timeCalculator);
    // create log level colorizer and -controller
    const customPatternDecorator = new CustomPatternDecorator();
    const customPatternController = new CustomPatternController(customPatternDecorator);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(timeController, customPatternController);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    // Nothing to do here
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map