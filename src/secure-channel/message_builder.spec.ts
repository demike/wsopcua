import { MessageBuilder } from './message_builder';
import { makebuffer_from_trace } from '../test-util/make_buffer_from_trace';


declare global {
    interface Window { __FIXTURES__: Object; }
}

describe('MessageBuilder', function () {

    let packet_cs_1: Uint8Array;
    let packet_cs_2: Uint8Array;
    beforeEach( function(done) {
        const base = 'base/src/test-util/';
        let p_packet_cs_1 =  makebuffer_from_trace(base + 'packet_cs_1.fixture');
        let p_packet_cs_2 =  makebuffer_from_trace(base + 'packet_cs_2.fixture');
        Promise.all([p_packet_cs_1,p_packet_cs_2]).then( ([v1, v2]) => {
            packet_cs_1 = v1;
            packet_cs_2 = v2;
            done();
        });
        
    });

    it('should raise a error event if a HEL or ACK packet is fed instead of a MSG packet ', function (done) {

        const messageBuilder = new MessageBuilder();
        let full_message_body_event_received = false;
        let on_message__received = false;

        messageBuilder.
            on('message', function (message) {
                on_message__received = true;

            }).
            on('full_message_body', function (full_message_body) {
                full_message_body_event_received = true;

            }).
            on('error', function (err) {
                expect(err instanceof Error).toBeTruthy();
                expect(on_message__received).toBe(false);
                expect(full_message_body_event_received).toBe(true);
                done();

            });

        messageBuilder.feed(new DataView(packet_cs_1.buffer)); // HEL message
    });


    /**
     *  utility test function that verifies that the messageBuilder sends
     *  a error event, without crashing when a bad packet is processed.
     * @param test_case_name
     * @param bad_packet
     * @param done
     */
    function test_behavior_with_bad_packet(test_case_name, bad_packet: DataView, done) {

        // xx redirectToFile("MessageBuilder_" + test_case_name + ".log", function () {

            const messageBuilder = new MessageBuilder();

            let full_message_body_event_received = false;
            let on_message__received = false;

            messageBuilder.
                on('message', function (message) {
                    on_message__received = true;

                }).
                on('full_message_body', function (full_message_body) {
                    full_message_body_event_received = true;

                }).
                on('error', function (err) {
                    expect(err instanceof Error).toBeTruthy();
                    expect(on_message__received).toBe(false);
                    expect(full_message_body_event_received).toBe(true);
                    done();
                });


            messageBuilder.feed(bad_packet); // OpenSecureChannel message
        // }, function () {});

    }

    it('should raise an error if the embedded object id is not known', function (done) {

        const bad_packet = new DataView(packet_cs_2.buffer);

        // alter the packet id to scrap the message ID
        // this will cause the message builder not to find the embedded object constructor.
        bad_packet.setUint8(80, 255);
        bad_packet.setUint8(81, 255);
        bad_packet.setUint8(82, 255);

        test_behavior_with_bad_packet('bad_object_id_error', bad_packet, done);

    });

    it('should raise an error if the embedded object failed to be decoded', function (done) {
        
        const bad_packet = new DataView(packet_cs_2.buffer);

        // alter the packet id  to scrap the inner data
        // this will cause the decode function to fail and raise an exception
        bad_packet.setUint8(0x65, 10);
        bad_packet.setUint8(0x66, 11);
        bad_packet.setUint8(0x67, 255);

        test_behavior_with_bad_packet('corrupted_message_error', bad_packet, done);
    });


    it('should emit a \'invalid_sequence_number\' event if a message does not have a 1-increased sequence number', function (done) {

        const messageBuilder = new MessageBuilder();

        messageBuilder.
            on('message', function (message) {
            }).
            on('error', function (err) {
                console.log(err);

                throw new Error('should not get there');
            }).
            on('invalid_sequence_number', function (expected, found) {
                // xx console.log("expected ",expected);
                // xx console.log("found",found);
                done();
            });


        messageBuilder.feed(new DataView(packet_cs_2.buffer));
        messageBuilder.feed(new DataView(packet_cs_2.buffer));


    });

});
