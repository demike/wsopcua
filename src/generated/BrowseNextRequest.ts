

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseNextRequest {
		requestHeader? : RequestHeader;
		releaseContinuationPoints? : boolean;
		continuationPoints? : Uint8Array[];
}

/**
Continues one or more browse operations.
*/

export class BrowseNextRequest {
 		requestHeader : RequestHeader;
		releaseContinuationPoints : boolean;
		continuationPoints : Uint8Array[];

	constructor(	options? : IBrowseNextRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.releaseContinuationPoints= (options.releaseContinuationPoints) ? options.releaseContinuationPoints:null;
		this.continuationPoints= (options.continuationPoints) ? options.continuationPoints:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeBoolean(this.releaseContinuationPoints,out);
		ec.encodeArray(this.continuationPoints,out,ec.encodeByteString);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.releaseContinuationPoints = ec.decodeBoolean(inp);
		this.continuationPoints = ec.decodeArray(inp,ec.decodeByteString);

	}


	clone(	target? : BrowseNextRequest) : BrowseNextRequest { 
		if(!target) {
			target = new BrowseNextRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.releaseContinuationPoints = this.releaseContinuationPoints;
		target.continuationPoints = ec.cloneArray(this.continuationPoints);
		return target;
	}


}
export function decodeBrowseNextRequest(	inp : DataStream) : BrowseNextRequest { 
		const obj = new BrowseNextRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseNextRequest",BrowseNextRequest, makeExpandedNodeId(533,0));