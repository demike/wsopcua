

import {DataStream} from '../basic-types/DataStream';

export enum DeadbandType {
 		None = 0,
		Absolute = 1,
		Percent = 2,

}

export function encodeDeadbandType(	data: DeadbandType, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeDeadbandType(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("DeadbandType",DeadbandType,encodeDeadbandType ,decodeDeadbandType ,null);