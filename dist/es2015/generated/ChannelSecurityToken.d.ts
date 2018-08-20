import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IChannelSecurityToken {
    channelId?: ec.UInt32;
    tokenId?: ec.UInt32;
    createdAt?: Date;
    revisedLifetime?: ec.UInt32;
}
/**
The token that identifies a set of keys for an active secure channel.
*/
export declare class ChannelSecurityToken {
    channelId: ec.UInt32;
    tokenId: ec.UInt32;
    createdAt: Date;
    revisedLifetime: ec.UInt32;
    constructor(options?: IChannelSecurityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ChannelSecurityToken): ChannelSecurityToken;
}
export declare function decodeChannelSecurityToken(inp: DataStream): ChannelSecurityToken;
