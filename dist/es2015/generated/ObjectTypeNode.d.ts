import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { RolePermissionType } from './RolePermissionType';
import { ReferenceNode } from './ReferenceNode';
import { DataStream } from '../basic-types/DataStream';
import { TypeNode } from './TypeNode';
import { ITypeNode } from './TypeNode';
export interface IObjectTypeNode extends ITypeNode {
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
    isAbstract?: boolean;
}
/**
Specifies the attributes which belong to object type nodes.
*/
export declare class ObjectTypeNode extends TypeNode {
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
    isAbstract: boolean;
    constructor(options?: IObjectTypeNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ObjectTypeNode): ObjectTypeNode;
}
export declare function decodeObjectTypeNode(inp: DataStream): ObjectTypeNode;
