

import {DataStream} from '../basic-types/DataStream';

export enum ExceptionDeviationFormat {
 		AbsoluteValue = 0,
		PercentOfValue = 1,
		PercentOfRange = 2,
		PercentOfEURange = 3,
		Unknown = 4,

}

export function encodeExceptionDeviationFormat(	data : ExceptionDeviationFormat, 	out : DataStream) { 
	out.setUint32(data);
	}


export function decodeExceptionDeviationFormat(	inp : DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("ExceptionDeviationFormat",ExceptionDeviationFormat,encodeExceptionDeviationFormat ,decodeExceptionDeviationFormat ,null);