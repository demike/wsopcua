

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISessionlessInvokeResponseType {
		namespaceUris?: string[];
		serverUris?: string[];
		serviceId?: ec.UInt32;
}

/**

*/

export class SessionlessInvokeResponseType {
 		namespaceUris: string[];
		serverUris: string[];
		serviceId: ec.UInt32;

	constructor(	options?: ISessionlessInvokeResponseType) { 
		options = options || {};
		this.namespaceUris= (options.namespaceUris) ? options.namespaceUris:[];
		this.serverUris= (options.serverUris) ? options.serverUris:[];
		this.serviceId= (options.serviceId) ? options.serviceId:null;

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.namespaceUris,out,ec.encodeString);
		ec.encodeArray(this.serverUris,out,ec.encodeString);
		ec.encodeUInt32(this.serviceId,out);

	}


	decode(	inp: DataStream) { 
		this.namespaceUris = ec.decodeArray(inp,ec.decodeString);
		this.serverUris = ec.decodeArray(inp,ec.decodeString);
		this.serviceId = ec.decodeUInt32(inp);

	}


	clone(	target?: SessionlessInvokeResponseType): SessionlessInvokeResponseType { 
		if(!target) {
			target = new SessionlessInvokeResponseType();
		}
		target.namespaceUris = ec.cloneArray(this.namespaceUris);
		target.serverUris = ec.cloneArray(this.serverUris);
		target.serviceId = this.serviceId;
		return target;
	}


}
export function decodeSessionlessInvokeResponseType(	inp: DataStream): SessionlessInvokeResponseType { 
		const obj = new SessionlessInvokeResponseType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SessionlessInvokeResponseType",SessionlessInvokeResponseType, makeExpandedNodeId(21001,0));