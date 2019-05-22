import { EventEmitter } from 'eventemitter3';
import { assert } from '../../assert';

// tslint:disable:no-empty
// tslint:disable:unused-variable

export class HalfComChannel extends EventEmitter {
    public _hasEnded: boolean;
    protected _te: TextEncoder;

    constructor() {
        super();
        this._te = new TextEncoder();
        this._hasEnded = false;
    }

    public write(data: string | Uint8Array) {

        if (typeof data === 'string') {
            data = this._te.encode(data);
        }
        assert(data instanceof Uint8Array, 'HalfComChannel.write expecting a buffer');
        const copy = new Uint8Array(data.buffer.slice(0));
        this.emit('send_data', copy);
    }

    public end() {
        if (!this._hasEnded) {
            assert(!this._hasEnded, 'half communication channel has already ended !');
            this._hasEnded = true;
            this.emit('ending');
            this.emit('end');
        }
    }

    public destroy() {
    }

    public setTimeout() {
    }
}
