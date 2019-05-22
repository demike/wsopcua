import { PacketAssembler } from './packet_assembler';
import { concatArrayBuffers } from '../wsopcua';

function makeMessage(msgType, length) {

    const total_length = length + 4 + 1;

    expect(total_length).toBeGreaterThan(0);

    const buf = new DataView(new ArrayBuffer(total_length));

    buf.setUint8(0, msgType.charCodeAt(0));
    buf.setUint32(1, total_length, true);

    for (let i = 0; i < length; i++) {
        buf.setUint8(i + 5, msgType.charCodeAt(0));
    }

    return buf;
}
function readerHeader(data: DataView) {
    const msgType = String.fromCharCode(data.getUint8(0));
    const length = data.getUint32(1, true);
    return {length: length, extra: msgType};
}

function message_slice(packet: DataView, begin: number, end?: number) {
    return new DataView(packet.buffer.slice(begin, end));
}


describe('PacketAssembler', function () {

    it('should assemble a single packet', function (done) {


        const packet_assembler = new PacketAssembler({readMessageFunc: readerHeader, minimumSizeInBytes: 5})
            .on('message', function (message: DataView) {

                const info = readerHeader(message);
                expect(info.length).toBe(message.byteLength);

                done();
            });

        packet_assembler.feed(makeMessage('A', 200));

    });


    it('should assemble a message sent over several packets', function (done) {

        const packet_assembler = new PacketAssembler({readMessageFunc: readerHeader, minimumSizeInBytes: 5})
            .on('message', function (message: DataView) {

                const info = readerHeader(message);
                expect(info.length).toBe(message.byteLength);
                expect(info.length).toBe(2000 + 5);
                done();
            });

        const message1 = makeMessage('A', 2000);

        const packet1 = message1.buffer.slice(0, 100);
        const packet2 = message1.buffer.slice(100, 200);
        const packet3 = message1.buffer.slice(200);

        packet_assembler.feed(new DataView(packet1));
        packet_assembler.feed(new DataView (packet2));
        packet_assembler.feed(new DataView(packet3));

    });

    it('should assemble a message sent one byte at a time', function (done) {

        const packet_assembler = new PacketAssembler({readMessageFunc: readerHeader, minimumSizeInBytes: 5})
            .on('message', function (message: DataView) {

                const info = readerHeader(message);
                expect(info.length).toBe(message.byteLength);

                done();
            });

        const message = makeMessage('A', 200);

        for (let i = 0; i < message.byteLength; i++) {
            const single_byte_chunk = message.buffer.slice(i, i + 1);
            packet_assembler.feed(new DataView(single_byte_chunk));
        }

    });

    it('should deal with packets containing data from 2 different messages', function (done) {

        let counter = 0;
        const packet_assembler = new PacketAssembler({readMessageFunc: readerHeader, minimumSizeInBytes: 5})
            .on('message', function (message: DataView) {

                const info = readerHeader(message);
                expect(info.length).toBe(message.byteLength);
                expect(info.length).toBe(200 + 5);
                counter += 1;
                if (counter === 1) {
                    expect(info.extra).toBe('A');
                }
                if (counter === 2) {
                    expect(info.extra).toBe('B');
                    done();
                }
            });

        const message1 = makeMessage('A', 200);
        const message2 = makeMessage('B', 200);

        const packet1 = message_slice(message1, 0, 150);
        const packet2_a = message_slice(message1, 150);
        const packet2_b = message_slice(message2, 0, 150);
        const packet2 = new DataView(concatArrayBuffers([packet2_a.buffer, packet2_b.buffer]));
        const packet3 = message_slice(message2, 150);

        packet_assembler.feed(packet1);
        packet_assembler.feed(packet2);
        packet_assembler.feed(packet3);

    });

});
