

import {DataStream} from '../basic-types/DataStream';

export enum MonitoringMode {
 		Disabled = 0,
		Sampling = 1,
		Reporting = 2,

}

export function encodeMonitoringMode(	data : MonitoringMode, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeMonitoringMode(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("MonitoringMode",MonitoringMode,encodeMonitoringMode ,decodeMonitoringMode ,null);