

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteNodesResponse {
		responseHeader?: ResponseHeader;
		results?: ec.StatusCode[];
		diagnosticInfos?: DiagnosticInfo[];
}

/**
Delete one or more nodes from the server address space.
*/

export class DeleteNodesResponse {
 		responseHeader: ResponseHeader;
		results: ec.StatusCode[];
		diagnosticInfos: DiagnosticInfo[];

	constructor(	options?: IDeleteNodesResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.results= (options.results) ? options.results:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeArray(this.results,out,ec.encodeStatusCode);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);
		this.results = ec.decodeArray(inp,ec.decodeStatusCode);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: DeleteNodesResponse): DeleteNodesResponse { 
		if(!target) {
			target = new DeleteNodesResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.results = ec.cloneArray(this.results);
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeDeleteNodesResponse(	inp: DataStream): DeleteNodesResponse { 
		const obj = new DeleteNodesResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteNodesResponse",DeleteNodesResponse, makeExpandedNodeId(503,0));