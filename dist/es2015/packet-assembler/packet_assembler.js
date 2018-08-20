"use strict";
/**
 * @module opcua.transport
 */
import { EventEmitter } from 'eventemitter3';
import { assert } from '../assert';
import { concatTypedArrays } from '../basic-types/array';
var doDebug = false;
/***
 * @class PacketAssembler
 * @param options
 * @param options.readMessageFunc {Function} a function to read
 * @param options.minimumSizeInBytes {Integer} the minimum number of bytes that need to be received before the
 *                                             readMessageFunc can be called
 * @constructor
 */
export class PacketAssembler extends EventEmitter {
    constructor(options) {
        super();
        this._stack = [];
        this.expectedLength = 0;
        this.currentLength = 0;
        this.readMessageFunc = options.readMessageFunc;
        this.minimumSizeInBytes = options.minimumSizeInBytes || 8;
        assert('function' === typeof this.readMessageFunc, "packet assembler requires a readMessageFunc");
    }
    ;
    _read_packet_info(data) {
        return this.readMessageFunc(data);
    }
    ;
    _build_data(data) {
        if (data && this._stack.length === 0) {
            return data;
        }
        if (!data && this._stack.length === 1) {
            data = this._stack[0];
            this._stack.length = 0; // empty stack array
            return data;
        }
        this._stack.push(data);
        data = concatTypedArrays(this._stack);
        this._stack.length = 0;
        return data;
    }
    ;
    feed(data) {
        var self = this;
        var messageChunk;
        //xx assert(data instanceof Buffer);
        // xx assert(data.length > 0, "PacketAssembler expects a no-zero size data block");
        //xx assert(this.expectedLength === 0 || this.currentLength <= this.expectedLength);
        if (this.expectedLength === 0 && this.currentLength + data.byteLength >= this.minimumSizeInBytes) {
            // we are at a start of a block and there is enough data provided to read the length  of the block
            // let's build the whole data block with previous blocks already read.
            if (this._stack.length > 0) {
                data = this._build_data(data);
                this.currentLength = 0;
            }
            // we can extract the expected length here
            this.packet_info = this._read_packet_info(data);
            this.expectedLength = this.packet_info.length;
            assert(this.currentLength === 0);
            assert(this.expectedLength > 0);
            // we can now emit an event to signal the start of a new packet
            this.emit("newMessage", this.packet_info, data);
        }
        if (this.expectedLength === 0 || this.currentLength + data.byteLength < this.expectedLength) {
            this._stack.push(data);
            this.currentLength += data.byteLength;
            // expecting more data to complete current message chunk
        }
        else if (this.currentLength + data.byteLength === this.expectedLength) {
            this.currentLength += data.byteLength;
            messageChunk = this._build_data(data);
            // istanbul ignore next
            if (doDebug) {
                var packet_info = this._read_packet_info(messageChunk);
                assert(this.packet_info.length === packet_info.length);
                assert(messageChunk.length === packet_info.length);
            }
            // reset
            this.currentLength = 0;
            this.expectedLength = 0;
            this.emit("message", messageChunk);
        }
        else {
            // there is more data in this chunk than expected...
            // the chunk need to be split
            var size1 = this.expectedLength - this.currentLength;
            if (size1 > 0) {
                var chunk1 = new DataView(data.buffer, 0, size1); //.slice(0, size1);
                self.feed(chunk1);
            }
            var chunk2 = new DataView(data.buffer, size1);
            if (chunk2.byteLength > 0) {
                self.feed(chunk2);
            }
        }
    }
    ;
}
//# sourceMappingURL=packet_assembler.js.map