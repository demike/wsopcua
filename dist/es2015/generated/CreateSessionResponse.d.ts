import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { EndpointDescription } from './EndpointDescription';
import { SignedSoftwareCertificate } from './SignedSoftwareCertificate';
import { SignatureData } from './SignatureData';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateSessionResponse {
    responseHeader?: ResponseHeader;
    sessionId?: ec.NodeId;
    authenticationToken?: ec.NodeId;
    revisedSessionTimeout?: ec.Double;
    serverNonce?: Uint8Array;
    serverCertificate?: Uint8Array;
    serverEndpoints?: EndpointDescription[];
    serverSoftwareCertificates?: SignedSoftwareCertificate[];
    serverSignature?: SignatureData;
    maxRequestMessageSize?: ec.UInt32;
}
/**
Creates a new session with the server.
*/
export declare class CreateSessionResponse {
    responseHeader: ResponseHeader;
    sessionId: ec.NodeId;
    authenticationToken: ec.NodeId;
    revisedSessionTimeout: ec.Double;
    serverNonce: Uint8Array;
    serverCertificate: Uint8Array;
    serverEndpoints: EndpointDescription[];
    serverSoftwareCertificates: SignedSoftwareCertificate[];
    serverSignature: SignatureData;
    maxRequestMessageSize: ec.UInt32;
    constructor(options?: ICreateSessionResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateSessionResponse): CreateSessionResponse;
}
export declare function decodeCreateSessionResponse(inp: DataStream): CreateSessionResponse;
