

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICancelRequest {
		requestHeader? : RequestHeader;
		requestHandle? : ec.UInt32;
}

/**
Cancels an outstanding request.
*/

export class CancelRequest {
 		requestHeader : RequestHeader;
		requestHandle : ec.UInt32;

	constructor(	options? : ICancelRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.requestHandle= (options.requestHandle) ? options.requestHandle:null;

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeUInt32(this.requestHandle,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.requestHandle = ec.decodeUInt32(inp);

	}


	clone(	target? : CancelRequest) : CancelRequest { 
		if(!target) {
			target = new CancelRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.requestHandle = this.requestHandle;
		return target;
	}


}
export function decodeCancelRequest(	inp : DataStream) : CancelRequest { 
		let obj = new CancelRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CancelRequest",CancelRequest, makeExpandedNodeId(479,0));