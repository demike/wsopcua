

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICancelResponse {
		responseHeader? : ResponseHeader;
		cancelCount? : ec.UInt32;
}

/**
Cancels an outstanding request.
*/

export class CancelResponse {
 		responseHeader : ResponseHeader;
		cancelCount : ec.UInt32;

	constructor(	options? : ICancelResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.cancelCount= (options.cancelCount) ? options.cancelCount:null;

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeUInt32(this.cancelCount,out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);
		this.cancelCount = ec.decodeUInt32(inp);

	}


	clone(	target? : CancelResponse) : CancelResponse { 
		if(!target) {
			target = new CancelResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.cancelCount = this.cancelCount;
		return target;
	}


}
export function decodeCancelResponse(	inp : DataStream) : CancelResponse { 
		let obj = new CancelResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CancelResponse",CancelResponse, makeExpandedNodeId(482,0));