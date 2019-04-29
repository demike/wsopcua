import { DataStream } from './DataStream';

export type Guid = string;

function toHex(i: number, nb: number) {
    return ('000000000000000' + i.toString(16)).substr(-nb);
}


function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const regexGUID = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/;

/**
 * checks if provided string is a valid Guid
 * a valid GUID has the form  XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX
 * when X is a hexadecimal digit
 *
 * @method isValidGuid
 *
 * @param guid {String}
 * @return {Boolean} return true if the string is a valid GUID.
 */
export function isValidGuid(guid: string): Boolean {
    return regexGUID.test(guid);
}

//                             1         2         3
//                   012345678901234567890123456789012345
export const emptyGuid = '00000000-0000-0000-0000-000000000000';

export function randomGuid(): string {

        const b = new DataStream(20);
        for (let i = 0; i < 20; i++) {
            b.setUint8(getRandomInt(0, 255));
        }
        b.rewind();
        const value = decodeGuid(b);
        return value;
    }

export function encodeGuid(guid: string, stream: DataStream): void {

        if (!isValidGuid(guid)) {
            throw new Error(' Invalid GUID : \'' + JSON.stringify(guid) + '\'');
        }
        //           1         2         3
        // 012345678901234567890123456789012345
        // |        |    |    | |  | | | | | |
        // 12345678-1234-1234-ABCD-0123456789AB
        // 00000000-0000-0000-0000-000000000000";
        function write_UInt32(starts: number[]) {
            let start;
            let i;
            const n = starts.length;
            for (i = 0; i < n; i++) {
                start = starts[i];
                stream.setUint32(parseInt(guid.substr(start, 8), 16));
            }
        }

        function write_UInt16(starts: number[]) {
            let start;
            let i;
            const n = starts.length;
            for (i = 0; i < n; i++) {
                start = starts[i];
                stream.setUint16(parseInt(guid.substr(start, 4), 16));
            }
        }

        function write_UInt8(starts: number[]) {
            let start;
            let i;
            const n = starts.length;
            for (i = 0; i < n; i++) {
                start = starts[i];
                stream.setUint8(parseInt(guid.substr(start, 2), 16));
            }
        }

        write_UInt32([0]);
        write_UInt16([9, 14]);
        write_UInt8([19, 21, 24, 26, 28, 30, 32, 34]);
    }


    export function decodeGuid(stream: DataStream) {

        function read_UInt32() {
            return toHex(stream.getUint32(), 8);
        }

        function read_UInt16() {
            return toHex(stream.getUint16(), 4);
        }

        function read_UInt8() {
            return toHex(stream.getUint8(), 2);
        }

        function read_many(func: () => string, nb: number) {
            let result = '';
            let i: number;
            for (i = 0; i < nb; i++) {
                result += func();
            }
            return result;
        }

        const data1 = read_UInt32();

        const data2 = read_UInt16();

        const data3 = read_UInt16();

        const data4_5 = read_many(read_UInt8, 2);

        const data6_B = read_many(read_UInt8, 6);

        const guid = data1 + '-' + data2 + '-' + data3 + '-' + data4_5 + '-' + data6_B;

        return guid.toUpperCase();
    }

