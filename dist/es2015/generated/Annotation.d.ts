import { DataStream } from '../basic-types/DataStream';
export interface IAnnotation {
    message?: string;
    userName?: string;
    annotationTime?: Date;
}
/**

*/
export declare class Annotation {
    message: string;
    userName: string;
    annotationTime: Date;
    constructor(options?: IAnnotation);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: Annotation): Annotation;
}
export declare function decodeAnnotation(inp: DataStream): Annotation;
