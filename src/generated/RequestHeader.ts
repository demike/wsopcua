

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRequestHeader {
		authenticationToken? : ec.NodeId;
		timestamp? : Date;
		requestHandle? : ec.UInt32;
		returnDiagnostics? : ec.UInt32;
		auditEntryId? : string;
		timeoutHint? : ec.UInt32;
		additionalHeader? : ec.ExtensionObject;
}

/**
The header passed with every server request.
*/

export class RequestHeader {
 		authenticationToken : ec.NodeId;
		timestamp : Date;
		requestHandle : ec.UInt32;
		returnDiagnostics : ec.UInt32;
		auditEntryId : string;
		timeoutHint : ec.UInt32;
		additionalHeader : ec.ExtensionObject;

	constructor(	options? : IRequestHeader) { 
		options = options || {};
		this.authenticationToken= (options.authenticationToken) ? options.authenticationToken:null;
		this.timestamp= (options.timestamp) ? options.timestamp:null;
		this.requestHandle= (options.requestHandle) ? options.requestHandle:null;
		this.returnDiagnostics= (options.returnDiagnostics) ? options.returnDiagnostics:null;
		this.auditEntryId= (options.auditEntryId) ? options.auditEntryId:null;
		this.timeoutHint= (options.timeoutHint) ? options.timeoutHint:null;
		this.additionalHeader= (options.additionalHeader) ? options.additionalHeader:null;

	}


	encode(	out : DataStream) { 
		ec.encodeNodeId(this.authenticationToken,out);
		ec.encodeDateTime(this.timestamp,out);
		ec.encodeUInt32(this.requestHandle,out);
		ec.encodeUInt32(this.returnDiagnostics,out);
		ec.encodeString(this.auditEntryId,out);
		ec.encodeUInt32(this.timeoutHint,out);
		ec.encodeExtensionObject(this.additionalHeader,out);

	}


	decode(	inp : DataStream) { 
		this.authenticationToken = ec.decodeNodeId(inp);
		this.timestamp = ec.decodeDateTime(inp);
		this.requestHandle = ec.decodeUInt32(inp);
		this.returnDiagnostics = ec.decodeUInt32(inp);
		this.auditEntryId = ec.decodeString(inp);
		this.timeoutHint = ec.decodeUInt32(inp);
		this.additionalHeader = ec.decodeExtensionObject(inp);

	}


	clone(	target? : RequestHeader) : RequestHeader { 
		if(!target) {
			target = new RequestHeader();
		}
		target.authenticationToken = this.authenticationToken;
		target.timestamp = this.timestamp;
		target.requestHandle = this.requestHandle;
		target.returnDiagnostics = this.returnDiagnostics;
		target.auditEntryId = this.auditEntryId;
		target.timeoutHint = this.timeoutHint;
		target.additionalHeader = this.additionalHeader;
		return target;
	}


}
export function decodeRequestHeader(	inp : DataStream) : RequestHeader { 
		let obj = new RequestHeader();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RequestHeader",RequestHeader, makeExpandedNodeId(391,0));