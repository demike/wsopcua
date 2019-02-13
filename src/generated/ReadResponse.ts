

import {ResponseHeader} from './ResponseHeader';
import {DataValue} from './DataValue';
import {decodeDataValue} from './DataValue';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IReadResponse {
		responseHeader? : ResponseHeader;
		results? : DataValue[];
		diagnosticInfos? : DiagnosticInfo[];
}

/**

*/

export class ReadResponse {
 		responseHeader : ResponseHeader;
		results : DataValue[];
		diagnosticInfos : DiagnosticInfo[];

	constructor(	options? : IReadResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.results= (options.results) ? options.results:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeArray(this.results,out);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);
		this.results = ec.decodeArray(inp,decodeDataValue);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target? : ReadResponse) : ReadResponse { 
		if(!target) {
			target = new ReadResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		if (this.results) { target.results = ec.cloneComplexArray(this.results);}
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeReadResponse(	inp : DataStream) : ReadResponse { 
		const obj = new ReadResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadResponse",ReadResponse, makeExpandedNodeId(634,0));