

import {ResponseHeader} from './ResponseHeader';
import {ApplicationDescription} from './ApplicationDescription';
import {decodeApplicationDescription} from './ApplicationDescription';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersResponse {
		responseHeader? : ResponseHeader;
		servers? : ApplicationDescription[];
}

/**
Finds the servers known to the discovery server.
*/

export class FindServersResponse {
 		responseHeader : ResponseHeader;
		servers : ApplicationDescription[];

	constructor(	options? : IFindServersResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.servers= (options.servers) ? options.servers:[];

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeArray(this.servers,out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);
		this.servers = ec.decodeArray(inp,decodeApplicationDescription);

	}


	clone(	target? : FindServersResponse) : FindServersResponse { 
		if(!target) {
			target = new FindServersResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		if (this.servers) { target.servers = ec.cloneComplexArray(this.servers);}
		return target;
	}


}
export function decodeFindServersResponse(	inp : DataStream) : FindServersResponse { 
		const obj = new FindServersResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersResponse",FindServersResponse, makeExpandedNodeId(425,0));