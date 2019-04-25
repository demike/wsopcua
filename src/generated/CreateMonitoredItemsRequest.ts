

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {MonitoredItemCreateRequest} from './MonitoredItemCreateRequest';
import {decodeMonitoredItemCreateRequest} from './MonitoredItemCreateRequest';
import {DataStream} from '../basic-types/DataStream';

export interface ICreateMonitoredItemsRequest {
		requestHeader?: RequestHeader;
		subscriptionId?: ec.UInt32;
		timestampsToReturn?: TimestampsToReturn;
		itemsToCreate?: MonitoredItemCreateRequest[];
}

/**

*/

export class CreateMonitoredItemsRequest {
 		requestHeader: RequestHeader;
		subscriptionId: ec.UInt32;
		timestampsToReturn: TimestampsToReturn;
		itemsToCreate: MonitoredItemCreateRequest[];

	constructor(	options?: ICreateMonitoredItemsRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionId= (options.subscriptionId) ? options.subscriptionId:null;
		this.timestampsToReturn= (options.timestampsToReturn) ? options.timestampsToReturn:null;
		this.itemsToCreate= (options.itemsToCreate) ? options.itemsToCreate:[];

	}


	encode(	out: DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeUInt32(this.subscriptionId,out);
		encodeTimestampsToReturn(this.timestampsToReturn,out);
		ec.encodeArray(this.itemsToCreate,out);

	}


	decode(	inp: DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionId = ec.decodeUInt32(inp);
		this.timestampsToReturn = decodeTimestampsToReturn(inp);
		this.itemsToCreate = ec.decodeArray(inp,decodeMonitoredItemCreateRequest);

	}


	clone(	target?: CreateMonitoredItemsRequest): CreateMonitoredItemsRequest { 
		if(!target) {
			target = new CreateMonitoredItemsRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.subscriptionId = this.subscriptionId;
		target.timestampsToReturn = this.timestampsToReturn;
		if (this.itemsToCreate) { target.itemsToCreate = ec.cloneComplexArray(this.itemsToCreate);}
		return target;
	}


}
export function decodeCreateMonitoredItemsRequest(	inp: DataStream): CreateMonitoredItemsRequest { 
		const obj = new CreateMonitoredItemsRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateMonitoredItemsRequest",CreateMonitoredItemsRequest, makeExpandedNodeId(751,0));