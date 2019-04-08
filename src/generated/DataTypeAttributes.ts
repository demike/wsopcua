

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IDataTypeAttributes extends INodeAttributes {
		isAbstract?: boolean;
}

/**
The attributes for a data type node.
*/

export class DataTypeAttributes extends NodeAttributes {
 		isAbstract: boolean;

	constructor(	options?: IDataTypeAttributes) { 
		options = options || {};
		super(options);
		this.isAbstract= (options.isAbstract) ? options.isAbstract:null;

	}


	encode(	out: DataStream) { 
		super.encode(out);
		ec.encodeBoolean(this.isAbstract,out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);
		this.isAbstract = ec.decodeBoolean(inp);

	}


	clone(	target?: DataTypeAttributes): DataTypeAttributes { 
		if(!target) {
			target = new DataTypeAttributes();
		}
		super.clone(target);
		target.isAbstract = this.isAbstract;
		return target;
	}


}
export function decodeDataTypeAttributes(	inp: DataStream): DataTypeAttributes { 
		const obj = new DataTypeAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataTypeAttributes",DataTypeAttributes, makeExpandedNodeId(372,0));