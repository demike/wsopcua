

import {DataStream} from '../basic-types/DataStream';

export enum RedundancySupport {
 		None = 0,
		Cold = 1,
		Warm = 2,
		Hot = 3,
		Transparent = 4,
		HotAndMirrored = 5,

}

export function encodeRedundancySupport(	data : RedundancySupport, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeRedundancySupport(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("RedundancySupport",RedundancySupport,encodeRedundancySupport ,decodeRedundancySupport ,null);