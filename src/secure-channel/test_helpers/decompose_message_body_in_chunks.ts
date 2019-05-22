import { assert } from '../../assert';
import { SequenceNumberGenerator } from '../sequence_number_generator';
import { SecureMessageChunkManager } from '../secure_message_chunk_manager';


/**
 * @method decompose_message_body_in_chunks
 *
 * @param messageBody
 * @param msgType
 * @param chunkSize
 * @return {Array}
 *
 * wrap a message body into one or more messageChunks
 * (  use this method to build fake data blocks in tests)
 */
export function decompose_message_body_in_chunks(messageBody: ArrayBufferLike, msgType: string, chunkSize: number) {

    assert(chunkSize > 24, 'expecting chunkSize');
    assert(msgType.length === 3, ' invalid msgType ' + msgType);
    assert(messageBody instanceof Uint8Array && messageBody.length > 0, ' invalid buffer');

    const sequenceNumberGenerator = new SequenceNumberGenerator();

    const options = {
        channelId: 10,
        chunkSize,
        cipherBlockSize: 0,
        plainBlockSize: 0,
        requestId: 36,
        sequenceHeaderSize: 0,
        signatureLength: 0,
    };

    const msgChunkManager = new SecureMessageChunkManager(msgType, options, null, sequenceNumberGenerator);
    const chunks: ArrayBuffer[] = [];
    msgChunkManager.on('chunk',  (chunk: ArrayBuffer | null) => {
        if (chunk) {
            assert(chunk.byteLength > 0);
            chunks.push(chunk);
        }
    });
    msgChunkManager.write(messageBody, messageBody.byteLength);
    msgChunkManager.end();
    assert(chunks.length > 0, 'decompose_message_body_in_chunks: must produce at least one chunk');
    return chunks;
}
