

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITwoByteNodeId {
		identifier?: ec.Byte;
}

/**

*/

export class TwoByteNodeId {
 		identifier: ec.Byte;

	constructor(	options?: ITwoByteNodeId) { 
		options = options || {};
		this.identifier= (options.identifier) ? options.identifier:null;

	}


	encode(	out: DataStream) { 
		ec.encodeByte(this.identifier,out);

	}


	decode(	inp: DataStream) { 
		this.identifier = ec.decodeByte(inp);

	}


	clone(	target?: TwoByteNodeId): TwoByteNodeId { 
		if(!target) {
			target = new TwoByteNodeId();
		}
		target.identifier = this.identifier;
		return target;
	}


}
export function decodeTwoByteNodeId(	inp: DataStream): TwoByteNodeId { 
		const obj = new TwoByteNodeId();
			obj.decode(inp); 
			return obj;

	}



