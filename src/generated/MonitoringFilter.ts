

import * as ec from '../basic-types';
/**

*/

export class MonitoringFilter {
 
	constructor(){};

	clone(	target? : MonitoringFilter) : MonitoringFilter { 
		if(!target) {
			target = new MonitoringFilter();
		}
		return target;
	}


}
import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoringFilter",MonitoringFilter, makeExpandedNodeId(721,0));