

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersOnNetworkRequest {
		requestHeader?: RequestHeader;
		startingRecordId?: ec.UInt32;
		maxRecordsToReturn?: ec.UInt32;
		serverCapabilityFilter?: string[];
}

/**

*/

export class FindServersOnNetworkRequest {
 		requestHeader: RequestHeader;
		startingRecordId: ec.UInt32;
		maxRecordsToReturn: ec.UInt32;
		serverCapabilityFilter: string[];

	constructor(	options?: IFindServersOnNetworkRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.startingRecordId= (options.startingRecordId) ? options.startingRecordId:null;
		this.maxRecordsToReturn= (options.maxRecordsToReturn) ? options.maxRecordsToReturn:null;
		this.serverCapabilityFilter= (options.serverCapabilityFilter) ? options.serverCapabilityFilter:[];

	}


	encode(	out: DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeUInt32(this.startingRecordId,out);
		ec.encodeUInt32(this.maxRecordsToReturn,out);
		ec.encodeArray(this.serverCapabilityFilter,out,ec.encodeString);

	}


	decode(	inp: DataStream) { 
		this.requestHeader.decode(inp);
		this.startingRecordId = ec.decodeUInt32(inp);
		this.maxRecordsToReturn = ec.decodeUInt32(inp);
		this.serverCapabilityFilter = ec.decodeArray(inp,ec.decodeString);

	}


	clone(	target?: FindServersOnNetworkRequest): FindServersOnNetworkRequest { 
		if(!target) {
			target = new FindServersOnNetworkRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.startingRecordId = this.startingRecordId;
		target.maxRecordsToReturn = this.maxRecordsToReturn;
		target.serverCapabilityFilter = ec.cloneArray(this.serverCapabilityFilter);
		return target;
	}


}
export function decodeFindServersOnNetworkRequest(	inp: DataStream): FindServersOnNetworkRequest { 
		const obj = new FindServersOnNetworkRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersOnNetworkRequest",FindServersOnNetworkRequest, makeExpandedNodeId(12208,0));