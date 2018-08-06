

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteMonitoredItemsRequest {
		requestHeader? : RequestHeader;
		subscriptionId? : ec.UInt32;
		monitoredItemIds? : ec.UInt32[];
}

/**

*/

export class DeleteMonitoredItemsRequest {
 		requestHeader : RequestHeader;
		subscriptionId : ec.UInt32;
		monitoredItemIds : ec.UInt32[];

	constructor(	options? : IDeleteMonitoredItemsRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionId= (options.subscriptionId) ? options.subscriptionId:null;
		this.monitoredItemIds= (options.monitoredItemIds) ? options.monitoredItemIds:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeUInt32(this.subscriptionId,out);
		ec.encodeArray(this.monitoredItemIds,out,ec.encodeUInt32);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionId = ec.decodeUInt32(inp);
		this.monitoredItemIds = ec.decodeArray(inp,ec.decodeUInt32);

	}


	clone(	target? : DeleteMonitoredItemsRequest) : DeleteMonitoredItemsRequest { 
		if(!target) {
			target = new DeleteMonitoredItemsRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.subscriptionId = this.subscriptionId;
		target.monitoredItemIds = ec.cloneArray(this.monitoredItemIds);
		return target;
	}


}
export function decodeDeleteMonitoredItemsRequest(	inp : DataStream) : DeleteMonitoredItemsRequest { 
		let obj = new DeleteMonitoredItemsRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteMonitoredItemsRequest",DeleteMonitoredItemsRequest, makeExpandedNodeId(781,0));