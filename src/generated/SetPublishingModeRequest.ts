

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISetPublishingModeRequest {
		requestHeader? : RequestHeader;
		publishingEnabled? : boolean;
		subscriptionIds? : ec.UInt32[];
}

/**

*/

export class SetPublishingModeRequest {
 		requestHeader : RequestHeader;
		publishingEnabled : boolean;
		subscriptionIds : ec.UInt32[];

	constructor(	options? : ISetPublishingModeRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.publishingEnabled= (options.publishingEnabled) ? options.publishingEnabled:null;
		this.subscriptionIds= (options.subscriptionIds) ? options.subscriptionIds:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeBoolean(this.publishingEnabled,out);
		ec.encodeArray(this.subscriptionIds,out,ec.encodeUInt32);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.publishingEnabled = ec.decodeBoolean(inp);
		this.subscriptionIds = ec.decodeArray(inp,ec.decodeUInt32);

	}


	clone(	target? : SetPublishingModeRequest) : SetPublishingModeRequest { 
		if(!target) {
			target = new SetPublishingModeRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.publishingEnabled = this.publishingEnabled;
		target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
		return target;
	}


}
export function decodeSetPublishingModeRequest(	inp : DataStream) : SetPublishingModeRequest { 
		const obj = new SetPublishingModeRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SetPublishingModeRequest",SetPublishingModeRequest, makeExpandedNodeId(799,0));