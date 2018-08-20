import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISetPublishingModeRequest {
    requestHeader?: RequestHeader;
    publishingEnabled?: boolean;
    subscriptionIds?: ec.UInt32[];
}
/**

*/
export declare class SetPublishingModeRequest {
    requestHeader: RequestHeader;
    publishingEnabled: boolean;
    subscriptionIds: ec.UInt32[];
    constructor(options?: ISetPublishingModeRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetPublishingModeRequest): SetPublishingModeRequest;
}
export declare function decodeSetPublishingModeRequest(inp: DataStream): SetPublishingModeRequest;
