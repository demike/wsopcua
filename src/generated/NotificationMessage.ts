

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface INotificationMessage {
		sequenceNumber?: ec.UInt32;
		publishTime?: Date;
		notificationData?: ec.ExtensionObject[];
}

/**

*/

export class NotificationMessage {
 		sequenceNumber: ec.UInt32;
		publishTime: Date;
		notificationData: ec.ExtensionObject[];

	constructor(	options?: INotificationMessage) { 
		options = options || {};
		this.sequenceNumber= (options.sequenceNumber) ? options.sequenceNumber:null;
		this.publishTime= (options.publishTime) ? options.publishTime:null;
		this.notificationData= (options.notificationData) ? options.notificationData:[];

	}


	encode(	out: DataStream) { 
		ec.encodeUInt32(this.sequenceNumber,out);
		ec.encodeDateTime(this.publishTime,out);
		ec.encodeArray(this.notificationData,out,ec.encodeExtensionObject);

	}


	decode(	inp: DataStream) { 
		this.sequenceNumber = ec.decodeUInt32(inp);
		this.publishTime = ec.decodeDateTime(inp);
		this.notificationData = ec.decodeArray(inp,ec.decodeExtensionObject);

	}


	clone(	target?: NotificationMessage): NotificationMessage { 
		if(!target) {
			target = new NotificationMessage();
		}
		target.sequenceNumber = this.sequenceNumber;
		target.publishTime = this.publishTime;
		target.notificationData = ec.cloneArray(this.notificationData);
		return target;
	}


}
export function decodeNotificationMessage(	inp: DataStream): NotificationMessage { 
		const obj = new NotificationMessage();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NotificationMessage",NotificationMessage, makeExpandedNodeId(805,0));