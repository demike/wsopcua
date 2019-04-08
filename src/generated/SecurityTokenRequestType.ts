

import {DataStream} from '../basic-types/DataStream';

/**
Indicates whether a token if being created or renewed.*/
export enum SecurityTokenRequestType {
 		Issue = 0,
		Renew = 1,

}

export function encodeSecurityTokenRequestType(	data: SecurityTokenRequestType, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeSecurityTokenRequestType(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("SecurityTokenRequestType",SecurityTokenRequestType,encodeSecurityTokenRequestType ,decodeSecurityTokenRequestType ,null);