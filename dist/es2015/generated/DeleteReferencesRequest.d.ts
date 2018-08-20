import { RequestHeader } from './RequestHeader';
import { DeleteReferencesItem } from './DeleteReferencesItem';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteReferencesRequest {
    requestHeader?: RequestHeader;
    referencesToDelete?: DeleteReferencesItem[];
}
/**
Delete one or more references from the server address space.
*/
export declare class DeleteReferencesRequest {
    requestHeader: RequestHeader;
    referencesToDelete: DeleteReferencesItem[];
    constructor(options?: IDeleteReferencesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteReferencesRequest): DeleteReferencesRequest;
}
export declare function decodeDeleteReferencesRequest(inp: DataStream): DeleteReferencesRequest;
