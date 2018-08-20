import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { Node } from './Node';
import { INode } from './Node';
export interface ITypeNode extends INode {
    noOfRolePermissions?: ec.Int32;
    noOfUserRolePermissions?: ec.Int32;
    noOfReferences?: ec.Int32;
}
/**

*/
export declare class TypeNode extends Node {
    noOfRolePermissions: ec.Int32;
    noOfUserRolePermissions: ec.Int32;
    noOfReferences: ec.Int32;
    constructor(options?: ITypeNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TypeNode): TypeNode;
}
export declare function decodeTypeNode(inp: DataStream): TypeNode;
