

import {RelativePath} from './RelativePath';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryDataDescription {
		relativePath?: RelativePath;
		attributeId?: ec.UInt32;
		indexRange?: string;
}

/**

*/

export class QueryDataDescription {
 		relativePath: RelativePath;
		attributeId: ec.UInt32;
		indexRange: string;

	constructor(	options?: IQueryDataDescription) { 
		options = options || {};
		this.relativePath= (options.relativePath) ? options.relativePath:new RelativePath();
		this.attributeId= (options.attributeId) ? options.attributeId:null;
		this.indexRange= (options.indexRange) ? options.indexRange:null;

	}


	encode(	out: DataStream) { 
		this.relativePath.encode(out);
		ec.encodeUInt32(this.attributeId,out);
		ec.encodeString(this.indexRange,out);

	}


	decode(	inp: DataStream) { 
		this.relativePath.decode(inp);
		this.attributeId = ec.decodeUInt32(inp);
		this.indexRange = ec.decodeString(inp);

	}


	clone(	target?: QueryDataDescription): QueryDataDescription { 
		if(!target) {
			target = new QueryDataDescription();
		}
		if (this.relativePath) { target.relativePath = this.relativePath.clone();}
		target.attributeId = this.attributeId;
		target.indexRange = this.indexRange;
		return target;
	}


}
export function decodeQueryDataDescription(	inp: DataStream): QueryDataDescription { 
		const obj = new QueryDataDescription();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryDataDescription",QueryDataDescription, makeExpandedNodeId(572,0));