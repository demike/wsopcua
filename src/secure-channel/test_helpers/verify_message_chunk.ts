// tslint:disable:no-console
import { analyseExtensionObject } from '../../packet-analyzer';
import { MessageSecurityMode } from '../../service-secure-channel';
import { SecurityPolicy } from '..';
import { MessageBuilder } from '../message_builder';
import { messageHeaderToString } from '../message_header_to_string';

/**
 *
 * @param packets
 */
export function verify_multi_chunk_message(packets: ArrayBufferView[]) {

    const messageBuilder = new MessageBuilder({});
    messageBuilder.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);

    messageBuilder.on('full_message_body', (fullMessageBody: ArrayBuffer) => {
        console.log('full_message_body received:');
        analyseExtensionObject(fullMessageBody, 0, 0);
    });
    messageBuilder.on('start_chunk', (info) => {
        console.log(' starting new chunk ', info.messageHeader);
    });

    messageBuilder.on('chunk', (messageChunk) => {
        console.log(messageHeaderToString(messageChunk));
    });

    let totalLength = 0;
    packets.forEach((packet) => {
        totalLength += packet.byteLength;
        // console.log(sprintf(" adding packet size : %5d l=%d", packet.length, totalLength));
        messageBuilder.feed(new DataView(packet.buffer));
    });
}

export function verify_single_chunk_message(packet: ArrayBufferView) {
    verify_multi_chunk_message([packet]);
}
