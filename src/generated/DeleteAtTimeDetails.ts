

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IDeleteAtTimeDetails extends IHistoryUpdateDetails {
		reqTimes? : Date[];
}

/**

*/

export class DeleteAtTimeDetails extends HistoryUpdateDetails {
 		reqTimes : Date[];

	constructor(	options? : IDeleteAtTimeDetails) { 
		options = options || {};
		super(options);
		this.reqTimes= (options.reqTimes) ? options.reqTimes:[];

	}


	encode(	out : DataStream) { 
		super.encode(out);
		ec.encodeArray(this.reqTimes,out,ec.encodeDateTime);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.reqTimes = ec.decodeArray(inp,ec.decodeDateTime);

	}


	clone(	target? : DeleteAtTimeDetails) : DeleteAtTimeDetails { 
		if(!target) {
			target = new DeleteAtTimeDetails();
		}
		super.clone(target);
		target.reqTimes = ec.cloneArray(this.reqTimes);
		return target;
	}


}
export function decodeDeleteAtTimeDetails(	inp : DataStream) : DeleteAtTimeDetails { 
		let obj = new DeleteAtTimeDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteAtTimeDetails",DeleteAtTimeDetails, makeExpandedNodeId(691,0));