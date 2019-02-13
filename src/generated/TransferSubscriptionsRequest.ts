

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITransferSubscriptionsRequest {
		requestHeader? : RequestHeader;
		subscriptionIds? : ec.UInt32[];
		sendInitialValues? : boolean;
}

/**

*/

export class TransferSubscriptionsRequest {
 		requestHeader : RequestHeader;
		subscriptionIds : ec.UInt32[];
		sendInitialValues : boolean;

	constructor(	options? : ITransferSubscriptionsRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionIds= (options.subscriptionIds) ? options.subscriptionIds:[];
		this.sendInitialValues= (options.sendInitialValues) ? options.sendInitialValues:null;

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.subscriptionIds,out,ec.encodeUInt32);
		ec.encodeBoolean(this.sendInitialValues,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionIds = ec.decodeArray(inp,ec.decodeUInt32);
		this.sendInitialValues = ec.decodeBoolean(inp);

	}


	clone(	target? : TransferSubscriptionsRequest) : TransferSubscriptionsRequest { 
		if(!target) {
			target = new TransferSubscriptionsRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
		target.sendInitialValues = this.sendInitialValues;
		return target;
	}


}
export function decodeTransferSubscriptionsRequest(	inp : DataStream) : TransferSubscriptionsRequest { 
		const obj = new TransferSubscriptionsRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TransferSubscriptionsRequest",TransferSubscriptionsRequest, makeExpandedNodeId(841,0));