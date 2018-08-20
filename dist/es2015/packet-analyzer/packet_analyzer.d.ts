/**
 * @method packet_analyzer
 * @param {Buffer} buffer
 * @param id
 * @param {Integer} padding
 * @param {Integer} offset
 * @param {Object} custom_options
 * @param {Object} custom_options.factory
 * @param {Function} custom_options.factory.constructObject
 */
export declare function packet_analyzer(buffer: ArrayBuffer, id?: any, padding?: number, offset?: number, custom_options?: any): void;
export declare function analyze_object_binary_encoding(obj: any, options: any): void;
