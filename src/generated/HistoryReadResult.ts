

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryReadResult {
		statusCode? : ec.StatusCode;
		continuationPoint? : Uint8Array;
		historyData? : ec.ExtensionObject;
}

/**

*/

export class HistoryReadResult {
 		statusCode : ec.StatusCode;
		continuationPoint : Uint8Array;
		historyData : ec.ExtensionObject;

	constructor(	options? : IHistoryReadResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.continuationPoint= (options.continuationPoint) ? options.continuationPoint:null;
		this.historyData= (options.historyData) ? options.historyData:null;

	}


	encode(	out : DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeByteString(this.continuationPoint,out);
		ec.encodeExtensionObject(this.historyData,out);

	}


	decode(	inp : DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.continuationPoint = ec.decodeByteString(inp);
		this.historyData = ec.decodeExtensionObject(inp);

	}


	clone(	target? : HistoryReadResult) : HistoryReadResult { 
		if(!target) {
			target = new HistoryReadResult();
		}
		target.statusCode = this.statusCode;
		target.continuationPoint = this.continuationPoint;
		target.historyData = this.historyData;
		return target;
	}


}
export function decodeHistoryReadResult(	inp : DataStream) : HistoryReadResult { 
		let obj = new HistoryReadResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryReadResult",HistoryReadResult, makeExpandedNodeId(640,0));