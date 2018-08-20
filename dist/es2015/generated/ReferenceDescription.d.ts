import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { NodeClass } from './NodeClass';
import { DataStream } from '../basic-types/DataStream';
export interface IReferenceDescription {
    referenceTypeId?: ec.NodeId;
    isForward?: boolean;
    nodeId?: ec.ExpandedNodeId;
    browseName?: QualifiedName;
    displayName?: LocalizedText;
    nodeClass?: NodeClass;
    typeDefinition?: ec.ExpandedNodeId;
}
/**
The description of a reference.
*/
export declare class ReferenceDescription {
    referenceTypeId: ec.NodeId;
    isForward: boolean;
    nodeId: ec.ExpandedNodeId;
    browseName: QualifiedName;
    displayName: LocalizedText;
    nodeClass: NodeClass;
    typeDefinition: ec.ExpandedNodeId;
    constructor(options?: IReferenceDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReferenceDescription): ReferenceDescription;
}
export declare function decodeReferenceDescription(inp: DataStream): ReferenceDescription;
