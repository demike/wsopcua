

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITransferResult {
		statusCode? : ec.StatusCode;
		availableSequenceNumbers? : ec.UInt32[];
}

/**

*/

export class TransferResult {
 		statusCode : ec.StatusCode;
		availableSequenceNumbers : ec.UInt32[];

	constructor(	options? : ITransferResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.availableSequenceNumbers= (options.availableSequenceNumbers) ? options.availableSequenceNumbers:[];

	}


	encode(	out : DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeArray(this.availableSequenceNumbers,out,ec.encodeUInt32);

	}


	decode(	inp : DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.availableSequenceNumbers = ec.decodeArray(inp,ec.decodeUInt32);

	}


	clone(	target? : TransferResult) : TransferResult { 
		if(!target) {
			target = new TransferResult();
		}
		target.statusCode = this.statusCode;
		target.availableSequenceNumbers = ec.cloneArray(this.availableSequenceNumbers);
		return target;
	}


}
export function decodeTransferResult(	inp : DataStream) : TransferResult { 
		let obj = new TransferResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TransferResult",TransferResult, makeExpandedNodeId(838,0));