"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function isKeyNameValid(keyName) {
    var regex = /^[a-zA-Z_][a-zA-Z\d_]*$/;
    return regex.test(keyName);
}
function parseKeyMetaData(key) {
    var isOptional = key.endsWith('--?');
    if (isOptional) {
        return {
            isOptional: isOptional,
            keyValue: key.slice(0, -3)
        };
    }
    else {
        return {
            isOptional: isOptional,
            keyValue: key
        };
    }
}
function findNameById(id, names) {
    return names.find(function (_) { return _.id === id; }).name;
}
function removeNullFromUnion(unionTypeName) {
    var typeNames = unionTypeName.split(' | ');
    var nullIndex = typeNames.indexOf('null');
    typeNames.splice(nullIndex, 1);
    return typeNames.join(' | ');
}
function replaceTypeObjIdsWithNames(typeObj, names) {
    return Object.entries(typeObj)
        .map(function (_a) {
        var key = _a[0], type = _a[1];
        var _b = parseKeyMetaData(key), isOptional = _b.isOptional, keyValue = _b.keyValue;
        var isValid = isKeyNameValid(keyValue);
        var validName = isValid ? keyValue : "'" + keyValue + "'";
        return isOptional ?
            [validName + "?", type, isOptional] :
            [validName, type, isOptional];
    })
        .map(function (_a) {
        var key = _a[0], type = _a[1], isOptional = _a[2];
        if (!util_1.isHash(type)) {
            return [key, type, isOptional];
        }
        var newType = findNameById(type, names);
        return [key, newType, isOptional];
    })
        .map(function (_a) {
        var key = _a[0], type = _a[1], isOptional = _a[2];
        if (!(util_1.isNonArrayUnion(type) && type.includes('null'))) {
            return [key, type, isOptional];
        }
        var newType = removeNullFromUnion(type);
        var newKey = isOptional ? key : key + "?"; // if already optional dont add question mark
        return [newKey, newType, isOptional];
    })
        .map(function (_a) {
        var key = _a[0], type = _a[1], isOptional = _a[2];
        if (type !== 'null') {
            return [key, type, isOptional];
        }
        var newType = 'any';
        var newKey = isOptional ? key : key + "?"; // if already optional dont add question mark
        return [newKey, newType, isOptional];
    })
        .reduce(function (agg, _a) {
        var key = _a[0], value = _a[1];
        agg[key] = value;
        return agg;
    }, {});
}
function getInterfaceStringFromDescription(_a) {
    var name = _a.name, typeMap = _a.typeMap, userOptions = _a.userOptions;
    var stringTypeMap = Object.entries(typeMap)
        .map(function (_a) {
        var key = _a[0], name = _a[1];
        return "  " + key + ": " + name + ";\n";
    })
        .reduce(function (a, b) { return a += b; }, '');
    var interfaceString = (userOptions.export ? 'export' : '') + " interface " + name + " {\n";
    interfaceString += stringTypeMap;
    interfaceString += '}';
    return interfaceString;
}
exports.getInterfaceStringFromDescription = getInterfaceStringFromDescription;
function getInterfaceDescriptions(typeStructure, names, userOptions) {
    var r = names
        .map(function (_a) {
        var id = _a.id, name = _a.name;
        var typeDescription = util_1.findTypeById(id, typeStructure.types);
        if (typeDescription.typeObj) {
            var typeMap = replaceTypeObjIdsWithNames(typeDescription.typeObj, names);
            return { name: name, typeMap: typeMap, userOptions: userOptions };
        }
        else {
            return null;
        }
    })
        .filter(function (_) { return _ !== null; });
    return r;
}
exports.getInterfaceDescriptions = getInterfaceDescriptions;
//# sourceMappingURL=get-interfaces.js.map