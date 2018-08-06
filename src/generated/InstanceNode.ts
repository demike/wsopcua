

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Node} from './Node';
import {INode} from './Node';

export interface IInstanceNode extends INode {
		noOfRolePermissions? : ec.Int32;
		noOfUserRolePermissions? : ec.Int32;
		noOfReferences? : ec.Int32;
}

/**

*/

export class InstanceNode extends Node {
 		noOfRolePermissions : ec.Int32;
		noOfUserRolePermissions : ec.Int32;
		noOfReferences : ec.Int32;

	constructor(	options? : IInstanceNode) { 
		options = options || {};
		super(options);
		this.noOfRolePermissions= (options.noOfRolePermissions) ? options.noOfRolePermissions:null;
		this.noOfUserRolePermissions= (options.noOfUserRolePermissions) ? options.noOfUserRolePermissions:null;
		this.noOfReferences= (options.noOfReferences) ? options.noOfReferences:null;

	}


	encode(	out : DataStream) { 
		super.encode(out);
		ec.encodeInt32(this.noOfRolePermissions,out);
		ec.encodeInt32(this.noOfUserRolePermissions,out);
		ec.encodeInt32(this.noOfReferences,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.noOfRolePermissions = ec.decodeInt32(inp);
		this.noOfUserRolePermissions = ec.decodeInt32(inp);
		this.noOfReferences = ec.decodeInt32(inp);

	}


	clone(	target? : InstanceNode) : InstanceNode { 
		if(!target) {
			target = new InstanceNode();
		}
		super.clone(target);
		target.noOfRolePermissions = this.noOfRolePermissions;
		target.noOfUserRolePermissions = this.noOfUserRolePermissions;
		target.noOfReferences = this.noOfReferences;
		return target;
	}


}
export function decodeInstanceNode(	inp : DataStream) : InstanceNode { 
		let obj = new InstanceNode();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("InstanceNode",InstanceNode, makeExpandedNodeId(11889,0));