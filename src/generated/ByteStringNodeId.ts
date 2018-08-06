

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IByteStringNodeId {
		namespaceIndex? : ec.UInt16;
		identifier? : Uint8Array;
}

/**

*/

export class ByteStringNodeId {
 		namespaceIndex : ec.UInt16;
		identifier : Uint8Array;

	constructor(	options? : IByteStringNodeId) { 
		options = options || {};
		this.namespaceIndex= (options.namespaceIndex) ? options.namespaceIndex:null;
		this.identifier= (options.identifier) ? options.identifier:null;

	}


	encode(	out : DataStream) { 
		ec.encodeUInt16(this.namespaceIndex,out);
		ec.encodeByteString(this.identifier,out);

	}


	decode(	inp : DataStream) { 
		this.namespaceIndex = ec.decodeUInt16(inp);
		this.identifier = ec.decodeByteString(inp);

	}


	clone(	target? : ByteStringNodeId) : ByteStringNodeId { 
		if(!target) {
			target = new ByteStringNodeId();
		}
		target.namespaceIndex = this.namespaceIndex;
		target.identifier = this.identifier;
		return target;
	}


}
export function decodeByteStringNodeId(	inp : DataStream) : ByteStringNodeId { 
		let obj = new ByteStringNodeId();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ByteStringNodeId",ByteStringNodeId, makeExpandedNodeId(-1,));