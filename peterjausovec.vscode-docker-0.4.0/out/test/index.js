"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//
// PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
//
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.
// tslint:disable-next-line:no-require-imports no-var-requires
let testRunner = require('vscode/lib/testrunner');
let options = {
    ui: 'tdd',
    useColors: true // colored output from test results
};
// You can directly control Mocha options using environment variables beginning with MOCHA_.
// For example:
// {
//   "name": "Launch Tests",
//   "type": "extensionHost",
//   "request": "launch",
//   ...
//   "env": {
//     "MOCHA_enableTimeouts": "0",
//     "MOCHA_grep": "tests-to-run"
// }
//
// See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for all available options
let environmentVariables = process.env;
for (let envVar of Object.keys(environmentVariables)) {
    let match = envVar.match(/^mocha_(.+)/i);
    if (match) {
        let [, option] = match;
        let value = environmentVariables[envVar];
        if (typeof value === 'string' && !isNaN(parseInt(value, undefined))) {
            value = parseInt(value, undefined);
        }
        options[option] = value;
    }
}
console.warn(`Mocha options: ${JSON.stringify(options, null, 2)}`);
// tslint:disable-next-line: no-unsafe-any
testRunner.configure(options);
module.exports = testRunner;
//# sourceMappingURL=index.js.map