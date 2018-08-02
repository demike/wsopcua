

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {MonitoredItemModifyRequest} from './MonitoredItemModifyRequest';
import {decodeMonitoredItemModifyRequest} from './MonitoredItemModifyRequest';
import {DataStream} from '../basic-types/DataStream';

export interface IModifyMonitoredItemsRequest {
		requestHeader? : RequestHeader;
		subscriptionId? : ec.UInt32;
		timestampsToReturn? : TimestampsToReturn;
		itemsToModify? : MonitoredItemModifyRequest[];
}

/**

*/

export class ModifyMonitoredItemsRequest {
 		requestHeader : RequestHeader;
		subscriptionId : ec.UInt32;
		timestampsToReturn : TimestampsToReturn;
		itemsToModify : MonitoredItemModifyRequest[];

	constructor(	options? : IModifyMonitoredItemsRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionId= (options.subscriptionId) ? options.subscriptionId:null;
		this.timestampsToReturn= (options.timestampsToReturn) ? options.timestampsToReturn:null;
		this.itemsToModify= (options.itemsToModify) ? options.itemsToModify:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeUInt32(this.subscriptionId,out);
		encodeTimestampsToReturn(this.timestampsToReturn,out);
		ec.encodeArray(this.itemsToModify,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionId = ec.decodeUInt32(inp);
		this.timestampsToReturn = decodeTimestampsToReturn(inp);
		this.itemsToModify = ec.decodeArray(inp,decodeMonitoredItemModifyRequest);

	}


	clone(	target? : ModifyMonitoredItemsRequest) : ModifyMonitoredItemsRequest { 
		if(!target) {
			target = new ModifyMonitoredItemsRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.subscriptionId = this.subscriptionId;
		target.timestampsToReturn = this.timestampsToReturn;
		if (this.itemsToModify) { target.itemsToModify = ec.cloneComplexArray(this.itemsToModify);}
		return target;
	}


}
export function decodeModifyMonitoredItemsRequest(	inp : DataStream) : ModifyMonitoredItemsRequest { 
		let obj = new ModifyMonitoredItemsRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModifyMonitoredItemsRequest",ModifyMonitoredItemsRequest, makeExpandedNodeId(763,0));