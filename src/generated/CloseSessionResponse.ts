

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';
import * as ec from '../basic-types';

export interface ICloseSessionResponse {
		responseHeader? : ResponseHeader;
}

/**
Closes a session with the server.
*/

export class CloseSessionResponse {
 		responseHeader : ResponseHeader;

	constructor(	options? : ICloseSessionResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);

	}


	clone(	target? : CloseSessionResponse) : CloseSessionResponse { 
		if(!target) {
			target = new CloseSessionResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		return target;
	}


}
export function decodeCloseSessionResponse(	inp : DataStream) : CloseSessionResponse { 
		const obj = new CloseSessionResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CloseSessionResponse",CloseSessionResponse, makeExpandedNodeId(476,0));