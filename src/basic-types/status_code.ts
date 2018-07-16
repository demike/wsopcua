"use strict";
/**
 * @module opcua.datamodel
 */
import * as _ from 'underscore';
import {assert} from '../assert';
import {StatusCodes} from '../constants';
import { DataStream } from './DataStream';

var extraStatusCodeBits = {

// StatusCode Special bits
//
// StructureChanged 15:15  Indicates that the structure of the associated data value has changed since the last
//                         Notification. Clients should not process the data value unless they re-read the metadata.
//                         Servers shall set this bit if the DataTypeEncoding used for a Variable changes.
//                         7.24 describes how the DataTypeEncoding is specified for a Variable.Servers shall also
//                         set this bit if the EnumStrings Property of the DataType of the Variable changes.
//                         This bit is provided to warn Clients that parse complex data values that their parsing
//                         routines could fail because the serialized form of the data value has changed.
//                         This bit has meaning only for StatusCodes returned as part of a data change Notification
//                         or the HistoryRead. StatusCodes used in other contexts shall always set this bit to zero.
//
StructureChanged: (0x1 << 15),

// SemanticsChanged 14:14  Semantics of the associated data value have changed. Clients should not process the data
//                         value until they re-read the metadata associated with the Variable. Servers should set
//                         this bit if the metadata has changed in way that could cause application errors if the
//                         Client does not re-read the metadata. For example, a change to the engineering units
//                         could create problems if the Client uses the value to perform calculations.
//                         Part 8 defines the conditions where a Server shall set this bit for a DA Variable.
//                         Other specifications may define additional conditions. A Server may define other
//                         conditions that cause this bit to be set.
//                         This bit has meaning only for StatusCodes returned as part of a data change Notification
//                         or the HistoryRead. StatusCodes used in other contexts shall always set this bit to zero.
SemanticChanged: (0x1<<14),

// Reserved         12:13  Reserved for future use. Shall always be zero.

// InfoType         10:11  The type of information contained in the info bits. These bits have the following meanings:
//                         NotUsed    00  The info bits are not used and shall be set to zero.
//                         DataValue  01  The StatusCode and its info bits are associated with a data value
//                                        returned from the Server. This flag is only used in combination with
//                                        StatusCodes defined in Part 8.
//                         Reserved   1X  Reserved for future use. The info bits shall be ignored.
//
InfoTypeDataValue:  (0x1 << 10), // 0x0400,

// InfoBits         0:9    Additional information bits that qualify the StatusCode.
//                         The structure of these bits depends on the Info Type field.
//
// LimitBits        8:9    The limit bits associated with the data value. The limits bits have the
//                         following meanings:
//                         Limit     Bits   Description
//                         None      00     The value is free to change.
//                         Low       01     The value is at the lower limit for the data source.
//                         High      10     The value is at the higher limit for the data source.
//                         Constant  11     The value is constant and cannot change.
LimitLow:           (0x1 << 8),
LimitHigh:          (0x2 << 8),
LimitConstant:      (0x3 << 8),

// Overflow         7:7    This bit shall only be set if the MonitoredItem queue size is greater than 1.
//                         If this bit is set, not every detected change has been returned since the Server’s
//                         queue buffer for the MonitoredItem reached its limit and had to purge out data.
Overflow:           (0x1 << 7), // 1 << 7


// Reserved         5:6    Reserved for future use. Shall always be zero.

// HistorianBits    0:4    These bits are set only when reading historical data. They indicate where the data value
//                         came from and provide information that affects how the Client uses the data value.
//                         The historian bits have the following meaning:
//                         Raw            XXX00      A raw data value.
//                         Calculated     XXX01      A data value which was calculated.
//                         Interpolated   XXX10      A data value which was interpolated.
//                         Reserved       XXX11      Undefined.
//                         Partial        XX1XX      A data value which was calculated with an incomplete interval.
//                         Extra Data     X1XXX      A raw data value that hides other data at the same timestamp.
//                         Multi Value    1XXXX      Multiple values match the Aggregate criteria (i.e. multiple
//                                                   minimum values at different timestamps within the same interval).
//                         Part 11 describes how these bits are used in more detail.
HistorianCalculated:   0x1 << 0,
HistorianInterpolated: 0x2 << 0,

HistorianPartial:      0x1 << 2,
HistorianExtraData:    0x1 << 3,
HistorianMultiValue:   0x1 << 4,

};



// Release 1.03 144 OPC Unified Architecture, Part 4





StatusCodes['Bad'] = {
    name: "Bad",
    value: 0x80000000,
    description: "The value is bad but no specific reason is known."
};

StatusCodes['Uncertain'] = {
    name: "Uncertain",
    value: 0x40000000,
    description: "The value is uncertain but no specific reason is known."
};



interface IStatusCodeOptions {
    value : number;
    description : string;
    name : string;
}

/**
 * a particular StatusCode , with it's value , name and description
 *
 * @class  StatusCode
 * @param options
 * @param options.value
 * @param options.description
 * @param options.name
 *
 * @constructor
 */
export class StatusCode {
    private _value: number;
    public get value(): number {
        return this._value;
    }
    private _description: string;
    public get description(): string {
        return this._description;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
constructor(options : IStatusCodeOptions) {
    this._value = options.value;
    this._description = options.description;
    this._name = options.name;
    //xx this.highword =  this.value ? 0x8000 + this.value : 0 ;
}

/**
 *
 * @method toString
 * @return {string}
 */
public toString() : string {
    return this.name + " (0x" + ("0000" + this.value.toString(16)).substr(-8) + ")";
};

public checkBit(mask) : boolean {
    return (this.value  & mask  ) === mask ;
};

get hasOverflowBit() {
    return this.checkBit(extraStatusCodeBits.Overflow);
};
get hasSemanticChangedBit() {
    return this.checkBit(extraStatusCodeBits.SemanticChanged);
};
get hasStructureChangedBit() {
    return this.checkBit(extraStatusCodeBits.StructureChanged);
};

public valueOf() : number {
    return this.value;
};
}

class ConstantStatusCode extends StatusCode {
    constructor(options) {
        super(options);
    }
}


export var encodeStatusCode = function (statusCode, stream : DataStream) {
    assert(statusCode instanceof StatusCode || statusCode instanceof ConstantStatusCode);
    stream.setUint32(statusCode.value);
};

function b(c) {
    var tmp ="0000000000000000000000"+(c >>>0).toString(2);
    return tmp.substr(-32);
}
export var decodeStatusCode = function (stream : DataStream) {
    var code = stream.getUint32();

    var code_without_info_bits = (code &  0xFFFF0000)>>>0;
    var info_bits = code & 0x0000FFFF;
    //xx console.log(b(mask));
    //xx console.log(b(~mask));
    //xx console.log(b(code));
    //xx console.log(b(code_without_info_bits));
    var sc = StatusCodes_reverse_map[code_without_info_bits];
    if(!sc) {
        sc = StatusCodes['Bad'];
        console.warn("expecting a known StatusCode but got 0x"+ code_without_info_bits.toString(16));
    }
    if (info_bits) {
        var tmp = new ModifiableStatusCode({_base: sc});
        tmp.set(info_bits);
        sc =tmp;
    }
    return sc;
};

/* construct status codes fast search indexes */
var StatusCodes_reverse_map = {};
_.forEach(StatusCodes, function (code) {
    let csc = new ConstantStatusCode(code);
    StatusCodes_reverse_map[csc.value] = csc;
    StatusCodes[csc.name] = csc;
});

/**
 * @module StatusCodes
 * @type {exports.StatusCodes|*}
 */
export {StatusCodes} from '../constants';

class ModifiableStatusCode extends StatusCode {

    private _base : StatusCode;
    private _extraBits : number;
constructor(options) {
    super(options);
    this._base = options._base;
    this._extraBits = 0;
    if (this._base instanceof ModifiableStatusCode) {
        this._extraBits = this._base._extraBits;
        this._base = this._base._base;
    }
}

_getExtraName() : string {

    var self = this;
    var str = [];
    _.forEach(extraStatusCodeBits,function(value,key){
        if ((self._extraBits & value ) === value) {
            str.push(key);
        }
    });
    if (str.length === 0) {
        return "";
    }
    return "#" + str.join("|");
};

get value() : number {
    return this._base.value + this._extraBits;
};

get name() : string {
    return this._base.name + this._getExtraName();
};
get description() : string {
    return this._base.description;
};


valueOf() : number {
    return this._base.value;
};

set(bit) {

    if (typeof bit === "string") {
        var bitsarray = bit.split(" | ");
        if (bitsarray.length > 1) {
            for (var i = 0; i < bitsarray.length; i++) {
                this.set(bitsarray[i]);
            }
            return;
        }
        var tmp = extraStatusCodeBits[bit];
        if (!tmp) {
            throw new Error("Invalid StatusCode Bit "+ bit);
        }
        bit = tmp;
    }
    this._extraBits = this._extraBits | bit;
};

unset(bit) {

    if (typeof bit === "string") {

        var bitsarray = bit.split(" | ");
        if (bitsarray.length > 1) {
            for (var i = 0; i < bitsarray.length; i++) {

                console.log(" Unset",this._extraBits.toString(16));
                this.unset(bitsarray[i]);
                console.log(" Unset",this._extraBits.toString(16));
            }
            return;
        }
        var tmp = extraStatusCodeBits[bit];
        if (!tmp) {
            throw new Error("Invalid StatusCode Bit "+ bit);
        }
        bit = tmp;
    }
    this._extraBits = this._extraBits & (~bit >>> 0) ;

};
}

// return a status code that can be modified
StatusCodes['makeStatusCode'] = function(statusCode,optionalBits) {
    var tmp = new ModifiableStatusCode({
        _base: statusCode
    });
    if (optionalBits) {
        tmp.set(optionalBits);
    }
    return tmp;
};


StatusCodes['GoodWithOverflowBit'] = (<any>StatusCodes).makeStatusCode(StatusCodes.Good,"Overflow | InfoTypeDataValue");

export function coerceStatusCode(statusCode) {
    if (statusCode instanceof StatusCode) {
        return statusCode;
    }
    assert(statusCode.hasOwnProperty("name"));
    return StatusCodes[statusCode.name];
}

