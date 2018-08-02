

import * as ec from '../basic-types';
import {BrowseDirection, encodeBrowseDirection, decodeBrowseDirection} from './BrowseDirection';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseDescription {
		nodeId? : ec.NodeId;
		browseDirection? : BrowseDirection;
		referenceTypeId? : ec.NodeId;
		includeSubtypes? : boolean;
		nodeClassMask? : ec.UInt32;
		resultMask? : ec.UInt32;
}

/**
A request to browse the the references from a node.
*/

export class BrowseDescription {
 		nodeId : ec.NodeId;
		browseDirection : BrowseDirection;
		referenceTypeId : ec.NodeId;
		includeSubtypes : boolean;
		nodeClassMask : ec.UInt32;
		resultMask : ec.UInt32;

	constructor(	options? : IBrowseDescription) { 
		options = options || {};
		this.nodeId= (options.nodeId) ? options.nodeId:null;
		this.browseDirection= (options.browseDirection) ? options.browseDirection:null;
		this.referenceTypeId= (options.referenceTypeId) ? options.referenceTypeId:null;
		this.includeSubtypes= (options.includeSubtypes) ? options.includeSubtypes:null;
		this.nodeClassMask= (options.nodeClassMask) ? options.nodeClassMask:null;
		this.resultMask= (options.resultMask) ? options.resultMask:null;

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.nodeId,out);
		encodeBrowseDirection(this.browseDirection,out);
		ec.encodeNodeId(this.referenceTypeId,out);
		ec.encodeBoolean(this.includeSubtypes,out);
		ec.encodeUInt32(this.nodeClassMask,out);
		ec.encodeUInt32(this.resultMask,out);

	}


	decode(	inp : DataStream) { 
		this.nodeId = ec.decodeNodeId(inp);
		this.browseDirection = decodeBrowseDirection(inp);
		this.referenceTypeId = ec.decodeNodeId(inp);
		this.includeSubtypes = ec.decodeBoolean(inp);
		this.nodeClassMask = ec.decodeUInt32(inp);
		this.resultMask = ec.decodeUInt32(inp);

	}


	clone(	target? : BrowseDescription) : BrowseDescription { 
		if(!target) {
			target = new BrowseDescription();
		}
		target.nodeId = this.nodeId;
		target.browseDirection = this.browseDirection;
		target.referenceTypeId = this.referenceTypeId;
		target.includeSubtypes = this.includeSubtypes;
		target.nodeClassMask = this.nodeClassMask;
		target.resultMask = this.resultMask;
		return target;
	}


}
export function decodeBrowseDescription(	inp : DataStream) : BrowseDescription { 
		let obj = new BrowseDescription();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseDescription",BrowseDescription, makeExpandedNodeId(516,0));