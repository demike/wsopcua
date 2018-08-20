import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
/**

*/
export class EUInformation {
    constructor(options) {
        options = options || {};
        this.namespaceUri = (options.namespaceUri) ? options.namespaceUri : null;
        this.unitId = (options.unitId) ? options.unitId : null;
        this.displayName = (options.displayName) ? options.displayName : new LocalizedText();
        this.description = (options.description) ? options.description : new LocalizedText();
    }
    encode(out) {
        ec.encodeString(this.namespaceUri, out);
        ec.encodeInt32(this.unitId, out);
        this.displayName.encode(out);
        this.description.encode(out);
    }
    decode(inp) {
        this.namespaceUri = ec.decodeString(inp);
        this.unitId = ec.decodeInt32(inp);
        this.displayName.decode(inp);
        this.description.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new EUInformation();
        }
        target.namespaceUri = this.namespaceUri;
        target.unitId = this.unitId;
        if (this.displayName) {
            target.displayName = this.displayName.clone();
        }
        if (this.description) {
            target.description = this.description.clone();
        }
        return target;
    }
}
export function decodeEUInformation(inp) {
    let obj = new EUInformation();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EUInformation", EUInformation, makeExpandedNodeId(889, 0));
//# sourceMappingURL=EUInformation.js.map