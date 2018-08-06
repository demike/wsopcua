

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IXVType {
		x? : ec.Double;
		value? : ec.Float;
}

/**

*/

export class XVType {
 		x : ec.Double;
		value : ec.Float;

	constructor(	options? : IXVType) { 
		options = options || {};
		this.x= (options.x) ? options.x:null;
		this.value= (options.value) ? options.value:null;

	}


	encode(	out : DataStream) { 
		ec.encodeDouble(this.x,out);
		ec.encodeFloat(this.value,out);

	}


	decode(	inp : DataStream) { 
		this.x = ec.decodeDouble(inp);
		this.value = ec.decodeFloat(inp);

	}


	clone(	target? : XVType) : XVType { 
		if(!target) {
			target = new XVType();
		}
		target.x = this.x;
		target.value = this.value;
		return target;
	}


}
export function decodeXVType(	inp : DataStream) : XVType { 
		let obj = new XVType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("XVType",XVType, makeExpandedNodeId(12090,0));