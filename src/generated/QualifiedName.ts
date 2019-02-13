

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IQualifiedName {
		namespaceIndex? : ec.UInt16;
		name? : string;
}

/**
A string qualified with a namespace index.
*/

export class QualifiedName {
 		namespaceIndex : ec.UInt16;
		name : string;

	constructor(	options? : IQualifiedName) { 
		options = options || {};
		this.namespaceIndex= (options.namespaceIndex) ? options.namespaceIndex:null;
		this.name= (options.name) ? options.name:null;

	}


	encode(	out : DataStream) { 
		ec.encodeUInt16(this.namespaceIndex,out);
		ec.encodeString(this.name,out);

	}


	decode(	inp : DataStream) { 
		this.namespaceIndex = ec.decodeUInt16(inp);
		this.name = ec.decodeString(inp);

	}


	clone(	target? : QualifiedName) : QualifiedName { 
		if(!target) {
			target = new QualifiedName();
		}
		target.namespaceIndex = this.namespaceIndex;
		target.name = this.name;
		return target;
	}


}
export function decodeQualifiedName(	inp : DataStream) : QualifiedName { 
		const obj = new QualifiedName();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QualifiedName",QualifiedName, makeExpandedNodeId(20,0));