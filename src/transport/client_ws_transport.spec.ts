'use strict';

import { ClientTCP_transport } from './client_tcp_transport';
import { AcknowledgeMessage } from './AcknowledgeMessage';
import { assert } from '../assert';
import { packTcpMessage } from './tools';
import { TCPErrorMessage } from './TCPErrorMessage';
import { StatusCode } from '../basic-types/status_code';
import { debugLog, hexDump } from '../common/debug';
import { installMockWebSocket, uninstallMockWebSocket, WebSocketMock } from './test_helpers/mock_web_socket';
import { ClientWSTransport } from './client_ws_transport';
import { setFakeTransport, getFakeTransport } from './ws_transport';
import { StatusCodes } from '../constants/raw_status_codes';



describe('testing ClientWS_transport', function () {

    let transport: ClientWSTransport;
    let spyOnClose: jasmine.Spy, spyOnConnect: jasmine.Spy, spyOnConnectionBreak: jasmine.Spy;

    let fakeWS: WebSocketMock;
    const url = 'ws://localhost:3456';

    beforeEach(function (done) {

        transport = new ClientWSTransport();
        installMockWebSocket();
        setFakeTransport(new WebSocket(url));
        fakeWS = getFakeTransport();

        spyOnClose = jasmine.createSpy();
        transport.on('close', spyOnClose);

        spyOnConnect = jasmine.createSpy();
        transport.on('connect', spyOnConnect);

        spyOnConnectionBreak = jasmine.createSpy();
        transport.on('connection_break', spyOnConnectionBreak);

        done();
    });

    afterEach(function (done) {
        uninstallMockWebSocket();
        transport.disconnect(function () {
                done();
        });
    });

    const fakeAcknowledgeMessage = new AcknowledgeMessage({
        protocolVersion: 0,
        receiveBufferSize: 8192,
        sendBufferSize: 8192,
        maxMessageSize: 100000,
        maxChunkCount: 600000
    });

    it('should create and connect to a client TCP', function (done) {

        transport.connect(url, function (err) {

            expect(spyOnConnect.calls.count()).toBe(1);
            expect(spyOnClose.calls.count()).toBe(0);
            expect(spyOnConnectionBreak.calls.count()).toBe(0);

            transport.disconnect(function () {

                expect(spyOnConnect.calls.count() ).toBe(1);
                expect(spyOnClose.calls.count() ).toBe(1);
                expect(spyOnConnectionBreak.calls.count()).toBe(0);
                done();
            });

        });

        const sock: WebSocketMock = (transport as any)._socket;
        sock._open();
        // send Fake ACK response
        sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

    });

    it('should throw an exception when specifying an invalid protocol', function () {
        let exc = null;
     //   expect( () => {
        try {
            transport.connect('invalid://hohoho', function (err) {
            });
        } catch(e) {
            exc = e;
        }
        expect(exc).not.toBeNull();

        try {
            transport.connect('fake://hohoho', function (err) {
            });
        } catch(e) {
            exc = e;
        }
        expect(exc).not.toBeNull();
    });



    it('should report a time out error if trying to connect to a non responding server', function (done) {

        transport.timeout = 10; // very short timeout;

        transport.connect(url, function (err) {

            if (err) {
                expect(err.message).toContain('Timeout');

                expect(spyOnConnect.calls.count()).toBe(0);
                expect(spyOnClose.calls.count()).toBe(0);
                expect(spyOnConnectionBreak.calls.count()).toBe(0);
                done();
            } else {
                throw new Error('Should have raised a timeout error');
                // done();
            }
        });

        (transport as any)._socket._open();
        // DO NOTHING !!

    });

    it('should report an error if the server close the socket unexpectedly after the websocket connection was established', function (done) {


        transport.timeout = 1000; // short timeout;

        transport.connect(url, function (err) {

            if (err) {

                expect(err.message).toMatch(/Connection aborted/);

                expect(spyOnConnect.calls.count() ).toBe(0);
                expect(spyOnClose.calls.count() ).toBe(0);
                expect(spyOnConnectionBreak.calls.count() ).toBe(0);

                done();
            } else {
                throw new Error('Should have raised a connection error');
                // done();
            }
        });

            (transport as any)._socket._open();
            // received Fake HEL Message
            // Pretend the message is malformed or that the server crashed for some reason : abort now !
            (transport as any)._socket._error(1000);

    });

    it('should report an error if the server close the socket unexpectedly', function (done) {


        transport.timeout = 100; // very short timeout;

        transport.connect(url, function (err) {

            if (err) {

                expect(err.message).toContain('failed to connect');

                expect(spyOnConnect.calls.count() ).toBe(0);
                expect(spyOnClose.calls.count() ).toBe(0);
                expect(spyOnConnectionBreak.calls.count() ).toBe(0);

                done();
            } else {
                throw new Error('Should have raised a connection error');
                // done();
            }
        });

             // received Fake HEL Message
            // Pretend the message is malformed or that the server crashed for some reason : abort now !
            (transport as any)._socket._error(1000);

    });

    function makeError(statusCode) {
        assert(statusCode instanceof StatusCode);
        return new TCPErrorMessage({statusCode: statusCode, reason: statusCode.description});
    }

    it('should report an error if the server reports a protocol version mismatch', function (done) {   

        transport.timeout = 1000; // very short timeout;

        transport.connect(url, function (err) {
            if (err) {
                expect(err.message).toMatch(/The applications do not have compatible protocol versions/);

                expect(spyOnConnect.calls.count() ).toBe(0);
                expect(spyOnClose.calls.count() ).toBe(0);
                expect(spyOnConnectionBreak.calls.count() ).toBe(0);

                done();
            } else {
                throw new Error('transport.connect should have raised a connection error');
                // done();
            }
        });

        const sock: WebSocketMock = (transport as any)._socket;
        sock._open();
        // Pretend the protocol version is wrong.
        const errorResponse = makeError(StatusCodes.BadProtocolVersionUnsupported);
        const messageChunk = packTcpMessage('ERR', errorResponse);
        sock._message(messageChunk);

    });


    it('should connect and forward subsequent message chunks after a valid HEL/ACK transaction', function (done) {

        // lets build the subsequent message
        const message1 = new DataView(new ArrayBuffer(10));
        message1.setUint32(0, 0xDEADBEEF, false);
        message1.setUint32(4, 0xFEFEFEFE, false);
        message1.setUint16(8, 0xFFFF, false);

        transport.timeout = 1000; // very short timeout;

        transport.on('message', function (message_chunk: DataView) {
            debugLog(hexDump(message_chunk));
            expect(new DataView(message_chunk.buffer, 8)).toEqual(message1);

            expect(spyOnConnect.calls.count()).toBe(1);
            expect(spyOnClose.calls.count()).toBe(0);
            expect(spyOnConnectionBreak.calls.count() ).toBe(0);

            done();
        });

        transport.connect(url, function (err) {
            if (err) {
                console.log(' err = ', err.message);
            }
            assert(!err);
            const buf = transport.createChunk('MSG', 'F', message1.byteLength);
            (new Uint8Array(buf)).set( new Uint8Array(message1.buffer) , transport.headerSize);
            transport.write(buf);
        });

        const sock: WebSocketMock = (transport as any)._socket;
        sock._open();

        // send Fake ACK response
        sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

        //let's receife a message1
        const buf = transport.createChunk('MSG', 'F', message1.byteLength);
        (new Uint8Array(buf)).set( new Uint8Array(message1.buffer) , transport.headerSize);
        sock._message(buf);

    });

    it('should close the socket and emit a close event when disconnect() is called', function (done) {


        let counter = 1;

        let server_confirms_that_server_socket_has_been_closed = false;
        let transport_confirms_that_close_event_has_been_processed = false;
/*
        const spyOnServerWrite = sinon.spy(function (socket, data) {
            debugLog('\ncounter = ', counter);
            debugLog(hexDump(data));
            if (counter === 1) {
                // HEL/ACK transaction
                const messageChunk = packTcpMessage('ACK', fakeAcknowledgeMessage);
                counter += 1;
                socket.write(messageChunk);
                return;
            }
            assert(false, 'unexpected data received');
        });
        fakeServer.pushResponse(spyOnServerWrite);
        fakeServer.pushResponse(spyOnServerWrite);

        fakeServer.on('end', function () {
            server_confirms_that_server_socket_has_been_closed = true;
        });
*/
        transport.timeout = 1000; // very short timeout;

        transport.on('close', function (err) {
            expect(transport_confirms_that_close_event_has_been_processed).toBe(false, 'close event shall only be received once');
            transport_confirms_that_close_event_has_been_processed = true;
            expect(err).toBe(null, 'close event shall have err===null, when disconnection is initiated by the client itself');
        });

        transport.connect(url, function (err) {
            if (err) {
                console.log(' err = ', err.message);
            }
            assert(!err);
            expect(server_confirms_that_server_socket_has_been_closed).toBe(false);
            expect(transport_confirms_that_close_event_has_been_processed).toBe(false);
            transport.disconnect(function () {

                window.setImmediate(function () {
                    expect(server_confirms_that_server_socket_has_been_closed).toBe(true);
                    expect(transport_confirms_that_close_event_has_been_processed).toBe(true);
                    done();
                });
            });
        });


        const sock: WebSocketMock = (transport as any)._socket;

        sock.addEventListener('close', () => {
            server_confirms_that_server_socket_has_been_closed = true;
        });

        sock._open();

        // send Fake ACK response
        sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

    });


    it('should dispose the socket and emit a close event when socket is closed by the other end', function (done) {

        let counter = 1;

        let server_confirms_that_server_socket_has_been_closed = false;
        let transport_confirms_that_close_event_has_been_processed = false;

/*
        const spyOnServerWrite = sinon.spy(function (socket, data) {

            debugLog('\ncounter = ', counter);
            debugLog(hexDump(data));
            if (counter === 1) {
                // HEL/ACK transaction
                const messageChunk = packTcpMessage('ACK', fakeAcknowledgeMessage);
                counter += 1;
                socket.write(messageChunk);

                setTimeout(function () {
                    debugLog(' Aborting server ');
                    socket.end(); // close after 10 ms
                }, 10);

            } else if (counter === 2) {
                //
            } else {
                assert(false, 'unexpected data received');
            }
        });
        fakeServer.pushResponse(spyOnServerWrite);

        fakeServer.on('end', function () {
            server_confirms_that_server_socket_has_been_closed = true;
        });
*/

        transport.timeout = 1000; // very short timeout;
        transport.on('close', function (err) {


            expect(transport_confirms_that_close_event_has_been_processed ).toBe(false, 'close event shall only be received once');

            transport_confirms_that_close_event_has_been_processed = true;

            expect(err instanceof Error).toBe(true,
                'the close event should pass a valid Error object because disconnection is caused by external event');

            done();

        });

        transport.connect(url, function (err) {
            assert(!err);
        });

        const sock: WebSocketMock = (transport as any)._socket;

        sock.addEventListener('close', () => {
            server_confirms_that_server_socket_has_been_closed = true;
        });

        sock._open();

        // send Fake ACK response
        sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

        //server closing
        sock._error();

    })
/*

    it('should returns an error if url has invalid port', function (done) {

        transport.connect('ws://localhost:XXXXX/SomeAddress', function (err) {
            if (err) {
                console.log(err);
                const regexp_1 = /EADDRNOTAVAIL|ECONNREFUSED/; // node v0.10
                const regexp_2 = /port(" option)* should be/; // node >v0.10 < 9.000
                const regexp_3 = /Port should be > 0 and < 65536. Received NaN/; // node >= 9.00
                const regexp_4 = /ERR_SOCKET_BAD_PORT|Port should be >= 0 and < 65536. Received NaN./; // node > 10.20
                const test1 = !!err.message.match(regexp_1);
                const test2 = !!err.message.match(regexp_2);
                const test3 = !!err.message.match(regexp_3);
                const test4 = !!err.message.match(regexp_4);
                expect(test1 || test2 || test3 || test4 ).toBe(true, 'expecting one of those error message. got: ' + err.message);
                done();
            } else {
                throw new Error('Should have raised a connection error');
                // done();
            }
        });
    });
*/

});

