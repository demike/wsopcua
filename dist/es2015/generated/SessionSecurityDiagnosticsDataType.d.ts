import * as ec from '../basic-types';
import { MessageSecurityMode } from './MessageSecurityMode';
import { DataStream } from '../basic-types/DataStream';
export interface ISessionSecurityDiagnosticsDataType {
    sessionId?: ec.NodeId;
    clientUserIdOfSession?: string;
    clientUserIdHistory?: string[];
    authenticationMechanism?: string;
    encoding?: string;
    transportProtocol?: string;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: string;
    clientCertificate?: Uint8Array;
}
/**

*/
export declare class SessionSecurityDiagnosticsDataType {
    sessionId: ec.NodeId;
    clientUserIdOfSession: string;
    clientUserIdHistory: string[];
    authenticationMechanism: string;
    encoding: string;
    transportProtocol: string;
    securityMode: MessageSecurityMode;
    securityPolicyUri: string;
    clientCertificate: Uint8Array;
    constructor(options?: ISessionSecurityDiagnosticsDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SessionSecurityDiagnosticsDataType): SessionSecurityDiagnosticsDataType;
}
export declare function decodeSessionSecurityDiagnosticsDataType(inp: DataStream): SessionSecurityDiagnosticsDataType;
