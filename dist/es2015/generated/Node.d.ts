import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { RolePermissionType } from './RolePermissionType';
import { ReferenceNode } from './ReferenceNode';
import { DataStream } from '../basic-types/DataStream';
export interface INode {
    nodeId?: ec.NodeId;
    nodeClass?: NodeClass;
    browseName?: QualifiedName;
    displayName?: LocalizedText;
    description?: LocalizedText;
    writeMask?: ec.UInt32;
    userWriteMask?: ec.UInt32;
    rolePermissions?: RolePermissionType[];
    userRolePermissions?: RolePermissionType[];
    accessRestrictions?: ec.UInt16;
    references?: ReferenceNode[];
}
/**
Specifies the attributes which belong to all nodes.
*/
export declare class Node {
    nodeId: ec.NodeId;
    nodeClass: NodeClass;
    browseName: QualifiedName;
    displayName: LocalizedText;
    description: LocalizedText;
    writeMask: ec.UInt32;
    userWriteMask: ec.UInt32;
    rolePermissions: RolePermissionType[];
    userRolePermissions: RolePermissionType[];
    accessRestrictions: ec.UInt16;
    references: ReferenceNode[];
    constructor(options?: INode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: Node): Node;
}
export declare function decodeNode(inp: DataStream): Node;
