

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryReadValueId {
		nodeId?: ec.NodeId;
		indexRange?: string;
		dataEncoding?: QualifiedName;
		continuationPoint?: Uint8Array;
}

/**

*/

export class HistoryReadValueId {
 		nodeId: ec.NodeId;
		indexRange: string;
		dataEncoding: QualifiedName;
		continuationPoint: Uint8Array;

	constructor(	options?: IHistoryReadValueId) { 
		options = options || {};
		this.nodeId= (options.nodeId) ? options.nodeId:null;
		this.indexRange= (options.indexRange) ? options.indexRange:null;
		this.dataEncoding= (options.dataEncoding) ? options.dataEncoding:new QualifiedName();
		this.continuationPoint= (options.continuationPoint) ? options.continuationPoint:null;

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.nodeId,out);
		ec.encodeString(this.indexRange,out);
		this.dataEncoding.encode(out);
		ec.encodeByteString(this.continuationPoint,out);

	}


	decode(	inp: DataStream) { 
		this.nodeId = ec.decodeNodeId(inp);
		this.indexRange = ec.decodeString(inp);
		this.dataEncoding.decode(inp);
		this.continuationPoint = ec.decodeByteString(inp);

	}


	clone(	target?: HistoryReadValueId): HistoryReadValueId { 
		if(!target) {
			target = new HistoryReadValueId();
		}
		target.nodeId = this.nodeId;
		target.indexRange = this.indexRange;
		if (this.dataEncoding) { target.dataEncoding = this.dataEncoding.clone();}
		target.continuationPoint = this.continuationPoint;
		return target;
	}


}
export function decodeHistoryReadValueId(	inp: DataStream): HistoryReadValueId { 
		const obj = new HistoryReadValueId();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryReadValueId",HistoryReadValueId, makeExpandedNodeId(637,0));