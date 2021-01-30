'use strict';
/**
 * @module services.secure-channel
 */

import {ChannelSecurityToken} from '../generated/ChannelSecurityToken';
export {ChannelSecurityToken} from '../generated/ChannelSecurityToken';

/**
 * @property expired
 * @type {Boolean} - True if the security token has expired.
 */
export function isExpired(token: ChannelSecurityToken): boolean {
    return (this.createdAt.getTime() + this.revisedLifetime) < Date.now();
}

export {OpenSecureChannelRequest} from '../generated/OpenSecureChannelRequest';
export {OpenSecureChannelResponse} from '../generated/OpenSecureChannelResponse';
export {CloseSecureChannelRequest} from '../generated/CloseSecureChannelRequest';
export {CloseSecureChannelResponse} from '../generated/CloseSecureChannelResponse';
export {ServiceFault} from '../generated/ServiceFault';
export {AsymmetricAlgorithmSecurityHeader} from './AsymmetricAlgorithmSecurityHeader';
export {SymmetricAlgorithmSecurityHeader} from './SymmetricAlgorithmSecurityHeader';

export {SecurityTokenRequestType} from '../generated/SecurityTokenRequestType';
export {ResponseHeader} from '../generated/ResponseHeader';
export {RequestHeader} from '../generated/RequestHeader';
export {SequenceHeader} from './SequenceHeader';
export {SignatureData} from '../generated/SignatureData';
export {MessageSecurityMode} from '../generated/MessageSecurityMode';


