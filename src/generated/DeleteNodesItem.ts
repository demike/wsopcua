

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteNodesItem {
		nodeId?: ec.NodeId;
		deleteTargetReferences?: boolean;
}

/**
A request to delete a node to the server address space.
*/

export class DeleteNodesItem {
 		nodeId: ec.NodeId;
		deleteTargetReferences: boolean;

	constructor(	options?: IDeleteNodesItem) { 
		options = options || {};
		this.nodeId= (options.nodeId) ? options.nodeId:null;
		this.deleteTargetReferences= (options.deleteTargetReferences) ? options.deleteTargetReferences:null;

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.nodeId,out);
		ec.encodeBoolean(this.deleteTargetReferences,out);

	}


	decode(	inp: DataStream) { 
		this.nodeId = ec.decodeNodeId(inp);
		this.deleteTargetReferences = ec.decodeBoolean(inp);

	}


	clone(	target?: DeleteNodesItem): DeleteNodesItem { 
		if(!target) {
			target = new DeleteNodesItem();
		}
		target.nodeId = this.nodeId;
		target.deleteTargetReferences = this.deleteTargetReferences;
		return target;
	}


}
export function decodeDeleteNodesItem(	inp: DataStream): DeleteNodesItem { 
		const obj = new DeleteNodesItem();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteNodesItem",DeleteNodesItem, makeExpandedNodeId(384,0));