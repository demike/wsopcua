import { RequestHeader } from './RequestHeader';
import { AddReferencesItem } from './AddReferencesItem';
import { DataStream } from '../basic-types/DataStream';
export interface IAddReferencesRequest {
    requestHeader?: RequestHeader;
    referencesToAdd?: AddReferencesItem[];
}
/**
Adds one or more references to the server address space.
*/
export declare class AddReferencesRequest {
    requestHeader: RequestHeader;
    referencesToAdd: AddReferencesItem[];
    constructor(options?: IAddReferencesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddReferencesRequest): AddReferencesRequest;
}
export declare function decodeAddReferencesRequest(inp: DataStream): AddReferencesRequest;
