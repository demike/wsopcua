

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IMonitoredItemModifyResult {
		statusCode? : ec.StatusCode;
		revisedSamplingInterval? : ec.Double;
		revisedQueueSize? : ec.UInt32;
		filterResult? : ec.ExtensionObject;
}

/**

*/

export class MonitoredItemModifyResult {
 		statusCode : ec.StatusCode;
		revisedSamplingInterval : ec.Double;
		revisedQueueSize : ec.UInt32;
		filterResult : ec.ExtensionObject;

	constructor(	options? : IMonitoredItemModifyResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.revisedSamplingInterval= (options.revisedSamplingInterval) ? options.revisedSamplingInterval:null;
		this.revisedQueueSize= (options.revisedQueueSize) ? options.revisedQueueSize:null;
		this.filterResult= (options.filterResult) ? options.filterResult:null;

	}


	encode(	out : DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeDouble(this.revisedSamplingInterval,out);
		ec.encodeUInt32(this.revisedQueueSize,out);
		ec.encodeExtensionObject(this.filterResult,out);

	}


	decode(	inp : DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.revisedSamplingInterval = ec.decodeDouble(inp);
		this.revisedQueueSize = ec.decodeUInt32(inp);
		this.filterResult = ec.decodeExtensionObject(inp);

	}


	clone(	target? : MonitoredItemModifyResult) : MonitoredItemModifyResult { 
		if(!target) {
			target = new MonitoredItemModifyResult();
		}
		target.statusCode = this.statusCode;
		target.revisedSamplingInterval = this.revisedSamplingInterval;
		target.revisedQueueSize = this.revisedQueueSize;
		target.filterResult = this.filterResult;
		return target;
	}


}
export function decodeMonitoredItemModifyResult(	inp : DataStream) : MonitoredItemModifyResult { 
		let obj = new MonitoredItemModifyResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemModifyResult",MonitoredItemModifyResult, makeExpandedNodeId(760,0));