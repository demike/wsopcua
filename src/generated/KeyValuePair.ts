

import {QualifiedName} from './QualifiedName';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';
import * as ec from '../basic-types';

export interface IKeyValuePair {
		key? : QualifiedName;
		value? : Variant;
}

/**

*/

export class KeyValuePair {
 		key : QualifiedName;
		value : Variant;

	constructor(	options? : IKeyValuePair) { 
		options = options || {};
		this.key= (options.key) ? options.key:new QualifiedName();
		this.value= (options.value) ? options.value:new Variant();

	}


	encode(	out : DataStream) { 
		this.key.encode(out);
		this.value.encode(out);

	}


	decode(	inp : DataStream) { 
		this.key.decode(inp);
		this.value.decode(inp);

	}


	clone(	target? : KeyValuePair) : KeyValuePair { 
		if(!target) {
			target = new KeyValuePair();
		}
		if (this.key) { target.key = this.key.clone();}
		if (this.value) { target.value = this.value.clone();}
		return target;
	}


}
export function decodeKeyValuePair(	inp : DataStream) : KeyValuePair { 
		let obj = new KeyValuePair();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("KeyValuePair",KeyValuePair, makeExpandedNodeId(14846,0));