import { KeyMetaData, TypeGroup, TypeDescription } from './model';
export declare function isHash(str: string): boolean;
export declare function onlyUnique(value: any, index: any, self: any): boolean;
export declare function isArray(x: any): boolean;
export declare function isNonArrayUnion(typeName: string): boolean;
export declare function isObject(x: any): boolean;
export declare function parseKeyMetaData(key: string): KeyMetaData;
export declare function getTypeDescriptionGroup(desc: TypeDescription): TypeGroup;
export declare function findTypeById(id: string, types: TypeDescription[]): TypeDescription;
