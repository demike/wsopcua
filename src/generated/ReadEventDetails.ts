

import * as ec from '../basic-types';
import {EventFilter} from './EventFilter';
import {DataStream} from '../basic-types/DataStream';
import {HistoryReadDetails} from './HistoryReadDetails';

export interface IReadEventDetails {
		numValuesPerNode?: ec.UInt32;
		startTime?: Date;
		endTime?: Date;
		filter?: EventFilter;
}

/**

*/

export class ReadEventDetails extends HistoryReadDetails {
 		numValuesPerNode: ec.UInt32;
		startTime: Date;
		endTime: Date;
		filter: EventFilter;

	constructor(	options?: IReadEventDetails) { 
		options = options || {};
		super();
		this.numValuesPerNode= (options.numValuesPerNode) ? options.numValuesPerNode:null;
		this.startTime= (options.startTime) ? options.startTime:null;
		this.endTime= (options.endTime) ? options.endTime:null;
		this.filter= (options.filter) ? options.filter:new EventFilter();

	}


	encode(	out: DataStream) { 
		ec.encodeUInt32(this.numValuesPerNode,out);
		ec.encodeDateTime(this.startTime,out);
		ec.encodeDateTime(this.endTime,out);
		this.filter.encode(out);

	}


	decode(	inp: DataStream) { 
		this.numValuesPerNode = ec.decodeUInt32(inp);
		this.startTime = ec.decodeDateTime(inp);
		this.endTime = ec.decodeDateTime(inp);
		this.filter.decode(inp);

	}


	clone(	target?: ReadEventDetails): ReadEventDetails { 
		if(!target) {
			target = new ReadEventDetails();
		}
		target.numValuesPerNode = this.numValuesPerNode;
		target.startTime = this.startTime;
		target.endTime = this.endTime;
		if (this.filter) { target.filter = this.filter.clone();}
		return target;
	}


}
export function decodeReadEventDetails(	inp: DataStream): ReadEventDetails { 
		const obj = new ReadEventDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadEventDetails",ReadEventDetails, makeExpandedNodeId(646,0));