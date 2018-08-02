

import {Variant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDataValue {
		value? : Variant;
		statusCode? : ec.StatusCode;
		sourceTimestamp? : Date;
		sourcePicoseconds? : ec.UInt16;
		serverTimestamp? : Date;
		serverPicoseconds? : ec.UInt16;
}

/**
A value with an associated timestamp, and quality.
*/

export class DataValue {
 		value : Variant;
		statusCode : ec.StatusCode;
		sourceTimestamp : Date;
		sourcePicoseconds : ec.UInt16;
		serverTimestamp : Date;
		serverPicoseconds : ec.UInt16;

	constructor(	options? : IDataValue) { 
		options = options || {};
		this.value= (options.value) ? options.value:null;
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.sourceTimestamp= (options.sourceTimestamp) ? options.sourceTimestamp:null;
		this.sourcePicoseconds= (options.sourcePicoseconds) ? options.sourcePicoseconds:null;
		this.serverTimestamp= (options.serverTimestamp) ? options.serverTimestamp:null;
		this.serverPicoseconds= (options.serverPicoseconds) ? options.serverPicoseconds:null;

	}


	encode(	out : DataStream) { 
		let encodingByte = 0;
		if (this.value != null) { encodingByte |= 1 << 0;}
		if (this.statusCode != null) { encodingByte |= 1 << 1;}
		if (this.sourceTimestamp != null) { encodingByte |= 1 << 2;}
		if (this.serverTimestamp != null) { encodingByte |= 1 << 3;}
		if (this.sourcePicoseconds != null) { encodingByte |= 1 << 4;}
		if (this.serverPicoseconds != null) { encodingByte |= 1 << 5;}
		out.setUint8(encodingByte);
		if(this.value != null) { this.value.encode(out); }
		if(this.statusCode != null) { ec.encodeStatusCode(this.statusCode,out); }
		if(this.sourceTimestamp != null) { ec.encodeDateTime(this.sourceTimestamp,out); }
		if(this.sourcePicoseconds != null) { ec.encodeUInt16(this.sourcePicoseconds,out); }
		if(this.serverTimestamp != null) { ec.encodeDateTime(this.serverTimestamp,out); }
		if(this.serverPicoseconds != null) { ec.encodeUInt16(this.serverPicoseconds,out); }

	}


	decode(	inp : DataStream) { 
		let encodingByte = inp.getUint8();
		let valueSpecified = (encodingByte & 1) != 0;
		let statusCodeSpecified = (encodingByte & 2) != 0;
		let sourceTimestampSpecified = (encodingByte & 4) != 0;
		let serverTimestampSpecified = (encodingByte & 8) != 0;
		let sourcePicosecondsSpecified = (encodingByte & 16) != 0;
		let serverPicosecondsSpecified = (encodingByte & 32) != 0;
		let reserved1 = (encodingByte & 64) != 0;
		if(valueSpecified) {
			this.value= new Variant();
			this.value.decode(inp);
		}
		if(statusCodeSpecified) {
			this.statusCode = ec.decodeStatusCode(inp);
		}
		if(sourceTimestampSpecified) {
			this.sourceTimestamp = ec.decodeDateTime(inp);
		}
		if(sourcePicosecondsSpecified) {
			this.sourcePicoseconds = ec.decodeUInt16(inp);
		}
		if(serverTimestampSpecified) {
			this.serverTimestamp = ec.decodeDateTime(inp);
		}
		if(serverPicosecondsSpecified) {
			this.serverPicoseconds = ec.decodeUInt16(inp);
		}

	}


	clone(	target? : DataValue) : DataValue { 
		if(!target) {
			target = new DataValue();
		}
		if (this.value) { target.value = this.value.clone();}
		target.statusCode = this.statusCode;
		target.sourceTimestamp = this.sourceTimestamp;
		target.sourcePicoseconds = this.sourcePicoseconds;
		target.serverTimestamp = this.serverTimestamp;
		target.serverPicoseconds = this.serverPicoseconds;
		return target;
	}


}
export function decodeDataValue(	inp : DataStream) : DataValue { 
		let obj = new DataValue();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataValue",DataValue, makeExpandedNodeId(23,0));