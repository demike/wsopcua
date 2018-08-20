import { RequestHeader } from './RequestHeader';
import { SignatureData } from './SignatureData';
import { SignedSoftwareCertificate } from './SignedSoftwareCertificate';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IActivateSessionRequest {
    requestHeader?: RequestHeader;
    clientSignature?: SignatureData;
    clientSoftwareCertificates?: SignedSoftwareCertificate[];
    localeIds?: string[];
    userIdentityToken?: ec.ExtensionObject;
    userTokenSignature?: SignatureData;
}
/**
Activates a session with the server.
*/
export declare class ActivateSessionRequest {
    requestHeader: RequestHeader;
    clientSignature: SignatureData;
    clientSoftwareCertificates: SignedSoftwareCertificate[];
    localeIds: string[];
    userIdentityToken: ec.ExtensionObject;
    userTokenSignature: SignatureData;
    constructor(options?: IActivateSessionRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ActivateSessionRequest): ActivateSessionRequest;
}
export declare function decodeActivateSessionRequest(inp: DataStream): ActivateSessionRequest;
