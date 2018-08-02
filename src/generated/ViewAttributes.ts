

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IViewAttributes extends INodeAttributes {
		containsNoLoops? : boolean;
		eventNotifier? : ec.Byte;
}

/**
The attributes for a view node.
*/

export class ViewAttributes extends NodeAttributes {
 		containsNoLoops : boolean;
		eventNotifier : ec.Byte;

	constructor(	options? : IViewAttributes) { 
		options = options || {};
		super(options);
		this.containsNoLoops= (options.containsNoLoops) ? options.containsNoLoops:null;
		this.eventNotifier= (options.eventNotifier) ? options.eventNotifier:null;

	}


	encode(	out : DataStream) { 
		super.encode(out);
		ec.encodeBoolean(this.containsNoLoops,out);
		ec.encodeByte(this.eventNotifier,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.containsNoLoops = ec.decodeBoolean(inp);
		this.eventNotifier = ec.decodeByte(inp);

	}


	clone(	target? : ViewAttributes) : ViewAttributes { 
		if(!target) {
			target = new ViewAttributes();
		}
		super.clone(target);
		target.containsNoLoops = this.containsNoLoops;
		target.eventNotifier = this.eventNotifier;
		return target;
	}


}
export function decodeViewAttributes(	inp : DataStream) : ViewAttributes { 
		let obj = new ViewAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ViewAttributes",ViewAttributes, makeExpandedNodeId(375,0));