'use strict';
import {OPCUAClient} from '../opcua_client';
import { ClientSecureChannelLayer } from '../../secure-channel/client_secure_channel_layer';
import { timeout } from 'async';



describe('OPCUA Client', function() {

    it('it should create a client', function () {

        const client = new OPCUAClient({});
        expect(client).toBeDefined();

    });
    it('should create a ClientSecureChannerLayer', function () {

        const secLayer = new ClientSecureChannelLayer({});
        expect(secLayer).toBeDefined();
    });

    describe('issue 696: https://github.com/node-opcua/node-opcua/issues/696', function() {
        let setIntervalCalls = 0;
        const realSetInterval = window.setInterval;
        let clearIntervalCalls = 0;
        const realClearInterval = window.clearInterval;

        beforeEach(() => {
            window.setInterval = (...args) => {
                setIntervalCalls++;
                return (<any>realSetInterval)(...args);
            };
            window.clearInterval = (...args) => {
                clearIntervalCalls++;
                return realClearInterval(...args);
            };
        });
        afterEach(() => {
            window.setInterval = realSetInterval;
            window.clearInterval = realClearInterval;
        });
        it('should not leak interval if connection failed', async () => {

            async function test() {
                try {
                    const client = new OPCUAClient({ connectionStrategy: { maxRetry: 0 } });
                    await client.connectP('invalid-proto://test-host');
                } catch (err) {
                    console.log(err.message);
                    throw err;
                }
            }
            await expectAsync(test()).toBeRejected(); //With(/The connection has been rejected/);
            console.log(`setIntervalCalls ${setIntervalCalls} vs. clearIntervalCalls ${clearIntervalCalls}`);

            expect(setIntervalCalls).toEqual(clearIntervalCalls);
        });
    });

});


