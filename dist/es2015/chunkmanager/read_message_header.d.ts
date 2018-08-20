import { DataStream } from '../basic-types/DataStream';
export declare function readMessageHeader(stream: DataStream): {
    msgType: string;
    isFinal: string;
    length: number;
};
