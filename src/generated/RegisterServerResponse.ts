

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterServerResponse {
		responseHeader?: ResponseHeader;
}

/**
Registers a server with the discovery server.
*/

export class RegisterServerResponse {
 		responseHeader: ResponseHeader;

	constructor(	options?: IRegisterServerResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);

	}


	clone(	target?: RegisterServerResponse): RegisterServerResponse { 
		if(!target) {
			target = new RegisterServerResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		return target;
	}


}
export function decodeRegisterServerResponse(	inp: DataStream): RegisterServerResponse { 
		const obj = new RegisterServerResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterServerResponse",RegisterServerResponse, makeExpandedNodeId(440,0));