

import {IdentityCriteriaType, encodeIdentityCriteriaType, decodeIdentityCriteriaType} from './IdentityCriteriaType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IIdentityMappingRuleType {
		criteriaType? : IdentityCriteriaType;
		criteria? : string;
}

/**

*/

export class IdentityMappingRuleType {
 		criteriaType : IdentityCriteriaType;
		criteria : string;

	constructor(	options? : IIdentityMappingRuleType) { 
		options = options || {};
		this.criteriaType= (options.criteriaType) ? options.criteriaType:null;
		this.criteria= (options.criteria) ? options.criteria:null;

	}


	encode(	out : DataStream) { 
		encodeIdentityCriteriaType(this.criteriaType,out);
		ec.encodeString(this.criteria,out);

	}


	decode(	inp : DataStream) { 
		this.criteriaType = decodeIdentityCriteriaType(inp);
		this.criteria = ec.decodeString(inp);

	}


	clone(	target? : IdentityMappingRuleType) : IdentityMappingRuleType { 
		if(!target) {
			target = new IdentityMappingRuleType();
		}
		target.criteriaType = this.criteriaType;
		target.criteria = this.criteria;
		return target;
	}


}
export function decodeIdentityMappingRuleType(	inp : DataStream) : IdentityMappingRuleType { 
		const obj = new IdentityMappingRuleType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("IdentityMappingRuleType",IdentityMappingRuleType, makeExpandedNodeId(15736,0));