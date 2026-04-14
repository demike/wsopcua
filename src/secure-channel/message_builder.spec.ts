import { MessageBuilder } from './message_builder';
import { makebuffer_from_trace } from '../test-util/make_buffer_from_trace';

declare global {
  interface Window {
    __FIXTURES__: Object;
  }
}

describe('MessageBuilder', function () {
  let packet_cs_1: Uint8Array;
  let packet_cs_2: Uint8Array;
  beforeEach(async function () {
    packet_cs_1 = await makebuffer_from_trace('/src/test-util/packet_cs_1.fixture');
    packet_cs_2 = await makebuffer_from_trace('/src/test-util/packet_cs_2.fixture');
  });

  it('should raise a error event if a HEL or ACK packet is fed instead of a MSG packet ', async function () {
    const messageBuilder = new MessageBuilder();
    let full_message_body_event_received = false;
    let on_message__received = false;

    await new Promise<void>((resolve) => {
      messageBuilder
        .on('message', function (message) {
          on_message__received = true;
        })
        .on('full_message_body', function (full_message_body) {
          full_message_body_event_received = true;
        })
        .on('error', function (err) {
          expect(err instanceof Error).toBeTruthy();
          expect(on_message__received).toBe(false);
          expect(full_message_body_event_received).toBe(true);
          resolve();
        });

      messageBuilder.feed(new DataView(packet_cs_1.buffer)); // HEL message
    });
  });

  /**
   *  utility test function that verifies that the messageBuilder sends
   *  a error event, without crashing when a bad packet is processed.
   * @param test_case_name
   * @param bad_packet
   * @param done
   */
  function test_behavior_with_bad_packet(
    test_case_name: string,
    bad_packet: DataView,
    done: () => void
  ) {
    const messageBuilder = new MessageBuilder();

    let full_message_body_event_received = false;
    let on_message__received = false;
    let called = false;

    messageBuilder
      .on('message', function (message) {
        on_message__received = true;
      })
      .on('full_message_body', function (full_message_body) {
        full_message_body_event_received = true;
      })
      .on('error', function (err) {
        if (!called) {
          called = true;
          expect(err instanceof Error).toBeTruthy();
          expect(on_message__received).toBe(false);
          expect(full_message_body_event_received).toBe(true);
          done();
        }
      });

    try {
      messageBuilder.feed(bad_packet); // OpenSecureChannel message
    } catch (err) {
      // If feed throws an error synchronously, also call done
      if (!called) {
        called = true;
        done();
      }
    }
  }

  it('should raise an error if the embedded object id is not known', async function () {
    const bad_packet = new DataView(packet_cs_2.buffer);

    // alter the packet id to scrap the message ID
    // this will cause the message builder not to find the embedded object constructor.
    bad_packet.setUint8(80, 255);
    bad_packet.setUint8(81, 255);
    bad_packet.setUint8(82, 255);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Test timed out')), 5000);
      test_behavior_with_bad_packet('bad_object_id_error', bad_packet, () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  });

  it('should raise an error if the embedded object failed to be decoded', async function () {
    const bad_packet = new DataView(packet_cs_2.buffer);

    // alter the packet id  to scrap the inner data
    // this will cause the decode function to fail and raise an exception
    bad_packet.setUint8(0x65, 10);
    bad_packet.setUint8(0x66, 11);
    bad_packet.setUint8(0x67, 255);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Test timed out')), 5000);
      test_behavior_with_bad_packet('corrupted_message_error', bad_packet, () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  });

  it("should emit a 'invalid_sequence_number' event if a message does not have a 1-increased sequence number", async function () {
    const messageBuilder = new MessageBuilder();

    await new Promise<void>((resolve) => {
      messageBuilder
        .on('message', function (message) {})
        .on('error', function (err) {
          console.log(err);

          throw new Error('should not get there');
        })
        .on('invalid_sequence_number', function (expected, found) {
          // xx console.log("expected ",expected);
          // xx console.log("found",found);
          resolve();
        });

      messageBuilder.feed(new DataView(packet_cs_2.buffer));
      messageBuilder.feed(new DataView(packet_cs_2.buffer));
    });
  });
});
