

/**
This abstract DataType is the base DataType for all union DataTypes.
*/

export class Union {
 
	constructor(){};

	clone(	target?: Union): Union { 
		if(!target) {
			target = new Union();
		}
		return target;
	}


}
import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Union",Union, makeExpandedNodeId(12766,0));