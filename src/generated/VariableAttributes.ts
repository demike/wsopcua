

import {Variant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IVariableAttributes extends INodeAttributes {
		value? : Variant;
		dataType? : ec.NodeId;
		valueRank? : ec.Int32;
		arrayDimensions? : ec.UInt32[];
		accessLevel? : ec.Byte;
		userAccessLevel? : ec.Byte;
		minimumSamplingInterval? : ec.Double;
		historizing? : boolean;
}

/**
The attributes for a variable node.
*/

export class VariableAttributes extends NodeAttributes {
 		value : Variant;
		dataType : ec.NodeId;
		valueRank : ec.Int32;
		arrayDimensions : ec.UInt32[];
		accessLevel : ec.Byte;
		userAccessLevel : ec.Byte;
		minimumSamplingInterval : ec.Double;
		historizing : boolean;

	constructor(	options? : IVariableAttributes) { 
		options = options || {};
		super(options);
		this.value= (options.value) ? options.value:new Variant();
		this.dataType= (options.dataType) ? options.dataType:null;
		this.valueRank= (options.valueRank) ? options.valueRank:null;
		this.arrayDimensions= (options.arrayDimensions) ? options.arrayDimensions:[];
		this.accessLevel= (options.accessLevel) ? options.accessLevel:null;
		this.userAccessLevel= (options.userAccessLevel) ? options.userAccessLevel:null;
		this.minimumSamplingInterval= (options.minimumSamplingInterval) ? options.minimumSamplingInterval:null;
		this.historizing= (options.historizing) ? options.historizing:null;

	}


	encode(	out : DataStream) { 
		super.encode(out);
		this.value.encode(out);
		ec.encodeNodeId(this.dataType,out);
		ec.encodeInt32(this.valueRank,out);
		ec.encodeArray(this.arrayDimensions,out,ec.encodeUInt32);
		ec.encodeByte(this.accessLevel,out);
		ec.encodeByte(this.userAccessLevel,out);
		ec.encodeDouble(this.minimumSamplingInterval,out);
		ec.encodeBoolean(this.historizing,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.value.decode(inp);
		this.dataType = ec.decodeNodeId(inp);
		this.valueRank = ec.decodeInt32(inp);
		this.arrayDimensions = ec.decodeArray(inp,ec.decodeUInt32);
		this.accessLevel = ec.decodeByte(inp);
		this.userAccessLevel = ec.decodeByte(inp);
		this.minimumSamplingInterval = ec.decodeDouble(inp);
		this.historizing = ec.decodeBoolean(inp);

	}


	clone(	target? : VariableAttributes) : VariableAttributes { 
		if(!target) {
			target = new VariableAttributes();
		}
		super.clone(target);
		if (this.value) { target.value = this.value.clone();}
		target.dataType = this.dataType;
		target.valueRank = this.valueRank;
		target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
		target.accessLevel = this.accessLevel;
		target.userAccessLevel = this.userAccessLevel;
		target.minimumSamplingInterval = this.minimumSamplingInterval;
		target.historizing = this.historizing;
		return target;
	}


}
export function decodeVariableAttributes(	inp : DataStream) : VariableAttributes { 
		let obj = new VariableAttributes();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("VariableAttributes",VariableAttributes, makeExpandedNodeId(357,0));