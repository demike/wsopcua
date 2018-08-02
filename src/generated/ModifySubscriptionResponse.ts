

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IModifySubscriptionResponse {
		responseHeader? : ResponseHeader;
		revisedPublishingInterval? : ec.Double;
		revisedLifetimeCount? : ec.UInt32;
		revisedMaxKeepAliveCount? : ec.UInt32;
}

/**

*/

export class ModifySubscriptionResponse {
 		responseHeader : ResponseHeader;
		revisedPublishingInterval : ec.Double;
		revisedLifetimeCount : ec.UInt32;
		revisedMaxKeepAliveCount : ec.UInt32;

	constructor(	options? : IModifySubscriptionResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.revisedPublishingInterval= (options.revisedPublishingInterval) ? options.revisedPublishingInterval:null;
		this.revisedLifetimeCount= (options.revisedLifetimeCount) ? options.revisedLifetimeCount:null;
		this.revisedMaxKeepAliveCount= (options.revisedMaxKeepAliveCount) ? options.revisedMaxKeepAliveCount:null;

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeDouble(this.revisedPublishingInterval,out);
		ec.encodeUInt32(this.revisedLifetimeCount,out);
		ec.encodeUInt32(this.revisedMaxKeepAliveCount,out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);
		this.revisedPublishingInterval = ec.decodeDouble(inp);
		this.revisedLifetimeCount = ec.decodeUInt32(inp);
		this.revisedMaxKeepAliveCount = ec.decodeUInt32(inp);

	}


	clone(	target? : ModifySubscriptionResponse) : ModifySubscriptionResponse { 
		if(!target) {
			target = new ModifySubscriptionResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.revisedPublishingInterval = this.revisedPublishingInterval;
		target.revisedLifetimeCount = this.revisedLifetimeCount;
		target.revisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
		return target;
	}


}
export function decodeModifySubscriptionResponse(	inp : DataStream) : ModifySubscriptionResponse { 
		let obj = new ModifySubscriptionResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModifySubscriptionResponse",ModifySubscriptionResponse, makeExpandedNodeId(796,0));