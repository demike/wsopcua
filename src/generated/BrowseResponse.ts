

import {ResponseHeader} from './ResponseHeader';
import {BrowseResult} from './BrowseResult';
import {decodeBrowseResult} from './BrowseResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseResponse {
		responseHeader? : ResponseHeader;
		results? : BrowseResult[];
		diagnosticInfos? : DiagnosticInfo[];
}

/**
Browse the references for one or more nodes from the server address space.
*/

export class BrowseResponse {
 		responseHeader : ResponseHeader;
		results : BrowseResult[];
		diagnosticInfos : DiagnosticInfo[];

	constructor(	options? : IBrowseResponse) { 
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
		this.results = ec.decodeArray(inp,decodeBrowseResult);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target? : BrowseResponse) : BrowseResponse { 
		if(!target) {
			target = new BrowseResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		if (this.results) { target.results = ec.cloneComplexArray(this.results);}
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodeBrowseResponse(	inp : DataStream) : BrowseResponse { 
		let obj = new BrowseResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseResponse",BrowseResponse, makeExpandedNodeId(530,0));