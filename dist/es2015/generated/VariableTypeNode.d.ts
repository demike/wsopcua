import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { RolePermissionType } from './RolePermissionType';
import { ReferenceNode } from './ReferenceNode';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
import { TypeNode } from './TypeNode';
import { ITypeNode } from './TypeNode';
export interface IVariableTypeNode extends ITypeNode {
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
    value?: Variant;
    dataType?: ec.NodeId;
    valueRank?: ec.Int32;
    arrayDimensions?: ec.UInt32[];
    isAbstract?: boolean;
}
/**
Specifies the attributes which belong to variable type nodes.
*/
export declare class VariableTypeNode extends TypeNode {
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
    value: Variant;
    dataType: ec.NodeId;
    valueRank: ec.Int32;
    arrayDimensions: ec.UInt32[];
    isAbstract: boolean;
    constructor(options?: IVariableTypeNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: VariableTypeNode): VariableTypeNode;
}
export declare function decodeVariableTypeNode(inp: DataStream): VariableTypeNode;
