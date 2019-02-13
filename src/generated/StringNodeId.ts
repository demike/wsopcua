

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IStringNodeId {
		namespaceIndex? : ec.UInt16;
		identifier? : string;
}

/**

*/

export class StringNodeId {
 		namespaceIndex : ec.UInt16;
		identifier : string;

	constructor(	options? : IStringNodeId) { 
		options = options || {};
		this.namespaceIndex= (options.namespaceIndex) ? options.namespaceIndex:null;
		this.identifier= (options.identifier) ? options.identifier:null;

	}


	encode(	out : DataStream) { 
		ec.encodeUInt16(this.namespaceIndex,out);
		ec.encodeString(this.identifier,out);

	}


	decode(	inp : DataStream) { 
		this.namespaceIndex = ec.decodeUInt16(inp);
		this.identifier = ec.decodeString(inp);

	}


	clone(	target? : StringNodeId) : StringNodeId { 
		if(!target) {
			target = new StringNodeId();
		}
		target.namespaceIndex = this.namespaceIndex;
		target.identifier = this.identifier;
		return target;
	}


}
export function decodeStringNodeId(	inp : DataStream) : StringNodeId { 
		const obj = new StringNodeId();
			obj.decode(inp); 
			return obj;

	}



