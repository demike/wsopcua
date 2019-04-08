

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface IEventFieldList {
		clientHandle?: ec.UInt32;
		eventFields?: Variant[];
}

/**

*/

export class EventFieldList {
 		clientHandle: ec.UInt32;
		eventFields: Variant[];

	constructor(	options?: IEventFieldList) { 
		options = options || {};
		this.clientHandle= (options.clientHandle) ? options.clientHandle:null;
		this.eventFields= (options.eventFields) ? options.eventFields:[];

	}


	encode(	out: DataStream) { 
		ec.encodeUInt32(this.clientHandle,out);
		ec.encodeArray(this.eventFields,out);

	}


	decode(	inp: DataStream) { 
		this.clientHandle = ec.decodeUInt32(inp);
		this.eventFields = ec.decodeArray(inp,decodeVariant);

	}


	clone(	target?: EventFieldList): EventFieldList { 
		if(!target) {
			target = new EventFieldList();
		}
		target.clientHandle = this.clientHandle;
		if (this.eventFields) { target.eventFields = ec.cloneComplexArray(this.eventFields);}
		return target;
	}


}
export function decodeEventFieldList(	inp: DataStream): EventFieldList { 
		const obj = new EventFieldList();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventFieldList",EventFieldList, makeExpandedNodeId(919,0));