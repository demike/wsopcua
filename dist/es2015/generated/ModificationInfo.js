import * as ec from '../basic-types';
import { encodeHistoryUpdateType, decodeHistoryUpdateType } from './HistoryUpdateType';
/**

*/
export class ModificationInfo {
    constructor(options) {
        options = options || {};
        this.modificationTime = (options.modificationTime) ? options.modificationTime : null;
        this.updateType = (options.updateType) ? options.updateType : null;
        this.userName = (options.userName) ? options.userName : null;
    }
    encode(out) {
        ec.encodeDateTime(this.modificationTime, out);
        encodeHistoryUpdateType(this.updateType, out);
        ec.encodeString(this.userName, out);
    }
    decode(inp) {
        this.modificationTime = ec.decodeDateTime(inp);
        this.updateType = decodeHistoryUpdateType(inp);
        this.userName = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new ModificationInfo();
        }
        target.modificationTime = this.modificationTime;
        target.updateType = this.updateType;
        target.userName = this.userName;
        return target;
    }
}
export function decodeModificationInfo(inp) {
    let obj = new ModificationInfo();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModificationInfo", ModificationInfo, makeExpandedNodeId(11226, 0));
//# sourceMappingURL=ModificationInfo.js.map