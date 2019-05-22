import { assert } from '../assert';
import { DirectTransport } from './test_helpers/direct_transport';
import { buf2string } from '../crypto';




function installTestFor(Transport: new () => DirectTransport) {

    describe('Testing behavior of  ' + Transport.name + '  to emulate client/server communication in tests', function () {

        let transport: DirectTransport = null;

        beforeEach(function (done) {
            transport = new Transport();
            transport.initialize(() => {
                assert(transport.client);
                assert(transport.server);
                done();
            });

        });
        afterEach(function (done) {
            transport.shutdown(done);
            transport = null;
        });

        it('server side should receive data send by the client only', function (done) {

            transport.client.on('data', function (data) {
                expect(buf2string(data)).toBe('Some Data');
                done();
            });
            transport.server.write('Some Data');
        });

        it('client side should receive data send by the server only', function (done) {
            transport.server.on('data', function (data) {
                expect(buf2string(data)).toBe('Some Data');
                done();
            });
            transport.client.write('Some Data');
        });


        it('server side should receive \'end\' event when connection ends  on the client side', function (done) {

            transport.server.on('end', function (err) {
                expect(err).toBe(undefined);
                done();
            });
            transport.client.end();

        });
        it('client side should receive \'end\' event when connection ends  on the server side', function (done) {

            transport.client.on('end', function (err) {
                expect(err).toBe(undefined);
                done();
            });
            transport.server.end();

        });

        it('client side should receive \'end\' event when connection ends  on the client side', function (done) {

            transport.client.on('end', function (err) {
                expect(err).toBe(undefined);
                done();
            });
            transport.client.end();

        });

        it('server side should receive \'end\' event when connection ends  on the server side', function (done) {

            transport.server.on('end', function (err) {
                expect(err).toBe(undefined);
                done();
            });
            transport.server.end();
        });
    });
}

// installTestFor(SocketTransport);
installTestFor(DirectTransport);
