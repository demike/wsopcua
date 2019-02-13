

import * as ec from '../basic-types';
import {QueryDataDescription} from './QueryDataDescription';
import {decodeQueryDataDescription} from './QueryDataDescription';
import {DataStream} from '../basic-types/DataStream';

export interface INodeTypeDescription {
		typeDefinitionNode? : ec.ExpandedNodeId;
		includeSubTypes? : boolean;
		dataToReturn? : QueryDataDescription[];
}

/**

*/

export class NodeTypeDescription {
 		typeDefinitionNode : ec.ExpandedNodeId;
		includeSubTypes : boolean;
		dataToReturn : QueryDataDescription[];

	constructor(	options? : INodeTypeDescription) { 
		options = options || {};
		this.typeDefinitionNode= (options.typeDefinitionNode) ? options.typeDefinitionNode:null;
		this.includeSubTypes= (options.includeSubTypes) ? options.includeSubTypes:null;
		this.dataToReturn= (options.dataToReturn) ? options.dataToReturn:[];

	}


	encode(	out : DataStream) { 
		ec.encodeExpandedNodeId(this.typeDefinitionNode,out);
		ec.encodeBoolean(this.includeSubTypes,out);
		ec.encodeArray(this.dataToReturn,out);

	}


	decode(	inp : DataStream) { 
		this.typeDefinitionNode = ec.decodeExpandedNodeId(inp);
		this.includeSubTypes = ec.decodeBoolean(inp);
		this.dataToReturn = ec.decodeArray(inp,decodeQueryDataDescription);

	}


	clone(	target? : NodeTypeDescription) : NodeTypeDescription { 
		if(!target) {
			target = new NodeTypeDescription();
		}
		target.typeDefinitionNode = this.typeDefinitionNode;
		target.includeSubTypes = this.includeSubTypes;
		if (this.dataToReturn) { target.dataToReturn = ec.cloneComplexArray(this.dataToReturn);}
		return target;
	}


}
export function decodeNodeTypeDescription(	inp : DataStream) : NodeTypeDescription { 
		const obj = new NodeTypeDescription();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NodeTypeDescription",NodeTypeDescription, makeExpandedNodeId(575,0));