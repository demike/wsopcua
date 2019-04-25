

import {DataStream} from '../basic-types/DataStream';

/**
A mask specifying the class of the node.*/
export enum NodeClass {
 		Unspecified = 0,
		Object = 1,
		Variable = 2,
		Method = 4,
		ObjectType = 8,
		VariableType = 16,
		ReferenceType = 32,
		DataType = 64,
		View = 128,

}

export function encodeNodeClass(	data: NodeClass, 	out: DataStream) { 
	out.setUint32(data);
	}


export function decodeNodeClass(	inp: DataStream) { 
	return inp.getUint32();
	}



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration("NodeClass",NodeClass,encodeNodeClass ,decodeNodeClass ,null);