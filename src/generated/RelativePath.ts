

import {RelativePathElement} from './RelativePathElement';
import {decodeRelativePathElement} from './RelativePathElement';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRelativePath {
		elements? : RelativePathElement[];
}

/**
A relative path constructed from reference types and browse names.
*/

export class RelativePath {
 		elements : RelativePathElement[];

	constructor(	options? : IRelativePath) { 
		options = options || {};
		this.elements= (options.elements) ? options.elements:[];

	}


	encode(	out : DataStream) { 
		ec.encodeArray(this.elements,out);

	}


	decode(	inp : DataStream) { 
		this.elements = ec.decodeArray(inp,decodeRelativePathElement);

	}


	clone(	target? : RelativePath) : RelativePath { 
		if(!target) {
			target = new RelativePath();
		}
		if (this.elements) { target.elements = ec.cloneComplexArray(this.elements);}
		return target;
	}


}
export function decodeRelativePath(	inp : DataStream) : RelativePath { 
		let obj = new RelativePath();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RelativePath",RelativePath, makeExpandedNodeId(542,0));