

import {ResponseHeader} from './ResponseHeader';
import {CallMethodResult} from './CallMethodResult';
import {decodeCallMethodResult} from './CallMethodResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICallResponse {
		responseHeader?: ResponseHeader;
		results?: CallMethodResult[];
		diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class CallResponse {
 		responseHeader: ResponseHeader;
		results: CallMethodResult[];
		diagnosticInfos: DiagnosticInfo[];

	constructor(	options?: ICallResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.results= (options.results) ? options.results:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeArray(this.results,out);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);
		this.results = ec.decodeArray(inp,decodeCallMethodResult);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: CallResponse): CallResponse { 
		if(!target) {
			target = new CallResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		if (this.results) { target.results = ec.cloneComplexArray(this.results);}
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeCallResponse(	inp: DataStream): CallResponse { 
		const obj = new CallResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CallResponse",CallResponse, makeExpandedNodeId(715,0));