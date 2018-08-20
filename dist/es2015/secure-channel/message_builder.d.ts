import { SecurityPolicy, ICryptoFactory } from '../secure-channel/security_policy';
import { MessageBuilderBase } from '../transport/message_builder_base';
import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { DataStream } from '../basic-types/DataStream';
export declare class MessageBuilder extends MessageBuilderBase {
    protected _tokenStack: any;
    protected _privateKey: any;
    protected _cryptoFactory?: ICryptoFactory;
    protected _securityHeader: any;
    protected _previous_sequenceNumber: number;
    protected _objectFactory: any;
    securityMode: any;
    protected _securityPolicy: SecurityPolicy;
    /**
 * @class MessageBuilder
 * @extends MessageBuilderBase
 * @constructor
 *
 * @param options
 * @param options.securityMode {MessageSecurityMode} the security Mode
 * @param [options.objectFactory=factories] a object that provides a constructObject(id) method
 */
    constructor(options?: any);
    privateKey: string;
    readonly cryptoFactory: ICryptoFactory;
    setSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): void;
    protected _validateSequenceNumber(sequenceNumber: number): void;
    pushNewToken(securityToken: any, derivedKeys: any): void;
    protected _select_matching_token(tokenId: any): any;
    /**
     * @method _read_headers
     * @param binaryStream
     * @return {Boolean}
     * @private
     */
    protected _read_headers(binaryStream: DataStream): boolean;
    protected _safe_decode_message_body(full_message_body: any, objMessage: any, binaryStream: any): boolean;
    protected _decode_message_body(full_message_body: any): boolean;
}
