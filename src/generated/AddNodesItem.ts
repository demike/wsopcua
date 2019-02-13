

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {DataStream} from '../basic-types/DataStream';

export interface IAddNodesItem {
		parentNodeId? : ec.ExpandedNodeId;
		referenceTypeId? : ec.NodeId;
		requestedNewNodeId? : ec.ExpandedNodeId;
		browseName? : QualifiedName;
		nodeClass? : NodeClass;
		nodeAttributes? : ec.ExtensionObject;
		typeDefinition? : ec.ExpandedNodeId;
}

/**
A request to add a node to the server address space.
*/

export class AddNodesItem {
 		parentNodeId : ec.ExpandedNodeId;
		referenceTypeId : ec.NodeId;
		requestedNewNodeId : ec.ExpandedNodeId;
		browseName : QualifiedName;
		nodeClass : NodeClass;
		nodeAttributes : ec.ExtensionObject;
		typeDefinition : ec.ExpandedNodeId;

	constructor(	options? : IAddNodesItem) { 
		options = options || {};
		this.parentNodeId= (options.parentNodeId) ? options.parentNodeId:null;
		this.referenceTypeId= (options.referenceTypeId) ? options.referenceTypeId:null;
		this.requestedNewNodeId= (options.requestedNewNodeId) ? options.requestedNewNodeId:null;
		this.browseName= (options.browseName) ? options.browseName:new QualifiedName();
		this.nodeClass= (options.nodeClass) ? options.nodeClass:null;
		this.nodeAttributes= (options.nodeAttributes) ? options.nodeAttributes:null;
		this.typeDefinition= (options.typeDefinition) ? options.typeDefinition:null;

	}


	encode(	out : DataStream) { 
		ec.encodeExpandedNodeId(this.parentNodeId,out);
		ec.encodeNodeId(this.referenceTypeId,out);
		ec.encodeExpandedNodeId(this.requestedNewNodeId,out);
		this.browseName.encode(out);
		encodeNodeClass(this.nodeClass,out);
		ec.encodeExtensionObject(this.nodeAttributes,out);
		ec.encodeExpandedNodeId(this.typeDefinition,out);

	}


	decode(	inp : DataStream) { 
		this.parentNodeId = ec.decodeExpandedNodeId(inp);
		this.referenceTypeId = ec.decodeNodeId(inp);
		this.requestedNewNodeId = ec.decodeExpandedNodeId(inp);
		this.browseName.decode(inp);
		this.nodeClass = decodeNodeClass(inp);
		this.nodeAttributes = ec.decodeExtensionObject(inp);
		this.typeDefinition = ec.decodeExpandedNodeId(inp);

	}


	clone(	target? : AddNodesItem) : AddNodesItem { 
		if(!target) {
			target = new AddNodesItem();
		}
		target.parentNodeId = this.parentNodeId;
		target.referenceTypeId = this.referenceTypeId;
		target.requestedNewNodeId = this.requestedNewNodeId;
		if (this.browseName) { target.browseName = this.browseName.clone();}
		target.nodeClass = this.nodeClass;
		target.nodeAttributes = this.nodeAttributes;
		target.typeDefinition = this.typeDefinition;
		return target;
	}


}
export function decodeAddNodesItem(	inp : DataStream) : AddNodesItem { 
		const obj = new AddNodesItem();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddNodesItem",AddNodesItem, makeExpandedNodeId(378,0));