import { RequestHeader } from './RequestHeader';
import { DeleteNodesItem } from './DeleteNodesItem';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteNodesRequest {
    requestHeader?: RequestHeader;
    nodesToDelete?: DeleteNodesItem[];
}
/**
Delete one or more nodes from the server address space.
*/
export declare class DeleteNodesRequest {
    requestHeader: RequestHeader;
    nodesToDelete: DeleteNodesItem[];
    constructor(options?: IDeleteNodesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteNodesRequest): DeleteNodesRequest;
}
export declare function decodeDeleteNodesRequest(inp: DataStream): DeleteNodesRequest;
