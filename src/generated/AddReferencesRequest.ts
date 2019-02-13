

import {RequestHeader} from './RequestHeader';
import {AddReferencesItem} from './AddReferencesItem';
import {decodeAddReferencesItem} from './AddReferencesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAddReferencesRequest {
		requestHeader? : RequestHeader;
		referencesToAdd? : AddReferencesItem[];
}

/**
Adds one or more references to the server address space.
*/

export class AddReferencesRequest {
 		requestHeader : RequestHeader;
		referencesToAdd : AddReferencesItem[];

	constructor(	options? : IAddReferencesRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.referencesToAdd= (options.referencesToAdd) ? options.referencesToAdd:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.referencesToAdd,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.referencesToAdd = ec.decodeArray(inp,decodeAddReferencesItem);

	}


	clone(	target? : AddReferencesRequest) : AddReferencesRequest { 
		if(!target) {
			target = new AddReferencesRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.referencesToAdd) { target.referencesToAdd = ec.cloneComplexArray(this.referencesToAdd);}
		return target;
	}


}
export function decodeAddReferencesRequest(	inp : DataStream) : AddReferencesRequest { 
		const obj = new AddReferencesRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddReferencesRequest",AddReferencesRequest, makeExpandedNodeId(494,0));