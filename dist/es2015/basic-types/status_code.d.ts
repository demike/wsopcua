import { DataStream } from './DataStream';
interface IStatusCodeOptions {
    value: number;
    description: string;
    name: string;
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
export declare class StatusCode {
    private _value;
    readonly value: number;
    private _description;
    readonly description: string;
    private _name;
    readonly name: string;
    constructor(options: IStatusCodeOptions);
    /**
     *
     * @method toString
     * @return {string}
     */
    toString(): string;
    checkBit(mask: any): boolean;
    readonly hasOverflowBit: boolean;
    readonly hasSemanticChangedBit: boolean;
    readonly hasStructureChangedBit: boolean;
    valueOf(): number;
}
export declare var encodeStatusCode: (statusCode: any, stream: DataStream) => void;
export declare var decodeStatusCode: (stream: DataStream) => any;
/**
 * @module StatusCodes
 * @type {exports.StatusCodes|*}
 */
export { StatusCodes } from '../constants';
export declare function coerceStatusCode(statusCode: any): any;
