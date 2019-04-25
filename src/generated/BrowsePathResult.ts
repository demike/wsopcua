

import * as ec from '../basic-types';
import {BrowsePathTarget} from './BrowsePathTarget';
import {decodeBrowsePathTarget} from './BrowsePathTarget';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowsePathResult {
		statusCode?: ec.StatusCode;
		targets?: BrowsePathTarget[];
}

/**
The result of a translate opearation.
*/

export class BrowsePathResult {
 		statusCode: ec.StatusCode;
		targets: BrowsePathTarget[];

	constructor(	options?: IBrowsePathResult) { 
		options = options || {};
		this.statusCode= (options.statusCode) ? options.statusCode:null;
		this.targets= (options.targets) ? options.targets:[];

	}


	encode(	out: DataStream) { 
		ec.encodeStatusCode(this.statusCode,out);
		ec.encodeArray(this.targets,out);

	}


	decode(	inp: DataStream) { 
		this.statusCode = ec.decodeStatusCode(inp);
		this.targets = ec.decodeArray(inp,decodeBrowsePathTarget);

	}


	clone(	target?: BrowsePathResult): BrowsePathResult { 
		if(!target) {
			target = new BrowsePathResult();
		}
		target.statusCode = this.statusCode;
		if (this.targets) { target.targets = ec.cloneComplexArray(this.targets);}
		return target;
	}


}
export function decodeBrowsePathResult(	inp: DataStream): BrowsePathResult { 
		const obj = new BrowsePathResult();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowsePathResult",BrowsePathResult, makeExpandedNodeId(551,0));