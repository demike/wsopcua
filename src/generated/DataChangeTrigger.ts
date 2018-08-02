

import {DataStream} from '../basic-types/DataStream';

export enum DataChangeTrigger {
 		Status = 0,
		StatusValue = 1,
		StatusValueTimestamp = 2,

}

export function encodeDataChangeTrigger(	data : DataChangeTrigger, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeDataChangeTrigger(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("DataChangeTrigger",DataChangeTrigger,encodeDataChangeTrigger ,decodeDataChangeTrigger ,null);