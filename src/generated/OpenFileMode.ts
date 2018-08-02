

import {DataStream} from '../basic-types/DataStream';

export enum OpenFileMode {
 		Read = 1,
		Write = 2,
		EraseExisting = 4,
		Append = 8,

}

export function encodeOpenFileMode(	data : OpenFileMode, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeOpenFileMode(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("OpenFileMode",OpenFileMode,encodeOpenFileMode ,decodeOpenFileMode ,null);