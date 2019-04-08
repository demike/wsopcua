

import {ContentFilterElementResult} from './ContentFilterElementResult';
import {decodeContentFilterElementResult} from './ContentFilterElementResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IContentFilterResult {
		elementResults?: ContentFilterElementResult[];
		elementDiagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class ContentFilterResult {
 		elementResults: ContentFilterElementResult[];
		elementDiagnosticInfos: DiagnosticInfo[];

	constructor(	options?: IContentFilterResult) { 
		options = options || {};
		this.elementResults= (options.elementResults) ? options.elementResults:[];
		this.elementDiagnosticInfos= (options.elementDiagnosticInfos) ? options.elementDiagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.elementResults,out);
		ec.encodeArray(this.elementDiagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.elementResults = ec.decodeArray(inp,decodeContentFilterElementResult);
		this.elementDiagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: ContentFilterResult): ContentFilterResult { 
		if(!target) {
			target = new ContentFilterResult();
		}
		if (this.elementResults) { target.elementResults = ec.cloneComplexArray(this.elementResults);}
		if (this.elementDiagnosticInfos) { target.elementDiagnosticInfos = ec.cloneComplexArray(this.elementDiagnosticInfos);}
		return target;
	}


}
export function decodeContentFilterResult(	inp: DataStream): ContentFilterResult { 
		const obj = new ContentFilterResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilterResult",ContentFilterResult, makeExpandedNodeId(609,0));