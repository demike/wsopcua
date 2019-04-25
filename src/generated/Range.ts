

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRange {
		low?: ec.Double;
		high?: ec.Double;
}

/**

*/

export class Range {
 		low: ec.Double;
		high: ec.Double;

	constructor(	options?: IRange) { 
		options = options || {};
		this.low= (options.low) ? options.low:null;
		this.high= (options.high) ? options.high:null;

	}


	encode(	out: DataStream) { 
		ec.encodeDouble(this.low,out);
		ec.encodeDouble(this.high,out);

	}


	decode(	inp: DataStream) { 
		this.low = ec.decodeDouble(inp);
		this.high = ec.decodeDouble(inp);

	}


	clone(	target?: Range): Range { 
		if(!target) {
			target = new Range();
		}
		target.low = this.low;
		target.high = this.high;
		return target;
	}


}
export function decodeRange(	inp: DataStream): Range { 
		const obj = new Range();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Range",Range, makeExpandedNodeId(886,0));