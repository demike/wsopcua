import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISetTriggeringRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    triggeringItemId?: ec.UInt32;
    linksToAdd?: ec.UInt32[];
    linksToRemove?: ec.UInt32[];
}
/**

*/
export declare class SetTriggeringRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    triggeringItemId: ec.UInt32;
    linksToAdd: ec.UInt32[];
    linksToRemove: ec.UInt32[];
    constructor(options?: ISetTriggeringRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetTriggeringRequest): SetTriggeringRequest;
}
export declare function decodeSetTriggeringRequest(inp: DataStream): SetTriggeringRequest;
