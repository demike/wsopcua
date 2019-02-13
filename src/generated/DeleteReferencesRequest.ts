

import {RequestHeader} from './RequestHeader';
import {DeleteReferencesItem} from './DeleteReferencesItem';
import {decodeDeleteReferencesItem} from './DeleteReferencesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteReferencesRequest {
		requestHeader? : RequestHeader;
		referencesToDelete? : DeleteReferencesItem[];
}

/**
Delete one or more references from the server address space.
*/

export class DeleteReferencesRequest {
 		requestHeader : RequestHeader;
		referencesToDelete : DeleteReferencesItem[];

	constructor(	options? : IDeleteReferencesRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.referencesToDelete= (options.referencesToDelete) ? options.referencesToDelete:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.referencesToDelete,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.referencesToDelete = ec.decodeArray(inp,decodeDeleteReferencesItem);

	}


	clone(	target? : DeleteReferencesRequest) : DeleteReferencesRequest { 
		if(!target) {
			target = new DeleteReferencesRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.referencesToDelete) { target.referencesToDelete = ec.cloneComplexArray(this.referencesToDelete);}
		return target;
	}


}
export function decodeDeleteReferencesRequest(	inp : DataStream) : DeleteReferencesRequest { 
		const obj = new DeleteReferencesRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteReferencesRequest",DeleteReferencesRequest, makeExpandedNodeId(506,0));