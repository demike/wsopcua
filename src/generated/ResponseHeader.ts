

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IResponseHeader {
		timestamp?: Date;
		requestHandle?: ec.UInt32;
		serviceResult?: ec.StatusCode;
		serviceDiagnostics?: DiagnosticInfo;
		stringTable?: string[];
		additionalHeader?: ec.ExtensionObject;
}

/**
The header passed with every server response.
*/

export class ResponseHeader {
 		timestamp: Date;
		requestHandle: ec.UInt32;
		serviceResult: ec.StatusCode;
		serviceDiagnostics: DiagnosticInfo;
		stringTable: string[];
		additionalHeader: ec.ExtensionObject;

	constructor(	options?: IResponseHeader) { 
		options = options || {};
		this.timestamp= (options.timestamp) ? options.timestamp:null;
		this.requestHandle= (options.requestHandle) ? options.requestHandle:null;
		this.serviceResult= (options.serviceResult) ? options.serviceResult:null;
		this.serviceDiagnostics= (options.serviceDiagnostics) ? options.serviceDiagnostics:new DiagnosticInfo();
		this.stringTable= (options.stringTable) ? options.stringTable:[];
		this.additionalHeader= (options.additionalHeader) ? options.additionalHeader:null;

	}


	encode(	out: DataStream) { 
		ec.encodeDateTime(this.timestamp,out);
		ec.encodeUInt32(this.requestHandle,out);
		ec.encodeStatusCode(this.serviceResult,out);
		this.serviceDiagnostics.encode(out);
		ec.encodeArray(this.stringTable,out,ec.encodeString);
		ec.encodeExtensionObject(this.additionalHeader,out);

	}


	decode(	inp: DataStream) { 
		this.timestamp = ec.decodeDateTime(inp);
		this.requestHandle = ec.decodeUInt32(inp);
		this.serviceResult = ec.decodeStatusCode(inp);
		this.serviceDiagnostics.decode(inp);
		this.stringTable = ec.decodeArray(inp,ec.decodeString);
		this.additionalHeader = ec.decodeExtensionObject(inp);

	}


	clone(	target?: ResponseHeader): ResponseHeader { 
		if(!target) {
			target = new ResponseHeader();
		}
		target.timestamp = this.timestamp;
		target.requestHandle = this.requestHandle;
		target.serviceResult = this.serviceResult;
		if (this.serviceDiagnostics) { target.serviceDiagnostics = this.serviceDiagnostics.clone();}
		target.stringTable = ec.cloneArray(this.stringTable);
		target.additionalHeader = this.additionalHeader;
		return target;
	}


}
export function decodeResponseHeader(	inp: DataStream): ResponseHeader { 
		const obj = new ResponseHeader();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ResponseHeader",ResponseHeader, makeExpandedNodeId(394,0));