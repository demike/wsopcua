import { HalfComChannel } from './half_com_channel';
import { EventEmitter } from '../../eventemitter';
import { assert } from '../../assert';
import { setFakeTransport } from '../ws_transport';

export class DirectTransport extends EventEmitter<any> {
  public client: HalfComChannel;
  public server: HalfComChannel;
  public url: string;

  private _responses?: any[];
  constructor() {
    super();

    this.client = new HalfComChannel();
    this.server = new HalfComChannel();

    this.client.on('send_data', (data: Uint8Array) => {
      assert(data instanceof Uint8Array);
      this.server.emit('data', data);
    });
    this.server.on('send_data', (data: Uint8Array) => {
      assert(data instanceof Uint8Array);
      this.client.emit('data', data);
    });
    this.server.on('ending', () => {
      this.client.emit('end');
      this.client._hasEnded = true;
    });
    this.client.on('ending', () => {
      this.server.emit('end');
      this.server._hasEnded = true;
    });

    this.server.on('end', (err: Error) => {
      this.emit('end', err);
    });

    this.server.on('data', (data: Uint8Array) => {
      const func = this.popResponse();
      if (func) {
        func(this.server, data);
      }
    });

    this.url = 'fake://localhost:2033/SomeAddress';
  }

  public initialize(done: () => void) {
    setFakeTransport(this.client);
    done();
  }

  public shutdown(done: () => void) {
    this.client.end();
    this.server.end();
    if (done) {
      // window.setImmediate(done);
      window.setTimeout(done, 0);
    }
  }

  public popResponse() {
    if (!this._responses) {
      return null;
    }
    return this._responses.shift();
  }

  public pushResponse(func: any) {
    this._responses = this._responses || [];
    this._responses.push(func);
  }
}
