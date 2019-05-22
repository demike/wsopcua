// tslint:disable:no-console

import { analyseExtensionObject } from '../../../packet-analyzer';
import { DirectTransport } from '../../../transport/test_helpers/direct_transport';
import { AcknowledgeMessage } from '../../../transport/AcknowledgeMessage';
import { CloseSecureChannelResponse } from '../../../generated/CloseSecureChannelResponse';
import { OpenSecureChannelResponse } from '../../../generated/OpenSecureChannelResponse';
import { GetEndpointsResponse } from '../../../generated/GetEndpointsResponse';
import { CreateSessionResponse } from '../../../generated/CreateSessionResponse';
import { ActivateSessionResponse } from '../../../generated/ActivateSessionResponse';
import { EventEmitter } from 'eventemitter3';
import { ChannelSecurityToken } from '../../../wsopcua';
import { EndpointDescription } from '../../../generated';
import { debugLog, hexDump } from '../../../common/debug';
import { assert } from '../../../assert';

export const fakeAcknowledgeMessage = new AcknowledgeMessage({
    maxChunkCount: 600000,
    maxMessageSize: 100000,
    protocolVersion: 0,
    receiveBufferSize: 8192,
    sendBufferSize: 8192,
});

export const fakeCloseSecureChannelResponse = new CloseSecureChannelResponse({});

export const fakeOpenSecureChannelResponse = new OpenSecureChannelResponse({
    serverProtocolVersion: 0,

    securityToken: new ChannelSecurityToken({
        channelId: 23,
        createdAt: new Date(), // now
        revisedLifetime: 30000,
        tokenId: 1,
    }),
    serverNonce: new TextEncoder().encode('qwerty')
});

export const fakeGetEndpointsResponse = new GetEndpointsResponse({
    endpoints: [
        new EndpointDescription({
            endpointUrl: 'fake://localhost:2033/SomeAddress'
        })
    ]
});

export const fakeCreateSessionResponse = new CreateSessionResponse({});
export const fakeActivateSessionResponse = new ActivateSessionResponse({});

export class MockServerTransport extends EventEmitter {

    private _replies: any;
    private _mockTransport: DirectTransport;
    private _counter: number;

    constructor(expectedReplies: any) {

        super();

        this._replies = expectedReplies;
        this._counter = 0;

        this._mockTransport = new DirectTransport();
        this._mockTransport.initialize(() => {
            console.log('initialized');
        });

        this._mockTransport.server.on('data', (data: Uint8Array) => {

            let reply = this._replies[this._counter];
            this._counter++;
            if (reply) {

                if (typeof reply === 'function') {
                    reply = reply.call(this);
                    // console.log(" interpreting reply as a function" + reply);
                    if (!reply) {
                        return;
                    }
                }

                debugLog('\nFAKE SERVER RECEIVED');
                debugLog(hexDump(data));

                let replies = [];
                if (reply instanceof Uint8Array) {
                    replies.push(reply);
                } else {
                    replies = reply;
                }
                assert(replies.length >= 1, ' expecting at least one reply ' + JSON.stringify(reply));
                replies.forEach((reply1: any) => {
                    debugLog('\nFAKE SERVER SEND');
                    debugLog(hexDump(reply1));
                    this._mockTransport.server.write(reply1);
                });

            } else {
                const msg = ' MockServerTransport has no more packets to send to client to' +
                  ' emulate server responses.... ';
                console.log('%c ' + msg, 'color:red;');
                console.log('%c ' + hexDump(data), 'color:blue;');

                // display_trace_from_this_projet_only();
                analyseExtensionObject(data, 0, 0, {});

                this.emit('done');
            }
        });
    }

}
