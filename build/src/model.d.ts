export declare enum TypeGroup {
    Primitive = 0,
    Array = 1,
    Object = 2,
}
export interface TypeDescription {
    id: string;
    isUnion?: boolean;
    typeObj?: {
        [index: string]: string;
    };
    arrayOfTypes?: string[];
}
export interface TypeStructure {
    rootTypeId: string;
    types: TypeDescription[];
}
export interface NameEntry {
    id: string;
    name: string;
}
export interface NameStructure {
    rootName: string;
    names: NameEntry[];
}
export interface InterfaceDescription {
    name: string;
    typeMap: object;
    userOptions: Options;
}
export interface Options {
    rootName: string;
    export: boolean;
}
export interface KeyMetaData {
    keyValue: string;
    isOptional: boolean;
}
