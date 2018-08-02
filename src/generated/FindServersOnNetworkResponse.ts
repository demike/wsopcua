

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {ServerOnNetwork} from './ServerOnNetwork';
import {decodeServerOnNetwork} from './ServerOnNetwork';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersOnNetworkResponse {
		responseHeader? : ResponseHeader;
		lastCounterResetTime? : Date;
		servers? : ServerOnNetwork[];
}

/**

*/

export class FindServersOnNetworkResponse {
 		responseHeader : ResponseHeader;
		lastCounterResetTime : Date;
		servers : ServerOnNetwork[];

	constructor(	options? : IFindServersOnNetworkResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.lastCounterResetTime= (options.lastCounterResetTime) ? options.lastCounterResetTime:null;
		this.servers= (options.servers) ? options.servers:[];

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeDateTime(this.lastCounterResetTime,out);
		ec.encodeArray(this.servers,out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);
		this.lastCounterResetTime = ec.decodeDateTime(inp);
		this.servers = ec.decodeArray(inp,decodeServerOnNetwork);

	}


	clone(	target? : FindServersOnNetworkResponse) : FindServersOnNetworkResponse { 
		if(!target) {
			target = new FindServersOnNetworkResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.lastCounterResetTime = this.lastCounterResetTime;
		if (this.servers) { target.servers = ec.cloneComplexArray(this.servers);}
		return target;
	}


}
export function decodeFindServersOnNetworkResponse(	inp : DataStream) : FindServersOnNetworkResponse { 
		let obj = new FindServersOnNetworkResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersOnNetworkResponse",FindServersOnNetworkResponse, makeExpandedNodeId(12209,0));