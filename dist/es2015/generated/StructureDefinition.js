import * as ec from '../basic-types';
import { encodeStructureType, decodeStructureType } from './StructureType';
import { decodeStructureField } from './StructureField';
/**

*/
export class StructureDefinition {
    constructor(options) {
        options = options || {};
        this.defaultEncodingId = (options.defaultEncodingId) ? options.defaultEncodingId : null;
        this.baseDataType = (options.baseDataType) ? options.baseDataType : null;
        this.structureType = (options.structureType) ? options.structureType : null;
        this.fields = (options.fields) ? options.fields : [];
    }
    encode(out) {
        ec.encodeNodeId(this.defaultEncodingId, out);
        ec.encodeNodeId(this.baseDataType, out);
        encodeStructureType(this.structureType, out);
        ec.encodeArray(this.fields, out);
    }
    decode(inp) {
        this.defaultEncodingId = ec.decodeNodeId(inp);
        this.baseDataType = ec.decodeNodeId(inp);
        this.structureType = decodeStructureType(inp);
        this.fields = ec.decodeArray(inp, decodeStructureField);
    }
    clone(target) {
        if (!target) {
            target = new StructureDefinition();
        }
        target.defaultEncodingId = this.defaultEncodingId;
        target.baseDataType = this.baseDataType;
        target.structureType = this.structureType;
        if (this.fields) {
            target.fields = ec.cloneComplexArray(this.fields);
        }
        return target;
    }
}
export function decodeStructureDefinition(inp) {
    let obj = new StructureDefinition();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StructureDefinition", StructureDefinition, makeExpandedNodeId(122, 0));
//# sourceMappingURL=StructureDefinition.js.map