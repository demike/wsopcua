

import * as ec from '../../basic-types';
import {ParameterResultDataType} from './ParameterResultDataType';
import {decodeParameterResultDataType} from './ParameterResultDataType';
import {DataStream} from '../../basic-types/DataStream';
import {FetchResultDataType} from './FetchResultDataType';

export interface ITransferResultDataDataType {
		sequenceNumber?: ec.Int32;
		endOfResults?: boolean;
		parameterDefs?: ParameterResultDataType[];
}

/**

*/

export class TransferResultDataDataType extends FetchResultDataType {
 		sequenceNumber: ec.Int32;
		endOfResults: boolean;
		parameterDefs: ParameterResultDataType[];

	constructor(	options?: ITransferResultDataDataType) { 
		options = options || {};
		super();
		this.sequenceNumber= (options.sequenceNumber) ? options.sequenceNumber:null;
		this.endOfResults= (options.endOfResults) ? options.endOfResults:null;
		this.parameterDefs= (options.parameterDefs) ? options.parameterDefs:[];

	}


	encode(	out: DataStream) { 
		ec.encodeInt32(this.sequenceNumber,out);
		ec.encodeBoolean(this.endOfResults,out);
		ec.encodeArray(this.parameterDefs,out);

	}


	decode(	inp: DataStream) { 
		this.sequenceNumber = ec.decodeInt32(inp);
		this.endOfResults = ec.decodeBoolean(inp);
		this.parameterDefs = ec.decodeArray(inp,decodeParameterResultDataType);

	}


	clone(	target?: TransferResultDataDataType): TransferResultDataDataType { 
		if(!target) {
			target = new TransferResultDataDataType();
		}
		target.sequenceNumber = this.sequenceNumber;
		target.endOfResults = this.endOfResults;
		if (this.parameterDefs) { target.parameterDefs = ec.cloneComplexArray(this.parameterDefs);}
		return target;
	}


}
export function decodeTransferResultDataDataType(	inp: DataStream): TransferResultDataDataType { 
		const obj = new TransferResultDataDataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../../factory/factories_factories';
import { makeExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition("TransferResultDataDataType",TransferResultDataDataType, makeExpandedNodeId(15894,2));