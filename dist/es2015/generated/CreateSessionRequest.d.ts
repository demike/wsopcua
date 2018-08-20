import { RequestHeader } from './RequestHeader';
import { ApplicationDescription } from './ApplicationDescription';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateSessionRequest {
    requestHeader?: RequestHeader;
    clientDescription?: ApplicationDescription;
    serverUri?: string;
    endpointUrl?: string;
    sessionName?: string;
    clientNonce?: Uint8Array;
    clientCertificate?: Uint8Array;
    requestedSessionTimeout?: ec.Double;
    maxResponseMessageSize?: ec.UInt32;
}
/**
Creates a new session with the server.
*/
export declare class CreateSessionRequest {
    requestHeader: RequestHeader;
    clientDescription: ApplicationDescription;
    serverUri: string;
    endpointUrl: string;
    sessionName: string;
    clientNonce: Uint8Array;
    clientCertificate: Uint8Array;
    requestedSessionTimeout: ec.Double;
    maxResponseMessageSize: ec.UInt32;
    constructor(options?: ICreateSessionRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateSessionRequest): CreateSessionRequest;
}
export declare function decodeCreateSessionRequest(inp: DataStream): CreateSessionRequest;
