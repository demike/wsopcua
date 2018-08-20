import * as ec from '../basic-types';
import { Argument } from './Argument';
import { Variant } from '../variant';
import { StatusResult } from './StatusResult';
import { DataStream } from '../basic-types/DataStream';
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
export declare class ProgramDiagnostic2DataType {
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
    constructor(options?: IProgramDiagnostic2DataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ProgramDiagnostic2DataType): ProgramDiagnostic2DataType;
}
export declare function decodeProgramDiagnostic2DataType(inp: DataStream): ProgramDiagnostic2DataType;
