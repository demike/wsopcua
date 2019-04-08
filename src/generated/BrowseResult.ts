

import * as ec from '../basic-types';
import {ReferenceDescription} from './ReferenceDescription';
import {decodeReferenceDescription} from './ReferenceDescription';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseResult {
		statusCode?: ec.StatusCode;
		continuationPoint?: Uint8Array;
		references?: ReferenceDescription[];
}

/**
The result of a browse operation.
*/

export class BrowseResult {
 		statusCode: ec.StatusCode;
		continuationPoint: Uint8Array;
		references: ReferenceDescription[];

	constructor(	options?: IBrowseResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.continuationPoint= (options.continuationPoint) ? options.continuationPoint:null;
		this.references= (options.references) ? options.references:[];

	}


	encode(	out: DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeByteString(this.continuationPoint,out);
		ec.encodeArray(this.references,out);

	}


	decode(	inp: DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.continuationPoint = ec.decodeByteString(inp);
		this.references = ec.decodeArray(inp,decodeReferenceDescription);

	}


	clone(	target?: BrowseResult): BrowseResult { 
		if(!target) {
			target = new BrowseResult();
		}
		target.statusCode = this.statusCode;
		target.continuationPoint = this.continuationPoint;
		if (this.references) { target.references = ec.cloneComplexArray(this.references);}
		return target;
	}


}
export function decodeBrowseResult(	inp: DataStream): BrowseResult { 
		const obj = new BrowseResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseResult",BrowseResult, makeExpandedNodeId(524,0));