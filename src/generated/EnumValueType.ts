

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export interface IEnumValueType {
		value? : ec.Int64;
		displayName? : LocalizedText;
		description? : LocalizedText;
}

/**
A mapping between a value of an enumerated type and a name and description.
*/

export class EnumValueType {
 		value : ec.Int64;
		displayName : LocalizedText;
		description : LocalizedText;

	constructor(	options? : IEnumValueType) { 
		options = options || {};
		this.value= (options.value) ? options.value:null;
		this.displayName= (options.displayName) ? options.displayName:new LocalizedText();
		this.description= (options.description) ? options.description:new LocalizedText();

	}


	encode(	out : DataStream) { 
		ec.encodeInt64(this.value,out);
		this.displayName.encode(out);
		this.description.encode(out);

	}


	decode(	inp : DataStream) { 
		this.value = ec.decodeInt64(inp);
		this.displayName.decode(inp);
		this.description.decode(inp);

	}


	clone(	target? : EnumValueType) : EnumValueType { 
		if(!target) {
			target = new EnumValueType();
		}
		target.value = this.value;
		if (this.displayName) { target.displayName = this.displayName.clone();}
		if (this.description) { target.description = this.description.clone();}
		return target;
	}


}
export function decodeEnumValueType(	inp : DataStream) : EnumValueType { 
		const obj = new EnumValueType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EnumValueType",EnumValueType, makeExpandedNodeId(8251,0));