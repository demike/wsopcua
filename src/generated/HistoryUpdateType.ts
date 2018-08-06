

import {DataStream} from '../basic-types/DataStream';

export enum HistoryUpdateType {
 		Insert = 1,
		Replace = 2,
		Update = 3,
		Delete = 4,

}

export function encodeHistoryUpdateType(	data : HistoryUpdateType, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeHistoryUpdateType(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("HistoryUpdateType",HistoryUpdateType,encodeHistoryUpdateType ,decodeHistoryUpdateType ,null);