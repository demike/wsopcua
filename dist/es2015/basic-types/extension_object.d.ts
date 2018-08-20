import { DataStream } from './DataStream';
export declare class ExtensionObject {
}
export declare function constructEmptyExtensionObject(expandedNodeId: any): any;
export declare function encodeExtensionObject(object: any, stream: DataStream): void;
export declare function decodeExtensionObject(stream: DataStream): any;
