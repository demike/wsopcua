

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRolePermissionType {
		roleId?: ec.NodeId;
		permissions?: ec.UInt32;
}

/**

*/

export class RolePermissionType {
 		roleId: ec.NodeId;
		permissions: ec.UInt32;

	constructor(	options?: IRolePermissionType) { 
		options = options || {};
		this.roleId= (options.roleId) ? options.roleId:null;
		this.permissions= (options.permissions) ? options.permissions:null;

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.roleId,out);
		ec.encodeUInt32(this.permissions,out);

	}


	decode(	inp: DataStream) { 
		this.roleId = ec.decodeNodeId(inp);
		this.permissions = ec.decodeUInt32(inp);

	}


	clone(	target?: RolePermissionType): RolePermissionType { 
		if(!target) {
			target = new RolePermissionType();
		}
		target.roleId = this.roleId;
		target.permissions = this.permissions;
		return target;
	}


}
export function decodeRolePermissionType(	inp: DataStream): RolePermissionType { 
		const obj = new RolePermissionType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RolePermissionType",RolePermissionType, makeExpandedNodeId(128,0));