

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface IGenericAttributeValue {
		attributeId?: ec.UInt32;
		value?: Variant;
}

/**

*/

export class GenericAttributeValue {
 		attributeId: ec.UInt32;
		value: Variant;

	constructor(	options?: IGenericAttributeValue) { 
		options = options || {};
		this.attributeId= (options.attributeId) ? options.attributeId:null;
		this.value= (options.value) ? options.value:new Variant();

	}


	encode(	out: DataStream) { 
		ec.encodeUInt32(this.attributeId,out);
		this.value.encode(out);

	}


	decode(	inp: DataStream) { 
		this.attributeId = ec.decodeUInt32(inp);
		this.value.decode(inp);

	}


	clone(	target?: GenericAttributeValue): GenericAttributeValue { 
		if(!target) {
			target = new GenericAttributeValue();
		}
		target.attributeId = this.attributeId;
		if (this.value) { target.value = this.value.clone();}
		return target;
	}


}
export function decodeGenericAttributeValue(	inp: DataStream): GenericAttributeValue { 
		const obj = new GenericAttributeValue();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GenericAttributeValue",GenericAttributeValue, makeExpandedNodeId(17610,0));