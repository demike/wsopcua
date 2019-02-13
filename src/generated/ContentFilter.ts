

import {ContentFilterElement} from './ContentFilterElement';
import {decodeContentFilterElement} from './ContentFilterElement';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IContentFilter {
		elements? : ContentFilterElement[];
}

/**

*/

export class ContentFilter {
 		elements : ContentFilterElement[];

	constructor(	options? : IContentFilter) { 
		options = options || {};
		this.elements= (options.elements) ? options.elements:[];

	}


	encode(	out : DataStream) { 
		ec.encodeArray(this.elements,out);

	}


	decode(	inp : DataStream) { 
		this.elements = ec.decodeArray(inp,decodeContentFilterElement);

	}


	clone(	target? : ContentFilter) : ContentFilter { 
		if(!target) {
			target = new ContentFilter();
		}
		if (this.elements) { target.elements = ec.cloneComplexArray(this.elements);}
		return target;
	}


}
export function decodeContentFilter(	inp : DataStream) : ContentFilter { 
		const obj = new ContentFilter();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilter",ContentFilter, makeExpandedNodeId(588,0));