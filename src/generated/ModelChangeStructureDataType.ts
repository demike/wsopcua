

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IModelChangeStructureDataType {
		affected? : ec.NodeId;
		affectedType? : ec.NodeId;
		verb? : ec.Byte;
}

/**

*/

export class ModelChangeStructureDataType {
 		affected : ec.NodeId;
		affectedType : ec.NodeId;
		verb : ec.Byte;

	constructor(	options? : IModelChangeStructureDataType) { 
		options = options || {};
		this.affected= (options.affected) ? options.affected:null;
		this.affectedType= (options.affectedType) ? options.affectedType:null;
		this.verb= (options.verb) ? options.verb:null;

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.affected,out);
		ec.encodeNodeId(this.affectedType,out);
		ec.encodeByte(this.verb,out);

	}


	decode(	inp : DataStream) { 
		this.affected = ec.decodeNodeId(inp);
		this.affectedType = ec.decodeNodeId(inp);
		this.verb = ec.decodeByte(inp);

	}


	clone(	target? : ModelChangeStructureDataType) : ModelChangeStructureDataType { 
		if(!target) {
			target = new ModelChangeStructureDataType();
		}
		target.affected = this.affected;
		target.affectedType = this.affectedType;
		target.verb = this.verb;
		return target;
	}


}
export function decodeModelChangeStructureDataType(	inp : DataStream) : ModelChangeStructureDataType { 
		const obj = new ModelChangeStructureDataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModelChangeStructureDataType",ModelChangeStructureDataType, makeExpandedNodeId(879,0));