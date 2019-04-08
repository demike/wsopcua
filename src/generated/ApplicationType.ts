

import {DataStream} from '../basic-types/DataStream';

/**
The types of applications.*/
export enum ApplicationType {
 		Server = 0,
		Client = 1,
		ClientAndServer = 2,
		DiscoveryServer = 3,

}

export function encodeApplicationType(	data: ApplicationType, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeApplicationType(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("ApplicationType",ApplicationType,encodeApplicationType ,decodeApplicationType ,null);