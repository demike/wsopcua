import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
/**
An argument for a method.
*/
export class Argument {
    constructor(options) {
        options = options || {};
        this.name = (options.name) ? options.name : null;
        this.dataType = (options.dataType) ? options.dataType : null;
        this.valueRank = (options.valueRank) ? options.valueRank : null;
        this.arrayDimensions = (options.arrayDimensions) ? options.arrayDimensions : [];
        this.description = (options.description) ? options.description : new LocalizedText();
    }
    encode(out) {
        ec.encodeString(this.name, out);
        ec.encodeNodeId(this.dataType, out);
        ec.encodeInt32(this.valueRank, out);
        ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
        this.description.encode(out);
    }
    decode(inp) {
        this.name = ec.decodeString(inp);
        this.dataType = ec.decodeNodeId(inp);
        this.valueRank = ec.decodeInt32(inp);
        this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32);
        this.description.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new Argument();
        }
        target.name = this.name;
        target.dataType = this.dataType;
        target.valueRank = this.valueRank;
        target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
        if (this.description) {
            target.description = this.description.clone();
        }
        return target;
    }
}
export function decodeArgument(inp) {
    let obj = new Argument();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Argument", Argument, makeExpandedNodeId(298, 0));
//# sourceMappingURL=Argument.js.map