"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("./util/index");
var index_2 = require("../src/index");
describe('Array type merging', function () {
    it('should work with arrays with same inner types', function () {
        var json = {
            cats: [
                { name: 'Kittin' },
                { name: 'Sparkles' },
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        cats: Cat[];\n      }",
            "interface Cat {\n        name: string;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('union null type should be emited and field should be marked as optional', function () {
        var json = [
            { age: 42 },
            { age: null },
        ];
        var expectedTypes = [
            "interface RootObject {\n        age?: number;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
    it('null should stay if it is part of array elements', function () {
        var json = {
            arr: [
                42, '42', null
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        arr: (null | number | string)[];\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
    it('array types should be merge even if they are nullable', function () {
        var json = [
            {
                field: ['string']
            },
            {
                field: [42]
            },
            {
                field: null
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        field?: (number | string)[];\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
    it('object types should be merge even if they are nullable', function () {
        var json = [
            {
                field: { tag: 'world' }
            },
            {
                field: { tag: 42 }
            },
            {
                field: null
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        field?: Field;\n      }",
            "interface Field {\n        tag: number | string;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should work with arrays with inner types that has optinal field', function () {
        var json = {
            cats: [
                { name: 'Kittin' },
                { name: 'Sparkles', age: 20 },
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        cats: Cat[];\n      }",
            "interface Cat {\n        name: string;\n        age?: number;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should work with arrays with inner types that has no common fields', function () {
        var json = {
            cats: [
                { name: 'Kittin' },
                { age: 20 },
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        cats: Cat[];\n      }",
            "interface Cat {\n        name?: string;\n        age?: number;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should work with arrays with inner types that have common field that has different types', function () {
        var json = {
            cats: [
                { age: '20' },
                { age: 20 },
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        cats: Cat[];\n      }",
            "interface Cat {\n        age: number | string;\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should solve edge case 1', function () {
        var json = {
            cats: [
                { age: [42] },
                { age: ['42'] },
            ],
            dads: [
                'hello', 42
            ]
        };
        var expectedTypes = [
            "interface RootObject {\n        cats: Cat[];\n        dads: (number | string)[];\n      }",
            "interface Cat {\n        age: (number | string)[];\n      }",
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should solve edge case 2', function () {
        var json = {
            items: [
                {
                    billables: [
                        {
                            'quantity': 2,
                            'price': 0
                        }
                    ]
                },
                {
                    billables: [
                        {
                            'priceCategory': {
                                'title': 'Adult',
                                'minAge': 0,
                                'maxAge': 99
                            },
                            'quantity': 2,
                            'price': 226
                        }
                    ]
                }
            ],
        };
        var expectedTypes = [
            "interface RootObject {\n        items: Item[];\n      }",
            "interface Item {\n        billables: Billable[];\n      }",
            "interface Billable {\n        quantity: number;\n        price: number;\n        priceCategory?: PriceCategory;\n      }",
            "interface PriceCategory {\n        title: string;\n        minAge: number;\n        maxAge: number;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 4);
    });
    it('should solve edge case 3', function () {
        var json = [
            {
                nestedElements: [
                    {
                        commonField: 42,
                        optionalField: 'field'
                    },
                    {
                        commonField: 42,
                        optionalField3: 'field3'
                    }
                ]
            },
            {
                nestedElements: [
                    {
                        commonField: '42',
                        optionalField2: 'field2'
                    }
                ]
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        nestedElements: NestedElement[];\n      }",
            "interface NestedElement {\n        commonField: number | string;\n        optionalField?: string;\n        optionalField3?: string;\n        optionalField2?: string;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should merge empty array with primitive types', function () {
        var json = [
            {
                nestedElements: []
            },
            {
                nestedElements: ['kittin']
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        nestedElements: string[];\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
    it('should merge empty array with object types', function () {
        var json = [
            {
                nestedElements: []
            },
            {
                nestedElements: [{ name: 'kittin' }]
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        nestedElements: NestedElement[];\n      }",
            "interface NestedElement {\n        name: string;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 2);
    });
    it('should merge empty array with array types', function () {
        var json = [
            {
                nestedElements: []
            },
            {
                nestedElements: [['string']]
            }
        ];
        var expectedTypes = [
            "interface RootObject {\n        nestedElements: string[][];\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
    it('should merge union types with readable names ', function () {
        var json = [
            {
                marius: 'marius'
            },
            {
                marius: [42]
            },
        ];
        var expectedTypes = [
            "interface RootObject {\n        marius: number[] | string;\n      }"
        ].map(index_1.removeWhiteSpace);
        var interfaces = index_2.default(json);
        interfaces
            .forEach(function (i) {
            var noWhiteSpaceInterface = index_1.removeWhiteSpace(i);
            assert(expectedTypes.includes(noWhiteSpaceInterface));
        });
        assert.strictEqual(interfaces.length, 1);
    });
});
//# sourceMappingURL=array-merging.spec.js.map