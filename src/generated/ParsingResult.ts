

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IParsingResult {
		statusCode?: ec.StatusCode;
		dataStatusCodes?: ec.StatusCode[];
		dataDiagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class ParsingResult {
 		statusCode: ec.StatusCode;
		dataStatusCodes: ec.StatusCode[];
		dataDiagnosticInfos: DiagnosticInfo[];

	constructor(	options?: IParsingResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.dataStatusCodes= (options.dataStatusCodes) ? options.dataStatusCodes:[];
		this.dataDiagnosticInfos= (options.dataDiagnosticInfos) ? options.dataDiagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeArray(this.dataStatusCodes,out,ec.encodeStatusCode);
		ec.encodeArray(this.dataDiagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.dataStatusCodes = ec.decodeArray(inp,ec.decodeStatusCode);
		this.dataDiagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: ParsingResult): ParsingResult { 
		if(!target) {
			target = new ParsingResult();
		}
		target.statusCode = this.statusCode;
		target.dataStatusCodes = ec.cloneArray(this.dataStatusCodes);
		if (this.dataDiagnosticInfos) { target.dataDiagnosticInfos = ec.cloneComplexArray(this.dataDiagnosticInfos);}
		return target;
	}


}
export function decodeParsingResult(	inp: DataStream): ParsingResult { 
		const obj = new ParsingResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ParsingResult",ParsingResult, makeExpandedNodeId(612,0));