import { ContentFilterElementResult } from './ContentFilterElementResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IContentFilterResult {
    elementResults?: ContentFilterElementResult[];
    elementDiagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class ContentFilterResult {
    elementResults: ContentFilterElementResult[];
    elementDiagnosticInfos: DiagnosticInfo[];
    constructor(options?: IContentFilterResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ContentFilterResult): ContentFilterResult;
}
export declare function decodeContentFilterResult(inp: DataStream): ContentFilterResult;
