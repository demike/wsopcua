

import * as ec from '../basic-types';
import {Argument} from './Argument';
import {decodeArgument} from './Argument';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {StatusResult} from './StatusResult';
import {DataStream} from '../basic-types/DataStream';

export interface IProgramDiagnostic2DataType {
		createSessionId?: ec.NodeId;
		createClientName?: string;
		invocationCreationTime?: Date;
		lastTransitionTime?: Date;
		lastMethodCall?: string;
		lastMethodSessionId?: ec.NodeId;
		lastMethodInputArguments?: Argument[];
		lastMethodOutputArguments?: Argument[];
		lastMethodInputValues?: Variant[];
		lastMethodOutputValues?: Variant[];
		lastMethodCallTime?: Date;
		lastMethodReturnStatus?: StatusResult;
}

/**

*/

export class ProgramDiagnostic2DataType {
 		createSessionId: ec.NodeId;
		createClientName: string;
		invocationCreationTime: Date;
		lastTransitionTime: Date;
		lastMethodCall: string;
		lastMethodSessionId: ec.NodeId;
		lastMethodInputArguments: Argument[];
		lastMethodOutputArguments: Argument[];
		lastMethodInputValues: Variant[];
		lastMethodOutputValues: Variant[];
		lastMethodCallTime: Date;
		lastMethodReturnStatus: StatusResult;

	constructor(	options?: IProgramDiagnostic2DataType) { 
		options = options || {};
		this.createSessionId= (options.createSessionId) ? options.createSessionId:null;
		this.createClientName= (options.createClientName) ? options.createClientName:null;
		this.invocationCreationTime= (options.invocationCreationTime) ? options.invocationCreationTime:null;
		this.lastTransitionTime= (options.lastTransitionTime) ? options.lastTransitionTime:null;
		this.lastMethodCall= (options.lastMethodCall) ? options.lastMethodCall:null;
		this.lastMethodSessionId= (options.lastMethodSessionId) ? options.lastMethodSessionId:null;
		this.lastMethodInputArguments= (options.lastMethodInputArguments) ? options.lastMethodInputArguments:[];
		this.lastMethodOutputArguments= (options.lastMethodOutputArguments) ? options.lastMethodOutputArguments:[];
		this.lastMethodInputValues= (options.lastMethodInputValues) ? options.lastMethodInputValues:[];
		this.lastMethodOutputValues= (options.lastMethodOutputValues) ? options.lastMethodOutputValues:[];
		this.lastMethodCallTime= (options.lastMethodCallTime) ? options.lastMethodCallTime:null;
		this.lastMethodReturnStatus= (options.lastMethodReturnStatus) ? options.lastMethodReturnStatus:new StatusResult();

	}


	encode(	out: DataStream) { 
		ec.encodeNodeId(this.createSessionId,out);
		ec.encodeString(this.createClientName,out);
		ec.encodeDateTime(this.invocationCreationTime,out);
		ec.encodeDateTime(this.lastTransitionTime,out);
		ec.encodeString(this.lastMethodCall,out);
		ec.encodeNodeId(this.lastMethodSessionId,out);
		ec.encodeArray(this.lastMethodInputArguments,out);
		ec.encodeArray(this.lastMethodOutputArguments,out);
		ec.encodeArray(this.lastMethodInputValues,out);
		ec.encodeArray(this.lastMethodOutputValues,out);
		ec.encodeDateTime(this.lastMethodCallTime,out);
		this.lastMethodReturnStatus.encode(out);

	}


	decode(	inp: DataStream) { 
		this.createSessionId = ec.decodeNodeId(inp);
		this.createClientName = ec.decodeString(inp);
		this.invocationCreationTime = ec.decodeDateTime(inp);
		this.lastTransitionTime = ec.decodeDateTime(inp);
		this.lastMethodCall = ec.decodeString(inp);
		this.lastMethodSessionId = ec.decodeNodeId(inp);
		this.lastMethodInputArguments = ec.decodeArray(inp,decodeArgument);
		this.lastMethodOutputArguments = ec.decodeArray(inp,decodeArgument);
		this.lastMethodInputValues = ec.decodeArray(inp,decodeVariant);
		this.lastMethodOutputValues = ec.decodeArray(inp,decodeVariant);
		this.lastMethodCallTime = ec.decodeDateTime(inp);
		this.lastMethodReturnStatus.decode(inp);

	}


	clone(	target?: ProgramDiagnostic2DataType): ProgramDiagnostic2DataType { 
		if(!target) {
			target = new ProgramDiagnostic2DataType();
		}
		target.createSessionId = this.createSessionId;
		target.createClientName = this.createClientName;
		target.invocationCreationTime = this.invocationCreationTime;
		target.lastTransitionTime = this.lastTransitionTime;
		target.lastMethodCall = this.lastMethodCall;
		target.lastMethodSessionId = this.lastMethodSessionId;
		if (this.lastMethodInputArguments) { target.lastMethodInputArguments = ec.cloneComplexArray(this.lastMethodInputArguments);}
		if (this.lastMethodOutputArguments) { target.lastMethodOutputArguments = ec.cloneComplexArray(this.lastMethodOutputArguments);}
		if (this.lastMethodInputValues) { target.lastMethodInputValues = ec.cloneComplexArray(this.lastMethodInputValues);}
		if (this.lastMethodOutputValues) { target.lastMethodOutputValues = ec.cloneComplexArray(this.lastMethodOutputValues);}
		target.lastMethodCallTime = this.lastMethodCallTime;
		if (this.lastMethodReturnStatus) { target.lastMethodReturnStatus = this.lastMethodReturnStatus.clone();}
		return target;
	}


}
export function decodeProgramDiagnostic2DataType(	inp: DataStream): ProgramDiagnostic2DataType { 
		const obj = new ProgramDiagnostic2DataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ProgramDiagnostic2DataType",ProgramDiagnostic2DataType, makeExpandedNodeId(15397,0));