

import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';
import {FilterOperand} from './FilterOperand';

export interface ILiteralOperand {
		value? : Variant;
}

/**

*/

export class LiteralOperand extends FilterOperand {
 		value : Variant;

	constructor(	options? : ILiteralOperand) { 
		options = options || {};
		super();
		this.value= (options.value) ? options.value:new Variant();

	}


	encode(	out : DataStream) { 
		this.value.encode(out);

	}


	decode(	inp : DataStream) { 
		this.value.decode(inp);

	}


	clone(	target? : LiteralOperand) : LiteralOperand { 
		if(!target) {
			target = new LiteralOperand();
		}
		if (this.value) { target.value = this.value.clone();}
		return target;
	}


}
export function decodeLiteralOperand(	inp : DataStream) : LiteralOperand { 
		const obj = new LiteralOperand();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("LiteralOperand",LiteralOperand, makeExpandedNodeId(597,0));