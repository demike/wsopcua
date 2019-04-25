

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISessionlessInvokeRequestType {
		urisVersion?: ec.UInt32[];
		namespaceUris?: string[];
		serverUris?: string[];
		localeIds?: string[];
		serviceId?: ec.UInt32;
}

/**

*/

export class SessionlessInvokeRequestType {
 		urisVersion: ec.UInt32[];
		namespaceUris: string[];
		serverUris: string[];
		localeIds: string[];
		serviceId: ec.UInt32;

	constructor(	options?: ISessionlessInvokeRequestType) { 
		options = options || {};
		this.urisVersion= (options.urisVersion) ? options.urisVersion:[];
		this.namespaceUris= (options.namespaceUris) ? options.namespaceUris:[];
		this.serverUris= (options.serverUris) ? options.serverUris:[];
		this.localeIds= (options.localeIds) ? options.localeIds:[];
		this.serviceId= (options.serviceId) ? options.serviceId:null;

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.urisVersion,out,ec.encodeUInt32);
		ec.encodeArray(this.namespaceUris,out,ec.encodeString);
		ec.encodeArray(this.serverUris,out,ec.encodeString);
		ec.encodeArray(this.localeIds,out,ec.encodeString);
		ec.encodeUInt32(this.serviceId,out);

	}


	decode(	inp: DataStream) { 
		this.urisVersion = ec.decodeArray(inp,ec.decodeUInt32);
		this.namespaceUris = ec.decodeArray(inp,ec.decodeString);
		this.serverUris = ec.decodeArray(inp,ec.decodeString);
		this.localeIds = ec.decodeArray(inp,ec.decodeString);
		this.serviceId = ec.decodeUInt32(inp);

	}


	clone(	target?: SessionlessInvokeRequestType): SessionlessInvokeRequestType { 
		if(!target) {
			target = new SessionlessInvokeRequestType();
		}
		target.urisVersion = ec.cloneArray(this.urisVersion);
		target.namespaceUris = ec.cloneArray(this.namespaceUris);
		target.serverUris = ec.cloneArray(this.serverUris);
		target.localeIds = ec.cloneArray(this.localeIds);
		target.serviceId = this.serviceId;
		return target;
	}


}
export function decodeSessionlessInvokeRequestType(	inp: DataStream): SessionlessInvokeRequestType { 
		const obj = new SessionlessInvokeRequestType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SessionlessInvokeRequestType",SessionlessInvokeRequestType, makeExpandedNodeId(15903,0));