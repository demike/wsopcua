

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersRequest {
		requestHeader?: RequestHeader;
		endpointUrl?: string;
		localeIds?: string[];
		serverUris?: string[];
}

/**
Finds the servers known to the discovery server.
*/

export class FindServersRequest {
 		requestHeader: RequestHeader;
		endpointUrl: string;
		localeIds: string[];
		serverUris: string[];

	constructor(	options?: IFindServersRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.endpointUrl= (options.endpointUrl) ? options.endpointUrl:null;
		this.localeIds= (options.localeIds) ? options.localeIds:[];
		this.serverUris= (options.serverUris) ? options.serverUris:[];

	}


	encode(	out: DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeString(this.endpointUrl,out);
		ec.encodeArray(this.localeIds,out,ec.encodeString);
		ec.encodeArray(this.serverUris,out,ec.encodeString);

	}


	decode(	inp: DataStream) { 
		this.requestHeader.decode(inp);
		this.endpointUrl = ec.decodeString(inp);
		this.localeIds = ec.decodeArray(inp,ec.decodeString);
		this.serverUris = ec.decodeArray(inp,ec.decodeString);

	}


	clone(	target?: FindServersRequest): FindServersRequest { 
		if(!target) {
			target = new FindServersRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.endpointUrl = this.endpointUrl;
		target.localeIds = ec.cloneArray(this.localeIds);
		target.serverUris = ec.cloneArray(this.serverUris);
		return target;
	}


}
export function decodeFindServersRequest(	inp: DataStream): FindServersRequest { 
		const obj = new FindServersRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersRequest",FindServersRequest, makeExpandedNodeId(422,0));