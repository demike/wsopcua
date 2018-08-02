

import {RequestHeader} from './RequestHeader';
import {RegisteredServer} from './RegisteredServer';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterServer2Request {
		requestHeader? : RequestHeader;
		server? : RegisteredServer;
		discoveryConfiguration? : ec.ExtensionObject[];
}

/**

*/

export class RegisterServer2Request {
 		requestHeader : RequestHeader;
		server : RegisteredServer;
		discoveryConfiguration : ec.ExtensionObject[];

	constructor(	options? : IRegisterServer2Request) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.server= (options.server) ? options.server:new RegisteredServer();
		this.discoveryConfiguration= (options.discoveryConfiguration) ? options.discoveryConfiguration:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		this.server.encode(out);
		ec.encodeArray(this.discoveryConfiguration,out,ec.encodeExtensionObject);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.server.decode(inp);
		this.discoveryConfiguration = ec.decodeArray(inp,ec.decodeExtensionObject);

	}


	clone(	target? : RegisterServer2Request) : RegisterServer2Request { 
		if(!target) {
			target = new RegisterServer2Request();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.server) { target.server = this.server.clone();}
		target.discoveryConfiguration = ec.cloneArray(this.discoveryConfiguration);
		return target;
	}


}
export function decodeRegisterServer2Request(	inp : DataStream) : RegisterServer2Request { 
		let obj = new RegisterServer2Request();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterServer2Request",RegisterServer2Request, makeExpandedNodeId(12211,0));