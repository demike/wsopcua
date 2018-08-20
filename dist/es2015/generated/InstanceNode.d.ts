import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { Node } from './Node';
import { INode } from './Node';
export interface IInstanceNode extends INode {
    noOfRolePermissions?: ec.Int32;
    noOfUserRolePermissions?: ec.Int32;
    noOfReferences?: ec.Int32;
}
/**

*/
export declare class InstanceNode extends Node {
    noOfRolePermissions: ec.Int32;
    noOfUserRolePermissions: ec.Int32;
    noOfReferences: ec.Int32;
    constructor(options?: IInstanceNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: InstanceNode): InstanceNode;
}
export declare function decodeInstanceNode(inp: DataStream): InstanceNode;
