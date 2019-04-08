

import {GenericAttributeValue} from './GenericAttributeValue';
import {decodeGenericAttributeValue} from './GenericAttributeValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IGenericAttributes extends INodeAttributes {
		attributeValues?: GenericAttributeValue[];
}

/**

*/

export class GenericAttributes extends NodeAttributes {
 		attributeValues: GenericAttributeValue[];

	constructor(	options?: IGenericAttributes) { 
		options = options || {};
		super(options);
		this.attributeValues= (options.attributeValues) ? options.attributeValues:[];

	}


	encode(	out: DataStream) { 
		super.encode(out);
		ec.encodeArray(this.attributeValues,out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);
		this.attributeValues = ec.decodeArray(inp,decodeGenericAttributeValue);

	}


	clone(	target?: GenericAttributes): GenericAttributes { 
		if(!target) {
			target = new GenericAttributes();
		}
		super.clone(target);
		if (this.attributeValues) { target.attributeValues = ec.cloneComplexArray(this.attributeValues);}
		return target;
	}


}
export function decodeGenericAttributes(	inp: DataStream): GenericAttributes { 
		const obj = new GenericAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GenericAttributes",GenericAttributes, makeExpandedNodeId(17611,0));