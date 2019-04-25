

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {FilterOperand} from './FilterOperand';

export interface IElementOperand {
		index?: ec.UInt32;
}

/**

*/

export class ElementOperand extends FilterOperand {
 		index: ec.UInt32;

	constructor(	options?: IElementOperand) { 
		options = options || {};
		super();
		this.index= (options.index) ? options.index:null;

	}


	encode(	out: DataStream) { 
		ec.encodeUInt32(this.index,out);

	}


	decode(	inp: DataStream) { 
		this.index = ec.decodeUInt32(inp);

	}


	clone(	target?: ElementOperand): ElementOperand { 
		if(!target) {
			target = new ElementOperand();
		}
		target.index = this.index;
		return target;
	}


}
export function decodeElementOperand(	inp: DataStream): ElementOperand { 
		const obj = new ElementOperand();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ElementOperand",ElementOperand, makeExpandedNodeId(594,0));