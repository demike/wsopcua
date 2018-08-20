import { ResponseHeader } from './ResponseHeader';
import { decodeQueryDataSet } from './QueryDataSet';
import * as ec from '../basic-types';
import { decodeParsingResult } from './ParsingResult';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import { ContentFilterResult } from './ContentFilterResult';
/**

*/
export class QueryFirstResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.queryDataSets = (options.queryDataSets) ? options.queryDataSets : [];
        this.continuationPoint = (options.continuationPoint) ? options.continuationPoint : null;
        this.parsingResults = (options.parsingResults) ? options.parsingResults : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
        this.filterResult = (options.filterResult) ? options.filterResult : new ContentFilterResult();
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.queryDataSets, out);
        ec.encodeByteString(this.continuationPoint, out);
        ec.encodeArray(this.parsingResults, out);
        ec.encodeArray(this.diagnosticInfos, out);
        this.filterResult.encode(out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.queryDataSets = ec.decodeArray(inp, decodeQueryDataSet);
        this.continuationPoint = ec.decodeByteString(inp);
        this.parsingResults = ec.decodeArray(inp, decodeParsingResult);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
        this.filterResult.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new QueryFirstResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.queryDataSets) {
            target.queryDataSets = ec.cloneComplexArray(this.queryDataSets);
        }
        target.continuationPoint = this.continuationPoint;
        if (this.parsingResults) {
            target.parsingResults = ec.cloneComplexArray(this.parsingResults);
        }
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        if (this.filterResult) {
            target.filterResult = this.filterResult.clone();
        }
        return target;
    }
}
export function decodeQueryFirstResponse(inp) {
    let obj = new QueryFirstResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryFirstResponse", QueryFirstResponse, makeExpandedNodeId(618, 0));
//# sourceMappingURL=QueryFirstResponse.js.map