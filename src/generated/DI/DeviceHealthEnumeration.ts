

import {DataStream} from '../../basic-types/DataStream';

export enum DeviceHealthEnumeration {
 		NORMAL = 0,
		FAILURE = 1,
		CHECK_FUNCTION = 2,
		OFF_SPEC = 3,
		MAINTENANCE_REQUIRED = 4,

}

export function encodeDeviceHealthEnumeration(	data: DeviceHealthEnumeration, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeDeviceHealthEnumeration(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from '../../factory/factories_enumerations';
registerEnumeration("DeviceHealthEnumeration",DeviceHealthEnumeration,encodeDeviceHealthEnumeration ,decodeDeviceHealthEnumeration ,null);