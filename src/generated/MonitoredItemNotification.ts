

import * as ec from '../basic-types';
import {DataValue} from './DataValue';
import {DataStream} from '../basic-types/DataStream';

export interface IMonitoredItemNotification {
		clientHandle? : ec.UInt32;
		value? : DataValue;
}

/**

*/

export class MonitoredItemNotification {
 		clientHandle : ec.UInt32;
		value : DataValue;

	constructor(	options? : IMonitoredItemNotification) { 
		options = options || {};
		this.clientHandle= (options.clientHandle) ? options.clientHandle:null;
		this.value= (options.value) ? options.value:new DataValue();

	}


	encode(	out : DataStream) { 
		ec.encodeUInt32(this.clientHandle,out);
		this.value.encode(out);

	}


	decode(	inp : DataStream) { 
		this.clientHandle = ec.decodeUInt32(inp);
		this.value.decode(inp);

	}


	clone(	target? : MonitoredItemNotification) : MonitoredItemNotification { 
		if(!target) {
			target = new MonitoredItemNotification();
		}
		target.clientHandle = this.clientHandle;
		if (this.value) { target.value = this.value.clone();}
		return target;
	}


}
export function decodeMonitoredItemNotification(	inp : DataStream) : MonitoredItemNotification { 
		const obj = new MonitoredItemNotification();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemNotification",MonitoredItemNotification, makeExpandedNodeId(808,0));