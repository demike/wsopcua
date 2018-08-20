import * as ec from '../basic-types';
import { Argument } from './Argument';
import { StatusResult } from './StatusResult';
import { DataStream } from '../basic-types/DataStream';
export interface IProgramDiagnosticDataType {
    createSessionId?: ec.NodeId;
    createClientName?: string;
    invocationCreationTime?: Date;
    lastTransitionTime?: Date;
    lastMethodCall?: string;
    lastMethodSessionId?: ec.NodeId;
    lastMethodInputArguments?: Argument[];
    lastMethodOutputArguments?: Argument[];
    lastMethodCallTime?: Date;
    lastMethodReturnStatus?: StatusResult;
}
/**

*/
export declare class ProgramDiagnosticDataType {
    createSessionId: ec.NodeId;
    createClientName: string;
    invocationCreationTime: Date;
    lastTransitionTime: Date;
    lastMethodCall: string;
    lastMethodSessionId: ec.NodeId;
    lastMethodInputArguments: Argument[];
    lastMethodOutputArguments: Argument[];
    lastMethodCallTime: Date;
    lastMethodReturnStatus: StatusResult;
    constructor(options?: IProgramDiagnosticDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ProgramDiagnosticDataType): ProgramDiagnosticDataType;
}
export declare function decodeProgramDiagnosticDataType(inp: DataStream): ProgramDiagnosticDataType;
