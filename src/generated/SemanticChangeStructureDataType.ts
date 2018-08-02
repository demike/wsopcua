

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISemanticChangeStructureDataType {
		affected? : ec.NodeId;
		affectedType? : ec.NodeId;
}

/**

*/

export class SemanticChangeStructureDataType {
 		affected : ec.NodeId;
		affectedType : ec.NodeId;

	constructor(	options? : ISemanticChangeStructureDataType) { 
		options = options || {};
		this.affected= (options.affected) ? options.affected:null;
		this.affectedType= (options.affectedType) ? options.affectedType:null;

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.affected,out);
		ec.encodeNodeId(this.affectedType,out);

	}


	decode(	inp : DataStream) { 
		this.affected = ec.decodeNodeId(inp);
		this.affectedType = ec.decodeNodeId(inp);

	}


	clone(	target? : SemanticChangeStructureDataType) : SemanticChangeStructureDataType { 
		if(!target) {
			target = new SemanticChangeStructureDataType();
		}
		target.affected = this.affected;
		target.affectedType = this.affectedType;
		return target;
	}


}
export function decodeSemanticChangeStructureDataType(	inp : DataStream) : SemanticChangeStructureDataType { 
		let obj = new SemanticChangeStructureDataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SemanticChangeStructureDataType",SemanticChangeStructureDataType, makeExpandedNodeId(899,0));