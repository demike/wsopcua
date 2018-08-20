import { ExpandedNodeId } from "../basic-types";
export declare function getFactory(type_name: string): any;
export declare function registerFactory(type_name: string, constructor: Function): void;
export declare function dump(): void;
export declare function callConstructor(constructor: Function): any;
export declare function getConstructor(expandedId: any): any;
export declare function hasConstructor(expandedId: any): boolean;
export declare function constructObject(expandedNodeId: any): any;
export declare function register_class_definition(classname: string, class_constructor: any, nodeId: ExpandedNodeId): void;
