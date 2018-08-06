

import {DataStream} from '../basic-types/DataStream';

/**
The possible encodings for a NodeId value.*/
export enum NodeIdType {
 		TwoByte = 0,
		FourByte = 1,
		Numeric = 2,
		String = 3,
		Guid = 4,
		ByteString = 5,

}

export function encodeNodeIdType(	data : NodeIdType, 	out : DataStream) { 
	out.setByte(data);
	}


export function decodeNodeIdType(	inp : DataStream) { 
	return inp.getByte();
	}



import {registerEnumeration} from "../factory/factories_enumerations";
registerEnumeration("NodeIdType",NodeIdType,encodeNodeIdType ,decodeNodeIdType ,null);