import { BSDClassFileParser } from './SchemaParser.module';
export declare class BSDEnumTypeFileParser extends BSDClassFileParser {
    static readonly ATTR_LENGTH: string;
    static readonly TAG_ENUM_VALUE: string;
    lengthInBits: number;
    parse(): void;
    /**
     *
     * @returns element found
     */
    protected createChildElement(el: HTMLElement): boolean;
    protected createEncodeMethod(): void;
    protected createDecodeMethod(): void;
    protected createImports(): void;
    protected createCloneMethod(): void;
    protected getSerializationType(): string;
}
