

import {EnumField} from './EnumField';
import {decodeEnumField} from './EnumField';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IEnumDefinition {
		fields?: EnumField[];
}

/**

*/

export class EnumDefinition {
 		fields: EnumField[];

	constructor(	options?: IEnumDefinition) { 
		options = options || {};
		this.fields= (options.fields) ? options.fields:[];

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.fields,out);

	}


	decode(	inp: DataStream) { 
		this.fields = ec.decodeArray(inp,decodeEnumField);

	}


	clone(	target?: EnumDefinition): EnumDefinition { 
		if(!target) {
			target = new EnumDefinition();
		}
		if (this.fields) { target.fields = ec.cloneComplexArray(this.fields);}
		return target;
	}


}
export function decodeEnumDefinition(	inp: DataStream): EnumDefinition { 
		const obj = new EnumDefinition();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EnumDefinition",EnumDefinition, makeExpandedNodeId(123,0));