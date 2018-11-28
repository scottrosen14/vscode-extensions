"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("./../src/js/utils");
describe('Utility Tests', () => {
    describe('IsNumber', () => {
        it('Returns Correct Value', () => {
            expect(Utils.isNumber(0)).toBe(true);
            expect(Utils.isNumber(1)).toBe(true);
            expect(Utils.isNumber(false)).toBe(false);
            expect(Utils.isNumber(null)).toBe(false); // tslint:disable-line:no-null-keyword
            expect(Utils.isNumber(undefined)).toBe(false);
        });
    });
    describe('htmlEntities', () => {
        it('Encodes characters properly', () => {
            ['\u00A0', '\u1000', '\u8000', '\u9999', '\'', '"', '<', '>', '&'].forEach((item) => {
                let expectedValue = `&#${item.charCodeAt(0)};`;
                expect(Utils.htmlEntities(item)).toEqual(expectedValue);
            });
        });
        it('Does not encode characters outside the range', () => {
            ['a', 'A', '$', '0', ''].forEach((item) => {
                expect(Utils.htmlEntities(item)).toEqual(item);
            });
        });
        it('Does not attempt encoding if the value is null or undefined', () => {
            // We're explicitly checking null b/c this is what comes back from the service
            [null, undefined].forEach((item) => {
                expect(Utils.htmlEntities(item)).toEqual(undefined);
            });
        });
    });
    describe('isDbCellValue', () => {
        it('Detects undefined properly', () => {
            let dbCellValue = undefined;
            expect(Utils.isDbCellValue(dbCellValue)).toEqual(false);
        });
        it('Detects a DbCellValue properly', () => {
            let dbCellValue = { displayValue: 'qqq', isNull: false };
            expect(Utils.isDbCellValue(dbCellValue)).toEqual(true);
        });
        it('Detects a non-DbCellValue properly', () => {
            let nonDbCellValue = 'qqq';
            expect(Utils.isDbCellValue(nonDbCellValue)).toEqual(false);
        });
    });
});

//# sourceMappingURL=utils.spec.js.map
