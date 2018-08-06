

import {MonitoredItemNotification} from './MonitoredItemNotification';
import {decodeMonitoredItemNotification} from './MonitoredItemNotification';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NotificationData} from './NotificationData';

export interface IDataChangeNotification {
		monitoredItems? : MonitoredItemNotification[];
		diagnosticInfos? : DiagnosticInfo[];
}

/**

*/

export class DataChangeNotification extends NotificationData {
 		monitoredItems : MonitoredItemNotification[];
		diagnosticInfos : DiagnosticInfo[];

	constructor(	options? : IDataChangeNotification) { 
		options = options || {};
		super();
		this.monitoredItems= (options.monitoredItems) ? options.monitoredItems:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out : DataStream) { 
		ec.encodeArray(this.monitoredItems,out);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp : DataStream) { 
		this.monitoredItems = ec.decodeArray(inp,decodeMonitoredItemNotification);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target? : DataChangeNotification) : DataChangeNotification { 
		if(!target) {
			target = new DataChangeNotification();
		}
		if (this.monitoredItems) { target.monitoredItems = ec.cloneComplexArray(this.monitoredItems);}
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeDataChangeNotification(	inp : DataStream) : DataChangeNotification { 
		let obj = new DataChangeNotification();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataChangeNotification",DataChangeNotification, makeExpandedNodeId(811,0));