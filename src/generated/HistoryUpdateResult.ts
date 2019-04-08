

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryUpdateResult {
		statusCode?: ec.StatusCode;
		operationResults?: ec.StatusCode[];
		diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class HistoryUpdateResult {
 		statusCode: ec.StatusCode;
		operationResults: ec.StatusCode[];
		diagnosticInfos: DiagnosticInfo[];

	constructor(	options?: IHistoryUpdateResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.operationResults= (options.operationResults) ? options.operationResults:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeArray(this.operationResults,out,ec.encodeStatusCode);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.operationResults = ec.decodeArray(inp,ec.decodeStatusCode);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: HistoryUpdateResult): HistoryUpdateResult { 
		if(!target) {
			target = new HistoryUpdateResult();
		}
		target.statusCode = this.statusCode;
		target.operationResults = ec.cloneArray(this.operationResults);
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeHistoryUpdateResult(	inp: DataStream): HistoryUpdateResult { 
		const obj = new HistoryUpdateResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryUpdateResult",HistoryUpdateResult, makeExpandedNodeId(697,0));