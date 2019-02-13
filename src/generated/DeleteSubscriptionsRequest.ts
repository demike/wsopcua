

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteSubscriptionsRequest {
		requestHeader? : RequestHeader;
		subscriptionIds? : ec.UInt32[];
}

/**

*/

export class DeleteSubscriptionsRequest {
 		requestHeader : RequestHeader;
		subscriptionIds : ec.UInt32[];

	constructor(	options? : IDeleteSubscriptionsRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionIds= (options.subscriptionIds) ? options.subscriptionIds:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.subscriptionIds,out,ec.encodeUInt32);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionIds = ec.decodeArray(inp,ec.decodeUInt32);

	}


	clone(	target? : DeleteSubscriptionsRequest) : DeleteSubscriptionsRequest { 
		if(!target) {
			target = new DeleteSubscriptionsRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
		return target;
	}


}
export function decodeDeleteSubscriptionsRequest(	inp : DataStream) : DeleteSubscriptionsRequest { 
		const obj = new DeleteSubscriptionsRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteSubscriptionsRequest",DeleteSubscriptionsRequest, makeExpandedNodeId(847,0));