import { assert } from '../assert';
import { DirectTransport } from './test_helpers/direct_transport';
import { buf2string } from '../crypto';

function installTestFor(Transport: new () => DirectTransport) {
  describe(
    'Testing behavior of  ' + Transport.name + '  to emulate client/server communication in tests',
    function () {
      let transport: DirectTransport;

      beforeEach(async function () {
        transport = new Transport();
        await new Promise<void>((resolve) => {
          transport.initialize(() => {
            assert(transport.client);
            assert(transport.server);
            resolve();
          });
        });
      });
      afterEach(async function () {
        await new Promise<void>((resolve) => {
          transport.shutdown(resolve);
        });
      });

      it('server side should receive data send by the client only', async function () {
        await new Promise<void>((resolve) => {
          transport.client.on('data', function (data: ArrayBuffer) {
            expect(buf2string(data)).toBe('Some Data');
            resolve();
          });
          transport.server.write('Some Data');
        });
      });

      it('client side should receive data send by the server only', async function () {
        await new Promise<void>((resolve) => {
          transport.server.on('data', function (data: ArrayBuffer) {
            expect(buf2string(data)).toBe('Some Data');
            resolve();
          });
          transport.client.write('Some Data');
        });
      });

      it("server side should receive 'end' event when connection ends  on the client side", async function () {
        await new Promise<void>((resolve) => {
          transport.server.on('end', function (err?: Error) {
            expect(err).toBe(undefined);
            resolve();
          });
          transport.client.end();
        });
      });
      it("client side should receive 'end' event when connection ends  on the server side", async function () {
        await new Promise<void>((resolve) => {
          transport.client.on('end', function (err?: Error) {
            expect(err).toBe(undefined);
            resolve();
          });
          transport.server.end();
        });
      });

      it("client side should receive 'end' event when connection ends  on the client side", async function () {
        await new Promise<void>((resolve) => {
          transport.client.on('end', function (err?: Error) {
            expect(err).toBe(undefined);
            resolve();
          });
          transport.client.end();
        });
      });

      it("server side should receive 'end' event when connection ends  on the server side", async function () {
        await new Promise<void>((resolve) => {
          transport.server.on('end', function (err?: Error) {
            expect(err).toBe(undefined);
            resolve();
          });
          transport.server.end();
        });
      });
    }
  );
}

// installTestFor(SocketTransport);
installTestFor(DirectTransport);
