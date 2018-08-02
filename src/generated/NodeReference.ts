

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface INodeReference {
		nodeId? : ec.NodeId;
		referenceTypeId? : ec.NodeId;
		isForward? : boolean;
		referencedNodeIds? : ec.NodeId[];
}

/**

*/

export class NodeReference {
 		nodeId : ec.NodeId;
		referenceTypeId : ec.NodeId;
		isForward : boolean;
		referencedNodeIds : ec.NodeId[];

	constructor(	options? : INodeReference) { 
		options = options || {};
		this.nodeId= (options.nodeId) ? options.nodeId:null;
		this.referenceTypeId= (options.referenceTypeId) ? options.referenceTypeId:null;
		this.isForward= (options.isForward) ? options.isForward:null;
		this.referencedNodeIds= (options.referencedNodeIds) ? options.referencedNodeIds:[];

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.nodeId,out);
		ec.encodeNodeId(this.referenceTypeId,out);
		ec.encodeBoolean(this.isForward,out);
		ec.encodeArray(this.referencedNodeIds,out,ec.encodeNodeId);

	}


	decode(	inp : DataStream) { 
		this.nodeId = ec.decodeNodeId(inp);
		this.referenceTypeId = ec.decodeNodeId(inp);
		this.isForward = ec.decodeBoolean(inp);
		this.referencedNodeIds = ec.decodeArray(inp,ec.decodeNodeId);

	}


	clone(	target? : NodeReference) : NodeReference { 
		if(!target) {
			target = new NodeReference();
		}
		target.nodeId = this.nodeId;
		target.referenceTypeId = this.referenceTypeId;
		target.isForward = this.isForward;
		target.referencedNodeIds = ec.cloneArray(this.referencedNodeIds);
		return target;
	}


}
export function decodeNodeReference(	inp : DataStream) : NodeReference { 
		let obj = new NodeReference();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NodeReference",NodeReference, makeExpandedNodeId(582,0));