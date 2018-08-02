

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IMonitoredItemCreateResult {
		statusCode? : ec.StatusCode;
		monitoredItemId? : ec.UInt32;
		revisedSamplingInterval? : ec.Double;
		revisedQueueSize? : ec.UInt32;
		filterResult? : ec.ExtensionObject;
}

/**

*/

export class MonitoredItemCreateResult {
 		statusCode : ec.StatusCode;
		monitoredItemId : ec.UInt32;
		revisedSamplingInterval : ec.Double;
		revisedQueueSize : ec.UInt32;
		filterResult : ec.ExtensionObject;

	constructor(	options? : IMonitoredItemCreateResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.monitoredItemId= (options.monitoredItemId) ? options.monitoredItemId:null;
		this.revisedSamplingInterval= (options.revisedSamplingInterval) ? options.revisedSamplingInterval:null;
		this.revisedQueueSize= (options.revisedQueueSize) ? options.revisedQueueSize:null;
		this.filterResult= (options.filterResult) ? options.filterResult:null;

	}


	encode(	out : DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeUInt32(this.monitoredItemId,out);
		ec.encodeDouble(this.revisedSamplingInterval,out);
		ec.encodeUInt32(this.revisedQueueSize,out);
		ec.encodeExtensionObject(this.filterResult,out);

	}


	decode(	inp : DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.monitoredItemId = ec.decodeUInt32(inp);
		this.revisedSamplingInterval = ec.decodeDouble(inp);
		this.revisedQueueSize = ec.decodeUInt32(inp);
		this.filterResult = ec.decodeExtensionObject(inp);

	}


	clone(	target? : MonitoredItemCreateResult) : MonitoredItemCreateResult { 
		if(!target) {
			target = new MonitoredItemCreateResult();
		}
		target.statusCode = this.statusCode;
		target.monitoredItemId = this.monitoredItemId;
		target.revisedSamplingInterval = this.revisedSamplingInterval;
		target.revisedQueueSize = this.revisedQueueSize;
		target.filterResult = this.filterResult;
		return target;
	}


}
export function decodeMonitoredItemCreateResult(	inp : DataStream) : MonitoredItemCreateResult { 
		let obj = new MonitoredItemCreateResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemCreateResult",MonitoredItemCreateResult, makeExpandedNodeId(748,0));