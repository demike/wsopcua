import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { RolePermissionType } from './RolePermissionType';
import { ReferenceNode } from './ReferenceNode';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
import { InstanceNode } from './InstanceNode';
import { IInstanceNode } from './InstanceNode';
export interface IVariableNode extends IInstanceNode {
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
    accessLevel?: ec.Byte;
    userAccessLevel?: ec.Byte;
    minimumSamplingInterval?: ec.Double;
    historizing?: boolean;
    accessLevelEx?: ec.UInt32;
}
/**
Specifies the attributes which belong to variable nodes.
*/
export declare class VariableNode extends InstanceNode {
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
    accessLevel: ec.Byte;
    userAccessLevel: ec.Byte;
    minimumSamplingInterval: ec.Double;
    historizing: boolean;
    accessLevelEx: ec.UInt32;
    constructor(options?: IVariableNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: VariableNode): VariableNode;
}
export declare function decodeVariableNode(inp: DataStream): VariableNode;
