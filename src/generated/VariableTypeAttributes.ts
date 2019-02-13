

import {Variant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IVariableTypeAttributes extends INodeAttributes {
		value? : Variant;
		dataType? : ec.NodeId;
		valueRank? : ec.Int32;
		arrayDimensions? : ec.UInt32[];
		isAbstract? : boolean;
}

/**
The attributes for a variable type node.
*/

export class VariableTypeAttributes extends NodeAttributes {
 		value : Variant;
		dataType : ec.NodeId;
		valueRank : ec.Int32;
		arrayDimensions : ec.UInt32[];
		isAbstract : boolean;

	constructor(	options? : IVariableTypeAttributes) { 
		options = options || {};
		super(options);
		this.value= (options.value) ? options.value:new Variant();
		this.dataType= (options.dataType) ? options.dataType:null;
		this.valueRank= (options.valueRank) ? options.valueRank:null;
		this.arrayDimensions= (options.arrayDimensions) ? options.arrayDimensions:[];
		this.isAbstract= (options.isAbstract) ? options.isAbstract:null;

	}


	encode(	out : DataStream) { 
		super.encode(out);
		this.value.encode(out);
		ec.encodeNodeId(this.dataType,out);
		ec.encodeInt32(this.valueRank,out);
		ec.encodeArray(this.arrayDimensions,out,ec.encodeUInt32);
		ec.encodeBoolean(this.isAbstract,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.value.decode(inp);
		this.dataType = ec.decodeNodeId(inp);
		this.valueRank = ec.decodeInt32(inp);
		this.arrayDimensions = ec.decodeArray(inp,ec.decodeUInt32);
		this.isAbstract = ec.decodeBoolean(inp);

	}


	clone(	target? : VariableTypeAttributes) : VariableTypeAttributes { 
		if(!target) {
			target = new VariableTypeAttributes();
		}
		super.clone(target);
		if (this.value) { target.value = this.value.clone();}
		target.dataType = this.dataType;
		target.valueRank = this.valueRank;
		target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
		target.isAbstract = this.isAbstract;
		return target;
	}


}
export function decodeVariableTypeAttributes(	inp : DataStream) : VariableTypeAttributes { 
		const obj = new VariableTypeAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("VariableTypeAttributes",VariableTypeAttributes, makeExpandedNodeId(366,0));