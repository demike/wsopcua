

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IViewDescription {
		viewId?: ec.NodeId;
		timestamp?: Date;
		viewVersion?: ec.UInt32;
}

/**
The view to browse.
*/

export class ViewDescription {
 		viewId: ec.NodeId;
		timestamp: Date;
		viewVersion: ec.UInt32;

	constructor(	options?: IViewDescription) { 
		options = options || {};
		this.viewId= (options.viewId) ? options.viewId:null;
		this.timestamp= (options.timestamp) ? options.timestamp:null;
		this.viewVersion= (options.viewVersion) ? options.viewVersion:null;

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.viewId,out);
		ec.encodeDateTime(this.timestamp,out);
		ec.encodeUInt32(this.viewVersion,out);

	}


	decode(	inp: DataStream) { 
		this.viewId = ec.decodeNodeId(inp);
		this.timestamp = ec.decodeDateTime(inp);
		this.viewVersion = ec.decodeUInt32(inp);

	}


	clone(	target?: ViewDescription): ViewDescription { 
		if(!target) {
			target = new ViewDescription();
		}
		target.viewId = this.viewId;
		target.timestamp = this.timestamp;
		target.viewVersion = this.viewVersion;
		return target;
	}


}
export function decodeViewDescription(	inp: DataStream): ViewDescription { 
		const obj = new ViewDescription();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ViewDescription",ViewDescription, makeExpandedNodeId(513,0));