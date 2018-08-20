import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { DataStream } from '../basic-types/DataStream';
export interface IRelativePathElement {
    referenceTypeId?: ec.NodeId;
    isInverse?: boolean;
    includeSubtypes?: boolean;
    targetName?: QualifiedName;
}
/**
An element in a relative path.
*/
export declare class RelativePathElement {
    referenceTypeId: ec.NodeId;
    isInverse: boolean;
    includeSubtypes: boolean;
    targetName: QualifiedName;
    constructor(options?: IRelativePathElement);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RelativePathElement): RelativePathElement;
}
export declare function decodeRelativePathElement(inp: DataStream): RelativePathElement;
