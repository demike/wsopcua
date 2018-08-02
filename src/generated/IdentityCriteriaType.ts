

import {DataStream} from '../basic-types/DataStream';

export enum IdentityCriteriaType {
 		UserName = 1,
		Thumbprint = 2,
		Role = 3,
		GroupId = 4,
		Anonymous = 5,
		AuthenticatedUser = 6,

}

export function encodeIdentityCriteriaType(	data : IdentityCriteriaType, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeIdentityCriteriaType(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("IdentityCriteriaType",IdentityCriteriaType,encodeIdentityCriteriaType ,decodeIdentityCriteriaType ,null);