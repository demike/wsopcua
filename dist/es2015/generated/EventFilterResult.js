import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import { ContentFilterResult } from './ContentFilterResult';
import { MonitoringFilterResult } from './MonitoringFilterResult';
/**

*/
export class EventFilterResult extends MonitoringFilterResult {
    constructor(options) {
        options = options || {};
        super();
        this.selectClauseResults = (options.selectClauseResults) ? options.selectClauseResults : [];
        this.selectClauseDiagnosticInfos = (options.selectClauseDiagnosticInfos) ? options.selectClauseDiagnosticInfos : [];
        this.whereClauseResult = (options.whereClauseResult) ? options.whereClauseResult : new ContentFilterResult();
    }
    encode(out) {
        ec.encodeArray(this.selectClauseResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.selectClauseDiagnosticInfos, out);
        this.whereClauseResult.encode(out);
    }
    decode(inp) {
        this.selectClauseResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.selectClauseDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
        this.whereClauseResult.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new EventFilterResult();
        }
        target.selectClauseResults = ec.cloneArray(this.selectClauseResults);
        if (this.selectClauseDiagnosticInfos) {
            target.selectClauseDiagnosticInfos = ec.cloneComplexArray(this.selectClauseDiagnosticInfos);
        }
        if (this.whereClauseResult) {
            target.whereClauseResult = this.whereClauseResult.clone();
        }
        return target;
    }
}
export function decodeEventFilterResult(inp) {
    let obj = new EventFilterResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventFilterResult", EventFilterResult, makeExpandedNodeId(736, 0));
//# sourceMappingURL=EventFilterResult.js.map