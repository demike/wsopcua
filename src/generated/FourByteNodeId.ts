

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFourByteNodeId {
		namespaceIndex?: ec.Byte;
		identifier?: ec.UInt16;
}

/**

*/

export class FourByteNodeId {
 		namespaceIndex: ec.Byte;
		identifier: ec.UInt16;

	constructor(	options?: IFourByteNodeId) { 
		options = options || {};
		this.namespaceIndex= (options.namespaceIndex) ? options.namespaceIndex:null;
		this.identifier= (options.identifier) ? options.identifier:null;

	}


	encode(	out: DataStream) { 
		ec.encodeByte(this.namespaceIndex,out);
		ec.encodeUInt16(this.identifier,out);

	}


	decode(	inp: DataStream) { 
		this.namespaceIndex = ec.decodeByte(inp);
		this.identifier = ec.decodeUInt16(inp);

	}


	clone(	target?: FourByteNodeId): FourByteNodeId { 
		if(!target) {
			target = new FourByteNodeId();
		}
		target.namespaceIndex = this.namespaceIndex;
		target.identifier = this.identifier;
		return target;
	}


}
export function decodeFourByteNodeId(	inp: DataStream): FourByteNodeId { 
		const obj = new FourByteNodeId();
			obj.decode(inp); 
			return obj;

	}



