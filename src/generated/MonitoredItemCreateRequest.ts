

import {ReadValueId} from './ReadValueId';
import {MonitoringMode, encodeMonitoringMode, decodeMonitoringMode} from './MonitoringMode';
import {MonitoringParameters} from './MonitoringParameters';
import {DataStream} from '../basic-types/DataStream';
import * as ec from '../basic-types';

export interface IMonitoredItemCreateRequest {
		itemToMonitor?: ReadValueId;
		monitoringMode?: MonitoringMode;
		requestedParameters?: MonitoringParameters;
}

/**

*/

export class MonitoredItemCreateRequest {
 		itemToMonitor: ReadValueId;
		monitoringMode: MonitoringMode;
		requestedParameters: MonitoringParameters;

	constructor(	options?: IMonitoredItemCreateRequest) { 
		options = options || {};
		this.itemToMonitor= (options.itemToMonitor) ? options.itemToMonitor:new ReadValueId();
		this.monitoringMode= (options.monitoringMode) ? options.monitoringMode:null;
		this.requestedParameters= (options.requestedParameters) ? options.requestedParameters:new MonitoringParameters();

	}


	encode(	out: DataStream) { 
		this.itemToMonitor.encode(out);
		encodeMonitoringMode(this.monitoringMode,out);
		this.requestedParameters.encode(out);

	}


	decode(	inp: DataStream) { 
		this.itemToMonitor.decode(inp);
		this.monitoringMode = decodeMonitoringMode(inp);
		this.requestedParameters.decode(inp);

	}


	clone(	target?: MonitoredItemCreateRequest): MonitoredItemCreateRequest { 
		if(!target) {
			target = new MonitoredItemCreateRequest();
		}
		if (this.itemToMonitor) { target.itemToMonitor = this.itemToMonitor.clone();}
		target.monitoringMode = this.monitoringMode;
		if (this.requestedParameters) { target.requestedParameters = this.requestedParameters.clone();}
		return target;
	}


}
export function decodeMonitoredItemCreateRequest(	inp: DataStream): MonitoredItemCreateRequest { 
		const obj = new MonitoredItemCreateRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemCreateRequest",MonitoredItemCreateRequest, makeExpandedNodeId(745,0));