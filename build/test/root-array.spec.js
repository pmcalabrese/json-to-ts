"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("./util/index");
var index_2 = require("../src/index");
describe('Root array type', function () {
    it('should throw error on unsupprted array types', function () {
        var unsupportedArrays = [
            ['sample string', 'sample string2'],
            [42, 32],
            [true, false],
            [null, null],
            [42, 'sample string'],
            [42, { marius: 'marius' }],
            []
        ];
        var expectedMessage = 'Only (Object) and (Array of Object) are supported';
        unsupportedArrays.forEach(function (arr) {
            try {
                index_2.default(arr);
                assert(false, 'error should be thrown');
            }
            catch (e) {
                assert.strictEqual(e.message, expectedMessage);
                if (e.message !== expectedMessage)
                    throw e;
            }
        });
    });
    it('should handle array with single object [object]', function () {
        var json = [{ marius: 'marius' }];
        var expectedTypes = [
            "interface RootObject {\n        marius: string;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.equal(interfaces.length, 1);
    });
    it('should handle array with multiple same objects [object, object]', function () {
        var json = [{ marius: 'marius' }, { marius: 'marius' }];
        var expectedTypes = [
            "interface RootObject {\n        marius: string;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.equal(interfaces.length, 1);
    });
    it('should handle array with multiple different objects [object1, object2]', function () {
        var json = [{ marius: 'marius' }, { darius: 'darius' }];
        var expectedTypes = [
            "interface RootObject {\n        marius?: string;\n        darius?: string;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.equal(interfaces.length, 1);
    });
});
//# sourceMappingURL=root-array.spec.js.map