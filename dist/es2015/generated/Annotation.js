import * as ec from '../basic-types';
/**

*/
export class Annotation {
    constructor(options) {
        options = options || {};
        this.message = (options.message) ? options.message : null;
        this.userName = (options.userName) ? options.userName : null;
        this.annotationTime = (options.annotationTime) ? options.annotationTime : null;
    }
    encode(out) {
        ec.encodeString(this.message, out);
        ec.encodeString(this.userName, out);
        ec.encodeDateTime(this.annotationTime, out);
    }
    decode(inp) {
        this.message = ec.decodeString(inp);
        this.userName = ec.decodeString(inp);
        this.annotationTime = ec.decodeDateTime(inp);
    }
    clone(target) {
        if (!target) {
            target = new Annotation();
        }
        target.message = this.message;
        target.userName = this.userName;
        target.annotationTime = this.annotationTime;
        return target;
    }
}
export function decodeAnnotation(inp) {
    let obj = new Annotation();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Annotation", Annotation, makeExpandedNodeId(893, 0));
//# sourceMappingURL=Annotation.js.map