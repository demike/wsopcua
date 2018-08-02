

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IMethodAttributes extends INodeAttributes {
		executable? : boolean;
		userExecutable? : boolean;
}

/**
The attributes for a method node.
*/

export class MethodAttributes extends NodeAttributes {
 		executable : boolean;
		userExecutable : boolean;

	constructor(	options? : IMethodAttributes) { 
		options = options || {};
		super(options);
		this.executable= (options.executable) ? options.executable:null;
		this.userExecutable= (options.userExecutable) ? options.userExecutable:null;

	}


	encode(	out : DataStream) { 
		super.encode(out);
		ec.encodeBoolean(this.executable,out);
		ec.encodeBoolean(this.userExecutable,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.executable = ec.decodeBoolean(inp);
		this.userExecutable = ec.decodeBoolean(inp);

	}


	clone(	target? : MethodAttributes) : MethodAttributes { 
		if(!target) {
			target = new MethodAttributes();
		}
		super.clone(target);
		target.executable = this.executable;
		target.userExecutable = this.userExecutable;
		return target;
	}


}
export function decodeMethodAttributes(	inp : DataStream) : MethodAttributes { 
		let obj = new MethodAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MethodAttributes",MethodAttributes, makeExpandedNodeId(360,0));