import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRolePermissionType {
    roleId?: ec.NodeId;
    permissions?: ec.UInt32;
}
/**

*/
export declare class RolePermissionType {
    roleId: ec.NodeId;
    permissions: ec.UInt32;
    constructor(options?: IRolePermissionType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RolePermissionType): RolePermissionType;
}
export declare function decodeRolePermissionType(inp: DataStream): RolePermissionType;
