/* tslint:disable:no-bitwise */
'use strict';
/**
 * @module opcua.datamodel
 */
import {assert} from '../assert';

export const ExtraStatusCodeBits = Object.freeze({

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
// tslint:disable-next-line:no-bitwise
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
SemanticChanged: (0x1 << 14),

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

});


/**
 * a particular StatusCode , with it's value , name and description
 */

export abstract class StatusCode {

    /**
     * returns status code value in numerical form, including extra bits
     */
    public abstract get value(): number;

    /***
     * status code by name, (including  extra bits in textual forms)
     */
    public abstract get name(): string;

    /**
     * return the long description of the status code
     */
    public abstract get description(): string;

    public get valueOf(): number {
        return this.value;
    }

    public toString(): string {
        return this.name + ' (0x' + ('0000' + this.value.toString(16)).substr(-8) + ')';
    }

    public checkBit(mask: number): boolean {
        return (this.value & mask) === mask;
    }

    /**
     * checks if any of the mask's bits is present in the value
     * @param mask the bit mask
     */
    public checkAnyBit(mask: number): boolean {
        return (this.value & mask) !== 0;
    }

    /**returns true if the overflow bit is set */
    public get hasOverflowBit(): boolean {
        return this.checkBit(ExtraStatusCodeBits.Overflow);
    }

    /**returns true if the semanticChange bit is set */
    public get hasSemanticChangedBit(): boolean {
        return this.checkBit(ExtraStatusCodeBits.SemanticChanged);
    }

    /**returns true if the structureChange bit is set */
    public get hasStructureChangedBit(): boolean {
        return this.checkBit(ExtraStatusCodeBits.StructureChanged);
    }

    public isNot(other: StatusCode): boolean {
        assert(other instanceof StatusCode);
        return this.value !== other.value;
    }

    public equals(other: StatusCode): boolean {
        assert(other instanceof StatusCode);
        return this.value === other.value;
    }

    public toJSON(): any {
        return { value: this.value };
    }

    public toJSONFull(): any {
        return { value: this.value, name: this.name, description: this.description };
    }
}


export class ConstantStatusCode extends StatusCode {

    private readonly _value: number;
    private readonly _description: string;
    private readonly _name: string;

    /**
     * @param options
     * @param options
     * @param options.value
     * @param options.description
     * @param options.name
     *
     */
    constructor(options: { value: number, description: string, name: string }) {
        super();
        this._value = options.value;
        this._description = options.description;
        this._name = options.name;
    }

    public get value(): number {
        return this._value;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

}

export class ModifiableStatusCode extends StatusCode {

    private readonly _base: StatusCode;
    private _extraBits: number;

    constructor(options: { base: StatusCode, extraBits?: number  }) {
        super();
        this._base = options.base;
        this._extraBits = 0;
        if (this._base instanceof ModifiableStatusCode) {
            this._extraBits = this._base._extraBits;
            this._base = this._base._base;
        }

        if (options.extraBits) {
            this._extraBits = this._extraBits | options.extraBits;
        }
    }

    public get value() {
        return this._base.value + this._extraBits;
    }

    public get name() {
        return this._base.name + this._getExtraName();
    }

    public get description() {
        return this._base.description;
    }

    public set(bit: string | number): void {

        if (typeof bit === 'string') {
            const bitsArray = bit.split(' | ');
            if (bitsArray.length > 1) {
                for (const bitArray of bitsArray) {
                    this.set(bitArray);
                }
                return;
            }
            const tmp = ExtraStatusCodeBits[bit as string];

            /* istanbul ignore next */
            if (!tmp) {
                throw new Error('Invalid StatusCode Bit ' + bit);
            }
            bit = tmp;
        }
        this._extraBits = this._extraBits | (bit as number);
    }

    public unset(bit: string | number): void {

        if (typeof bit === 'string') {

            const bitsArray = bit.split(' | ');
            if (bitsArray.length > 1) {
                for (const bitArray of bitsArray) {
                    this.unset(bitArray);
                }
                return;
            }
            const tmp = ExtraStatusCodeBits[bit];

            /* istanbul ignore next */
            if (!tmp) {
                throw new Error('Invalid StatusCode Bit ' + bit);
            }
            bit = tmp;
        }
        this._extraBits = this._extraBits & (~bit >>> 0);

    }

    private _getExtraName() {
        const str = [];
        // tslint:disable-next-line:forin
        for (const key in ExtraStatusCodeBits) {
            const value = ExtraStatusCodeBits[key];
            if ((this._extraBits & value ) === value) {
                str.push(key);
            }
        }
        if (str.length === 0) {
            return '';
        }
        return '#' + str.join('|');
    }
}
