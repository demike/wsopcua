

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryDataSet {
		nodeId? : ec.ExpandedNodeId;
		typeDefinitionNode? : ec.ExpandedNodeId;
		values? : Variant[];
}

/**

*/

export class QueryDataSet {
 		nodeId : ec.ExpandedNodeId;
		typeDefinitionNode : ec.ExpandedNodeId;
		values : Variant[];

	constructor(	options? : IQueryDataSet) { 
		options = options || {};
		this.nodeId= (options.nodeId) ? options.nodeId:null;
		this.typeDefinitionNode= (options.typeDefinitionNode) ? options.typeDefinitionNode:null;
		this.values= (options.values) ? options.values:[];

	}


	encode(	out : DataStream) { 
		ec.encodeExpandedNodeId(this.nodeId,out);
		ec.encodeExpandedNodeId(this.typeDefinitionNode,out);
		ec.encodeArray(this.values,out);

	}


	decode(	inp : DataStream) { 
		this.nodeId = ec.decodeExpandedNodeId(inp);
		this.typeDefinitionNode = ec.decodeExpandedNodeId(inp);
		this.values = ec.decodeArray(inp,decodeVariant);

	}


	clone(	target? : QueryDataSet) : QueryDataSet { 
		if(!target) {
			target = new QueryDataSet();
		}
		target.nodeId = this.nodeId;
		target.typeDefinitionNode = this.typeDefinitionNode;
		if (this.values) { target.values = ec.cloneComplexArray(this.values);}
		return target;
	}


}
export function decodeQueryDataSet(	inp : DataStream) : QueryDataSet { 
		let obj = new QueryDataSet();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryDataSet",QueryDataSet, makeExpandedNodeId(579,0));