/**
 * @module opcua.miscellaneous
 */
import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';
import { hexDump } from '../common/debug';
import { readMessageHeader } from '../chunkmanager';
import { chooseSecurityHeader } from './secure_message_chunk_manager';
import { SequenceHeader } from '../service-secure-channel';
/**
 * convert the messageChunk header to a string
 * @method messageHeaderToString
 * @param messageChunk {DataStream}
 * @return {string}
 */
export function messageHeaderToString(messageChunk) {
    var stream = new DataStream(messageChunk);
    var messageHeader = readMessageHeader(stream);
    if (messageHeader.msgType === "ERR" || messageHeader.msgType === "HEL") {
        return messageHeader.msgType + " " + messageHeader.isFinal + " length   = " + messageHeader.length;
    }
    var securityHeader = chooseSecurityHeader(messageHeader.msgType);
    var sequenceHeader = new SequenceHeader();
    assert(stream.length === 8);
    var secureChannelId = stream.getUint32();
    securityHeader.decode(stream);
    sequenceHeader.decode(stream);
    var slice = messageChunk.slice(0, stream.length);
    return messageHeader.msgType + " " +
        messageHeader.isFinal +
        " length   = " + messageHeader.length +
        " channel  = " + secureChannelId +
        " seqNum   = " + sequenceHeader.sequenceNumber +
        " req ID   = " + sequenceHeader.requestId +
        " security   = " + JSON.stringify(securityHeader) +
        "\n\n" + hexDump(slice);
}
//# sourceMappingURL=message_header_to_string.js.map