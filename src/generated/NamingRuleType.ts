

import {DataStream} from '../basic-types/DataStream';

export enum NamingRuleType {
 		Mandatory = 1,
		Optional = 2,
		Constraint = 3,

}

export function encodeNamingRuleType(	data: NamingRuleType, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeNamingRuleType(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration("NamingRuleType",NamingRuleType,encodeNamingRuleType ,decodeNamingRuleType ,null);