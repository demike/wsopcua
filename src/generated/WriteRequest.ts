

import {RequestHeader} from './RequestHeader';
import {WriteValue} from './WriteValue';
import {decodeWriteValue} from './WriteValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IWriteRequest {
		requestHeader? : RequestHeader;
		nodesToWrite? : WriteValue[];
}

/**

*/

export class WriteRequest {
 		requestHeader : RequestHeader;
		nodesToWrite : WriteValue[];

	constructor(	options? : IWriteRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.nodesToWrite= (options.nodesToWrite) ? options.nodesToWrite:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.nodesToWrite,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.nodesToWrite = ec.decodeArray(inp,decodeWriteValue);

	}


	clone(	target? : WriteRequest) : WriteRequest { 
		if(!target) {
			target = new WriteRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.nodesToWrite) { target.nodesToWrite = ec.cloneComplexArray(this.nodesToWrite);}
		return target;
	}


}
export function decodeWriteRequest(	inp : DataStream) : WriteRequest { 
		const obj = new WriteRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("WriteRequest",WriteRequest, makeExpandedNodeId(673,0));