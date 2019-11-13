import { encodeStatusCode, StatusCode, decodeStatusCode, getStatusCodeFromCode,
    coerceStatusCode, makeStatusCode, ModifiableStatusCode } from '.';
import { DataStream } from './DataStream';
import { StatusCodes } from '../constants';




describe('testing status code manipulation', function () {

    it('should create BadNodeIdExists', function () {

        expect(StatusCodes.BadNodeIdExists.value).toBe(0x805e0000);
        expect(StatusCodes.BadNodeIdExists.name).toBe('BadNodeIdExists');

    });

    it('should create BadAttributeIdInvalid', function () {
        expect(StatusCodes.BadAttributeIdInvalid.value).toBe(0x80350000);
        expect(StatusCodes.BadAttributeIdInvalid.name).toBe('BadAttributeIdInvalid');
    });


    it('should create GoodWithOverflowBit', function () {
        expect(StatusCodes.GoodWithOverflowBit.value).toBe(0x480);
        expect(StatusCodes.GoodWithOverflowBit.name).toBe('Good#InfoTypeDataValue|Overflow');
    });


    it('should encode and decode a status code', function () {

        const stream = new DataStream(8);
        const statusCode = StatusCodes.BadNodeIdExists;
        encodeStatusCode(statusCode as StatusCode, stream);
        stream.rewind();
        const statusCode2 = decodeStatusCode(stream);
        expect(statusCode2).toEqual(statusCode);

        expect(statusCode2.description).toEqual('The requested node id is already used by another node.');

        expect(statusCode2.toJSON()).toEqual({ value: 2153644032 });

    });

    it('statusCode should implement a special toString', function () {

        expect(StatusCodes.BadAttributeIdInvalid instanceof StatusCode).toBeTruthy();
        expect(StatusCodes.BadAttributeIdInvalid.toString()).toBe('BadAttributeIdInvalid (0x80350000)');
    });

    it('should create Uncertain_InitialValue', function () {

        expect(StatusCodes.UncertainInitialValue.value.toString(16)).toBe('40920000');
        expect(StatusCodes.UncertainInitialValue.name).toBe('UncertainInitialValue');

    });

    it('GoodWithOverflowBit', function() {
        const statusCode2 =  makeStatusCode(StatusCodes.Good, 'Overflow | InfoTypeDataValue');
        expect(statusCode2).toEqual(StatusCodes.GoodWithOverflowBit);
    });

    it('should be possible to set SemanticChanged bit on a status code', function() {

        const statusCode2 =  <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode2.set('SemanticChanged');
        expect(statusCode2.value).toBe(StatusCodes.BadNodeIdExists.value + 0x4000);
        expect(statusCode2.name).toBe('BadNodeIdExists#SemanticChanged');

    });
    it('should be possible to set the Overflow bit on a status code', function() {

        const statusCode2 =  <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode2.set('Overflow');
        expect(statusCode2.value).toBe(StatusCodes.BadNodeIdExists.value + 0x80);
        expect(statusCode2.name).toBe('BadNodeIdExists#Overflow');

    });
    it('should be possible to set the Overflow and SemanticChanged bits on a status code', function() {

        const statusCode = <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode.set('Overflow | SemanticChanged');


        expect(statusCode.value).toBe(StatusCodes.BadNodeIdExists.value + 0x80 + 0x4000);
        expect(statusCode.name).toBe('BadNodeIdExists#SemanticChanged|Overflow');

        expect(statusCode.toString()).toBe('BadNodeIdExists#SemanticChanged|Overflow (0x805e4080)');
    });


    it('should be possible to encode and decode a statusCode that have a extra information bit', function() {

        const statusCode = <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode.set('Overflow | SemanticChanged');

        const stream = new DataStream(8);
        encodeStatusCode(statusCode, stream);
        stream.rewind();
        const statusCode2 = decodeStatusCode(stream);
        expect(statusCode2).toEqual(statusCode);

        expect(statusCode2.hasOverflowBit).toBe(true);
        expect(statusCode2.hasSemanticChangedBit).toBe(true);
        expect(statusCode2.hasStructureChangedBit).toBe(false);
        expect(statusCode2 instanceof StatusCode).toBeTruthy();

    });

    it('should fail to set a extra information bit on a standard StatusCode', () => {
        expect(() => {
            const statusCode: any = StatusCodes.Good;
            statusCode.set('Overflow'); // << set is not defined !!!
        }).toThrow();
    });

    it('should convert ', () => {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, 'HistorianInterpolated');
        const check = getStatusCodeFromCode(statusCode.value);

        expect(statusCode).toEqual(check);
    });

    it('should coerce a number to a status code', () => {
        expect(coerceStatusCode(0)).toEqual(StatusCodes.Good);
        expect(coerceStatusCode(StatusCodes.BadAggregateConfigurationRejected.value))
            .toEqual(StatusCodes.BadAggregateConfigurationRejected);
    });

    it('should coerce a string to a status code', () => {
        expect(coerceStatusCode('BadNotWritable')).toEqual(StatusCodes.BadNotWritable);
    });

    it('should coerce a status code', () => {
        expect(coerceStatusCode(StatusCodes.BadAggregateConfigurationRejected)).toEqual(StatusCodes.BadAggregateConfigurationRejected);
    });
    it('should coerce a {value} code', () => {
        expect(coerceStatusCode({ value: 2153644032 })).toEqual(StatusCodes.BadNodeIdExists);
    });

    it('toJSON full', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected.toJSONFull()).toEqual({
            description: 'The aggregate configuration is not valid for specified node.',
            name: 'BadAggregateConfigurationRejected',
            value: 2161770496
        });
    });

    it('hasOverflowBit', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected.hasOverflowBit).toEqual(false);
    });
    it('hasSemanticChangedBit', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected.hasSemanticChangedBit).toEqual(false);
    });
    it('hasStructureChangedBit', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected.hasStructureChangedBit).toEqual(false);
    });

    it('equals', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected
            .equals(StatusCodes.BadAggregateConfigurationRejected)).toEqual(true);
    });

    it('equals', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected
            .equals(StatusCodes.BadNoData)).toEqual(false);
    });

    it('isNot', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected
            .isNot(StatusCodes.BadAggregateConfigurationRejected)).toEqual(false);
    });

    it('isNot', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected
            .isNot(StatusCodes.BadNoData)).toEqual(true);
    });

    it('valueOf', () => {
        expect(StatusCodes.BadAggregateConfigurationRejected.valueOf).toEqual(2161770496);

    });
});

describe('ModifiableStatusCode', () => {

    it('should be possible to create a modifiable StatusCode from a ModifiableStatusCode', function() {

        const statusCode = <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode.set('Overflow');
        expect(statusCode.hasOverflowBit).toBe(true);
        expect(statusCode.hasSemanticChangedBit).toBe(false);

        const statusCode2 = <ModifiableStatusCode>makeStatusCode(statusCode);
        expect(statusCode2.hasOverflowBit).toBe(true);
        expect(statusCode2.hasSemanticChangedBit).toBe(false);
        statusCode2.set('SemanticChanged');
        expect(statusCode2.hasOverflowBit).toBe(true);
        expect(statusCode2.hasSemanticChangedBit).toBe(true);

        expect(statusCode.hasOverflowBit).toBe(true);
        expect(statusCode.hasSemanticChangedBit).toBe(false);

    });

    it('should unset a flag by name', () => {

        const statusCode = <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);

        statusCode.set('Overflow');
        expect(statusCode.hasOverflowBit).toEqual(true);
        expect(statusCode.hasSemanticChangedBit).toEqual(false);

        statusCode.unset('Overflow');
        expect(statusCode.hasOverflowBit).toEqual(false);

    });

    it('should set multiple flag by name', () => {

        const statusCode = <ModifiableStatusCode>makeStatusCode(StatusCodes.BadNodeIdExists);

        statusCode.set('Overflow | SemanticChanged');
        expect(statusCode.hasOverflowBit).toEqual(true);
        expect(statusCode.hasSemanticChangedBit).toEqual(true);

        statusCode.unset('Overflow');
        expect(statusCode.hasOverflowBit).toEqual(false);
        expect(statusCode.hasSemanticChangedBit).toEqual(true);

        statusCode.set('Overflow | SemanticChanged');
        statusCode.unset('Overflow | SemanticChanged');
        expect(statusCode.hasOverflowBit).toEqual(false);
        expect(statusCode.hasSemanticChangedBit).toEqual(false);

    });
    it('test with extra bits 1', () => {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, 'HistorianCalculated');
        expect(statusCode.toString()).toEqual('UncertainDataSubNormal#HistorianCalculated (0x40a40001)');
    });
    it('test with extra bits 2', () => {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, 'HistorianInterpolated');
        expect(statusCode.toString()).toEqual('UncertainDataSubNormal#HistorianInterpolated (0x40a40002)');
    });
    it('test with extra bits 3', () => {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, 'HistorianCalculated');
        const statusCode2 = makeStatusCode(statusCode, 'HistorianInterpolated');
        expect(statusCode2.toString()).toEqual('UncertainDataSubNormal#HistorianCalculated|HistorianInterpolated (0x40a40003)');
    });
    it('test with extra bits 4', () => {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, 'HistorianCalculated');
        const mask = 0x0000FFFFFF;
        const extraBits = statusCode.value & mask;
        const statusCode2 = makeStatusCode(StatusCodes.UncertainDataSubNormal, extraBits);
        expect(statusCode2.toString()).toEqual('UncertainDataSubNormal#HistorianCalculated (0x41480001)');
    });

    it('should fail to set a extra information bit on a standard StatusCode', function() {
        expect(function() {

            const statusCode = StatusCodes.Good;

            (<any>statusCode).set('Overflow'); // << set is not defined !!!

        }).toThrowError();
    });

    /*
    it("should convert ",function() {
        const statusCode = makeStatusCode(StatusCodes.UncertainDataSubNormal, "HistorianInterpolated");
        const check = getStatusCodeFromCode(statusCode.value);

        expect(statusCode).toBe(check);
    });
    */

});
