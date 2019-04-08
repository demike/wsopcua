

import * as ec from '../basic-types';
import {StructureType, encodeStructureType, decodeStructureType} from './StructureType';
import {StructureField} from './StructureField';
import {decodeStructureField} from './StructureField';
import {DataStream} from '../basic-types/DataStream';

export interface IStructureDefinition {
		defaultEncodingId?: ec.NodeId;
		baseDataType?: ec.NodeId;
		structureType?: StructureType;
		fields?: StructureField[];
}

/**

*/

export class StructureDefinition {
 		defaultEncodingId: ec.NodeId;
		baseDataType: ec.NodeId;
		structureType: StructureType;
		fields: StructureField[];

	constructor(	options?: IStructureDefinition) { 
		options = options || {};
		this.defaultEncodingId= (options.defaultEncodingId) ? options.defaultEncodingId:null;
		this.baseDataType= (options.baseDataType) ? options.baseDataType:null;
		this.structureType= (options.structureType) ? options.structureType:null;
		this.fields= (options.fields) ? options.fields:[];

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.defaultEncodingId,out);
		ec.encodeNodeId(this.baseDataType,out);
		encodeStructureType(this.structureType,out);
		ec.encodeArray(this.fields,out);

	}


	decode(	inp: DataStream) { 
		this.defaultEncodingId = ec.decodeNodeId(inp);
		this.baseDataType = ec.decodeNodeId(inp);
		this.structureType = decodeStructureType(inp);
		this.fields = ec.decodeArray(inp,decodeStructureField);

	}


	clone(	target?: StructureDefinition): StructureDefinition { 
		if(!target) {
			target = new StructureDefinition();
		}
		target.defaultEncodingId = this.defaultEncodingId;
		target.baseDataType = this.baseDataType;
		target.structureType = this.structureType;
		if (this.fields) { target.fields = ec.cloneComplexArray(this.fields);}
		return target;
	}


}
export function decodeStructureDefinition(	inp: DataStream): StructureDefinition { 
		const obj = new StructureDefinition();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StructureDefinition",StructureDefinition, makeExpandedNodeId(122,0));