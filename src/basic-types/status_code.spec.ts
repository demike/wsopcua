import { StatusCodes, encodeStatusCode, StatusCode, decodeStatusCode } from '.';
import { DataStream } from './DataStream';
import { makeStatusCode} from './status_code';



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
        expect(StatusCodes['GoodWithOverflowBit'].value).toBe(0x480);
        expect(StatusCodes['GoodWithOverflowBit'].name).toBe('Good#InfoTypeDataValue|Overflow');
    });


    it('should encode and decode a status code', function () {

        const stream = new DataStream(8);
        const statusCode = StatusCodes.BadNodeIdExists;
        encodeStatusCode(statusCode as StatusCode, stream);
        stream.rewind();
        const statusCode2 = decodeStatusCode(stream);
        expect(statusCode2).toEqual(statusCode);

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
        const statusCode2 =  makeStatusCode(StatusCodes.Good,'Overflow | InfoTypeDataValue');
        expect(statusCode2).toEqual(StatusCodes['GoodWithOverflowBit']);
    });

    it('should be possible to set SemanticChanged bit on a status code', function() {

        const statusCode2 =  makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode2.set('SemanticChanged');
        expect(statusCode2.value).toBe(StatusCodes.BadNodeIdExists.value + 0x4000);
        expect(statusCode2.name).toBe('BadNodeIdExists#SemanticChanged');

    });
    it('should be possible to set the Overflow bit on a status code', function() {

        const statusCode2 =  makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode2.set('Overflow');
        expect(statusCode2.value).toBe(StatusCodes.BadNodeIdExists.value + 0x80);
        expect(statusCode2.name).toBe('BadNodeIdExists#Overflow');

    });
    it('should be possible to set the Overflow and SemanticChanged bits on a status code', function() {

        const statusCode = makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode.set('Overflow | SemanticChanged');


        expect(statusCode.value).toBe(StatusCodes.BadNodeIdExists.value + 0x80 + 0x4000);
        expect(statusCode.name).toBe('BadNodeIdExists#SemanticChanged|Overflow');

        expect(statusCode.toString()).toBe('BadNodeIdExists#SemanticChanged|Overflow (0x805e4080)');
    });


    it('should be possible to encode and decode a statusCode that have a extra information bit', function() {

        const statusCode = makeStatusCode(StatusCodes.BadNodeIdExists);
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

    it('should be possible to create a modifiable StatusCode from a ModifiableStatusCode', function() {

        const statusCode = makeStatusCode(StatusCodes.BadNodeIdExists);
        statusCode.set('Overflow');
        expect(statusCode.hasOverflowBit).toBe(true);
        expect(statusCode.hasSemanticChangedBit).toBe(false);

        const statusCode2 = makeStatusCode(statusCode);
        expect(statusCode2.hasOverflowBit).toBe(true);
        expect(statusCode2.hasSemanticChangedBit).toBe(false);
        statusCode2.set('SemanticChanged');
        expect(statusCode2.hasOverflowBit).toBe(true);
        expect(statusCode2.hasSemanticChangedBit).toBe(true);

        expect(statusCode.hasOverflowBit).toBe(true);
        expect(statusCode.hasSemanticChangedBit).toBe(false);

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
