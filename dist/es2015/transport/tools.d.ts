import { DataStream } from '../basic-types/DataStream';
export declare function decodeMessage(stream: DataStream, ClassName: any): any;
export declare function packTcpMessage(msgType: any, encodableObject: any): ArrayBuffer;
export declare function parseEndpointUrl(endpointUrl: string): {
    protocol: string;
    hostname: string;
    port: number;
    address: string;
};
export declare function is_valid_endpointUrl(endpointUrl: any): boolean;
/**
 * @method encodeMessage
 * @type {{
 *     msgType: String,
 *     messageContent: Object,
 *     binaryStream: BinaryStream
 * }}
 */
export declare function writeTCPMessageHeader(msgType: any, chunkType: any, total_length: any, stream: any): void;
