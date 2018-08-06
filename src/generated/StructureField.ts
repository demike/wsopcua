

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export interface IStructureField {
		name? : string;
		description? : LocalizedText;
		dataType? : ec.NodeId;
		valueRank? : ec.Int32;
		arrayDimensions? : ec.UInt32[];
		maxStringLength? : ec.UInt32;
		isOptional? : boolean;
}

/**

*/

export class StructureField {
 		name : string;
		description : LocalizedText;
		dataType : ec.NodeId;
		valueRank : ec.Int32;
		arrayDimensions : ec.UInt32[];
		maxStringLength : ec.UInt32;
		isOptional : boolean;

	constructor(	options? : IStructureField) { 
		options = options || {};
		this.name= (options.name) ? options.name:null;
		this.description= (options.description) ? options.description:new LocalizedText();
		this.dataType= (options.dataType) ? options.dataType:null;
		this.valueRank= (options.valueRank) ? options.valueRank:null;
		this.arrayDimensions= (options.arrayDimensions) ? options.arrayDimensions:[];
		this.maxStringLength= (options.maxStringLength) ? options.maxStringLength:null;
		this.isOptional= (options.isOptional) ? options.isOptional:null;

	}


	encode(	out : DataStream) { 
		ec.encodeString(this.name,out);
		this.description.encode(out);
		ec.encodeNodeId(this.dataType,out);
		ec.encodeInt32(this.valueRank,out);
		ec.encodeArray(this.arrayDimensions,out,ec.encodeUInt32);
		ec.encodeUInt32(this.maxStringLength,out);
		ec.encodeBoolean(this.isOptional,out);

	}


	decode(	inp : DataStream) { 
		this.name = ec.decodeString(inp);
		this.description.decode(inp);
		this.dataType = ec.decodeNodeId(inp);
		this.valueRank = ec.decodeInt32(inp);
		this.arrayDimensions = ec.decodeArray(inp,ec.decodeUInt32);
		this.maxStringLength = ec.decodeUInt32(inp);
		this.isOptional = ec.decodeBoolean(inp);

	}


	clone(	target? : StructureField) : StructureField { 
		if(!target) {
			target = new StructureField();
		}
		target.name = this.name;
		if (this.description) { target.description = this.description.clone();}
		target.dataType = this.dataType;
		target.valueRank = this.valueRank;
		target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
		target.maxStringLength = this.maxStringLength;
		target.isOptional = this.isOptional;
		return target;
	}


}
export function decodeStructureField(	inp : DataStream) : StructureField { 
		let obj = new StructureField();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StructureField",StructureField, makeExpandedNodeId(14844,0));