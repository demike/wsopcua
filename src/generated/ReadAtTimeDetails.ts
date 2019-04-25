

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryReadDetails} from './HistoryReadDetails';

export interface IReadAtTimeDetails {
		reqTimes?: Date[];
		useSimpleBounds?: boolean;
}

/**

*/

export class ReadAtTimeDetails extends HistoryReadDetails {
 		reqTimes: Date[];
		useSimpleBounds: boolean;

	constructor(	options?: IReadAtTimeDetails) { 
		options = options || {};
		super();
		this.reqTimes= (options.reqTimes) ? options.reqTimes:[];
		this.useSimpleBounds= (options.useSimpleBounds) ? options.useSimpleBounds:null;

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.reqTimes,out,ec.encodeDateTime);
		ec.encodeBoolean(this.useSimpleBounds,out);

	}


	decode(	inp: DataStream) { 
		this.reqTimes = ec.decodeArray(inp,ec.decodeDateTime);
		this.useSimpleBounds = ec.decodeBoolean(inp);

	}


	clone(	target?: ReadAtTimeDetails): ReadAtTimeDetails { 
		if(!target) {
			target = new ReadAtTimeDetails();
		}
		target.reqTimes = ec.cloneArray(this.reqTimes);
		target.useSimpleBounds = this.useSimpleBounds;
		return target;
	}


}
export function decodeReadAtTimeDetails(	inp: DataStream): ReadAtTimeDetails { 
		const obj = new ReadAtTimeDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadAtTimeDetails",ReadAtTimeDetails, makeExpandedNodeId(655,0));