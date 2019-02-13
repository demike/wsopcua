

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowsePathTarget {
		targetId? : ec.ExpandedNodeId;
		remainingPathIndex? : ec.UInt32;
}

/**
The target of the translated path.
*/

export class BrowsePathTarget {
 		targetId : ec.ExpandedNodeId;
		remainingPathIndex : ec.UInt32;

	constructor(	options? : IBrowsePathTarget) { 
		options = options || {};
		this.targetId= (options.targetId) ? options.targetId:null;
		this.remainingPathIndex= (options.remainingPathIndex) ? options.remainingPathIndex:null;

	}


	encode(	out : DataStream) { 
		ec.encodeExpandedNodeId(this.targetId,out);
		ec.encodeUInt32(this.remainingPathIndex,out);

	}


	decode(	inp : DataStream) { 
		this.targetId = ec.decodeExpandedNodeId(inp);
		this.remainingPathIndex = ec.decodeUInt32(inp);

	}


	clone(	target? : BrowsePathTarget) : BrowsePathTarget { 
		if(!target) {
			target = new BrowsePathTarget();
		}
		target.targetId = this.targetId;
		target.remainingPathIndex = this.remainingPathIndex;
		return target;
	}


}
export function decodeBrowsePathTarget(	inp : DataStream) : BrowsePathTarget { 
		const obj = new BrowsePathTarget();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowsePathTarget",BrowsePathTarget, makeExpandedNodeId(548,0));