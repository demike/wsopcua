import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { RolePermissionType } from './RolePermissionType';
import { ReferenceNode } from './ReferenceNode';
import { DataStream } from '../basic-types/DataStream';
import { InstanceNode } from './InstanceNode';
import { IInstanceNode } from './InstanceNode';
export interface IViewNode extends IInstanceNode {
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
    containsNoLoops?: boolean;
    eventNotifier?: ec.Byte;
}
/**

*/
export declare class ViewNode extends InstanceNode {
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
    containsNoLoops: boolean;
    eventNotifier: ec.Byte;
    constructor(options?: IViewNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ViewNode): ViewNode;
}
export declare function decodeViewNode(inp: DataStream): ViewNode;
