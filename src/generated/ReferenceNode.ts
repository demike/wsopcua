

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IReferenceNode {
		referenceTypeId? : ec.NodeId;
		isInverse? : boolean;
		targetId? : ec.ExpandedNodeId;
}

/**
Specifies a reference which belongs to a node.
*/

export class ReferenceNode {
 		referenceTypeId : ec.NodeId;
		isInverse : boolean;
		targetId : ec.ExpandedNodeId;

	constructor(	options? : IReferenceNode) { 
		options = options || {};
		this.referenceTypeId= (options.referenceTypeId) ? options.referenceTypeId:null;
		this.isInverse= (options.isInverse) ? options.isInverse:null;
		this.targetId= (options.targetId) ? options.targetId:null;

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.referenceTypeId,out);
		ec.encodeBoolean(this.isInverse,out);
		ec.encodeExpandedNodeId(this.targetId,out);

	}


	decode(	inp : DataStream) { 
		this.referenceTypeId = ec.decodeNodeId(inp);
		this.isInverse = ec.decodeBoolean(inp);
		this.targetId = ec.decodeExpandedNodeId(inp);

	}


	clone(	target? : ReferenceNode) : ReferenceNode { 
		if(!target) {
			target = new ReferenceNode();
		}
		target.referenceTypeId = this.referenceTypeId;
		target.isInverse = this.isInverse;
		target.targetId = this.targetId;
		return target;
	}


}
export function decodeReferenceNode(	inp : DataStream) : ReferenceNode { 
		let obj = new ReferenceNode();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReferenceNode",ReferenceNode, makeExpandedNodeId(287,0));