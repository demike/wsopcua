

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {ReadValueId} from './ReadValueId';
import {decodeReadValueId} from './ReadValueId';
import {DataStream} from '../basic-types/DataStream';

export interface IReadRequest {
		requestHeader? : RequestHeader;
		maxAge? : ec.Double;
		timestampsToReturn? : TimestampsToReturn;
		nodesToRead? : ReadValueId[];
}

/**

*/

export class ReadRequest {
 		requestHeader : RequestHeader;
		maxAge : ec.Double;
		timestampsToReturn : TimestampsToReturn;
		nodesToRead : ReadValueId[];

	constructor(	options? : IReadRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.maxAge= (options.maxAge) ? options.maxAge:null;
		this.timestampsToReturn= (options.timestampsToReturn) ? options.timestampsToReturn:null;
		this.nodesToRead= (options.nodesToRead) ? options.nodesToRead:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeDouble(this.maxAge,out);
		encodeTimestampsToReturn(this.timestampsToReturn,out);
		ec.encodeArray(this.nodesToRead,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.maxAge = ec.decodeDouble(inp);
		this.timestampsToReturn = decodeTimestampsToReturn(inp);
		this.nodesToRead = ec.decodeArray(inp,decodeReadValueId);

	}


	clone(	target? : ReadRequest) : ReadRequest { 
		if(!target) {
			target = new ReadRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.maxAge = this.maxAge;
		target.timestampsToReturn = this.timestampsToReturn;
		if (this.nodesToRead) { target.nodesToRead = ec.cloneComplexArray(this.nodesToRead);}
		return target;
	}


}
export function decodeReadRequest(	inp : DataStream) : ReadRequest { 
		const obj = new ReadRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadRequest",ReadRequest, makeExpandedNodeId(631,0));