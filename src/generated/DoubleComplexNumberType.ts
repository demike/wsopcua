

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDoubleComplexNumberType {
		real?: ec.Double;
		imaginary?: ec.Double;
}

/**

*/

export class DoubleComplexNumberType {
 		real: ec.Double;
		imaginary: ec.Double;

	constructor(	options?: IDoubleComplexNumberType) { 
		options = options || {};
		this.real= (options.real) ? options.real:null;
		this.imaginary= (options.imaginary) ? options.imaginary:null;

	}


	encode(	out: DataStream) { 
		ec.encodeDouble(this.real,out);
		ec.encodeDouble(this.imaginary,out);

	}


	decode(	inp: DataStream) { 
		this.real = ec.decodeDouble(inp);
		this.imaginary = ec.decodeDouble(inp);

	}


	clone(	target?: DoubleComplexNumberType): DoubleComplexNumberType { 
		if(!target) {
			target = new DoubleComplexNumberType();
		}
		target.real = this.real;
		target.imaginary = this.imaginary;
		return target;
	}


}
export function decodeDoubleComplexNumberType(	inp: DataStream): DoubleComplexNumberType { 
		const obj = new DoubleComplexNumberType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DoubleComplexNumberType",DoubleComplexNumberType, makeExpandedNodeId(12182,0));