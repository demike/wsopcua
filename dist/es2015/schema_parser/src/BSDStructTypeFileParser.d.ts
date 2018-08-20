import { ClassMember, BSDClassFileParser } from './SchemaParser.module';
export declare class BSDStructTypeFileParser extends BSDClassFileParser {
    protected encodingByteMap?: {
        [key: string]: ClassMember;
    };
    /**
     *
     * @returns element found
     */
    protected createChildElement(el: HTMLElement): boolean;
    protected createConstructor(): void;
    protected createEncodeMethod(): void;
    protected createDecodeMethod(): void;
    protected createDecodeEncodingByteCode(): string;
    protected createEncodeEncodingByteCode(): string;
    protected createCloneMethod(): void;
    protected createDefines(): void;
}
