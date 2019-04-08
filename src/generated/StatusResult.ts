

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IStatusResult {
		statusCode?: ec.StatusCode;
		diagnosticInfo?: DiagnosticInfo;
}

/**

*/

export class StatusResult {
 		statusCode: ec.StatusCode;
		diagnosticInfo: DiagnosticInfo;

	constructor(	options?: IStatusResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.diagnosticInfo= (options.diagnosticInfo) ? options.diagnosticInfo:new DiagnosticInfo();

	}


	encode(	out: DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		this.diagnosticInfo.encode(out);

	}


	decode(	inp: DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.diagnosticInfo.decode(inp);

	}


	clone(	target?: StatusResult): StatusResult { 
		if(!target) {
			target = new StatusResult();
		}
		target.statusCode = this.statusCode;
		if (this.diagnosticInfo) { target.diagnosticInfo = this.diagnosticInfo.clone();}
		return target;
	}


}
export function decodeStatusResult(	inp: DataStream): StatusResult { 
		const obj = new StatusResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StatusResult",StatusResult, makeExpandedNodeId(301,0));