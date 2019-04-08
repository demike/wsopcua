

import {ResponseHeader} from './ResponseHeader';
import {QueryDataSet} from './QueryDataSet';
import {decodeQueryDataSet} from './QueryDataSet';
import * as ec from '../basic-types';
import {ParsingResult} from './ParsingResult';
import {decodeParsingResult} from './ParsingResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {ContentFilterResult} from './ContentFilterResult';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryFirstResponse {
		responseHeader?: ResponseHeader;
		queryDataSets?: QueryDataSet[];
		continuationPoint?: Uint8Array;
		parsingResults?: ParsingResult[];
		diagnosticInfos?: DiagnosticInfo[];
		filterResult?: ContentFilterResult;
}

/**

*/

export class QueryFirstResponse {
 		responseHeader: ResponseHeader;
		queryDataSets: QueryDataSet[];
		continuationPoint: Uint8Array;
		parsingResults: ParsingResult[];
		diagnosticInfos: DiagnosticInfo[];
		filterResult: ContentFilterResult;

	constructor(	options?: IQueryFirstResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.queryDataSets= (options.queryDataSets) ? options.queryDataSets:[];
		this.continuationPoint= (options.continuationPoint) ? options.continuationPoint:null;
		this.parsingResults= (options.parsingResults) ? options.parsingResults:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];
		this.filterResult= (options.filterResult) ? options.filterResult:new ContentFilterResult();

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeArray(this.queryDataSets,out);
		ec.encodeByteString(this.continuationPoint,out);
		ec.encodeArray(this.parsingResults,out);
		ec.encodeArray(this.diagnosticInfos,out);
		this.filterResult.encode(out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);
		this.queryDataSets = ec.decodeArray(inp,decodeQueryDataSet);
		this.continuationPoint = ec.decodeByteString(inp);
		this.parsingResults = ec.decodeArray(inp,decodeParsingResult);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);
		this.filterResult.decode(inp);

	}


	clone(	target?: QueryFirstResponse): QueryFirstResponse { 
		if(!target) {
			target = new QueryFirstResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		if (this.queryDataSets) { target.queryDataSets = ec.cloneComplexArray(this.queryDataSets);}
		target.continuationPoint = this.continuationPoint;
		if (this.parsingResults) { target.parsingResults = ec.cloneComplexArray(this.parsingResults);}
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		if (this.filterResult) { target.filterResult = this.filterResult.clone();}
		return target;
	}


}
export function decodeQueryFirstResponse(	inp: DataStream): QueryFirstResponse { 
		const obj = new QueryFirstResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryFirstResponse",QueryFirstResponse, makeExpandedNodeId(618,0));