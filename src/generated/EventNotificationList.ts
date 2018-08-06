

import {EventFieldList} from './EventFieldList';
import {decodeEventFieldList} from './EventFieldList';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NotificationData} from './NotificationData';

export interface IEventNotificationList {
		events? : EventFieldList[];
}

/**

*/

export class EventNotificationList extends NotificationData {
 		events : EventFieldList[];

	constructor(	options? : IEventNotificationList) { 
		options = options || {};
		super();
		this.events= (options.events) ? options.events:[];

	}


	encode(	out : DataStream) { 
		ec.encodeArray(this.events,out);

	}


	decode(	inp : DataStream) { 
		this.events = ec.decodeArray(inp,decodeEventFieldList);

	}


	clone(	target? : EventNotificationList) : EventNotificationList { 
		if(!target) {
			target = new EventNotificationList();
		}
		if (this.events) { target.events = ec.cloneComplexArray(this.events);}
		return target;
	}


}
export function decodeEventNotificationList(	inp : DataStream) : EventNotificationList { 
		let obj = new EventNotificationList();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventNotificationList",EventNotificationList, makeExpandedNodeId(916,0));