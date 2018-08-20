import * as ec from '../basic-types';
/**

*/
export class BuildInfo {
    constructor(options) {
        options = options || {};
        this.productUri = (options.productUri) ? options.productUri : null;
        this.manufacturerName = (options.manufacturerName) ? options.manufacturerName : null;
        this.productName = (options.productName) ? options.productName : null;
        this.softwareVersion = (options.softwareVersion) ? options.softwareVersion : null;
        this.buildNumber = (options.buildNumber) ? options.buildNumber : null;
        this.buildDate = (options.buildDate) ? options.buildDate : null;
    }
    encode(out) {
        ec.encodeString(this.productUri, out);
        ec.encodeString(this.manufacturerName, out);
        ec.encodeString(this.productName, out);
        ec.encodeString(this.softwareVersion, out);
        ec.encodeString(this.buildNumber, out);
        ec.encodeDateTime(this.buildDate, out);
    }
    decode(inp) {
        this.productUri = ec.decodeString(inp);
        this.manufacturerName = ec.decodeString(inp);
        this.productName = ec.decodeString(inp);
        this.softwareVersion = ec.decodeString(inp);
        this.buildNumber = ec.decodeString(inp);
        this.buildDate = ec.decodeDateTime(inp);
    }
    clone(target) {
        if (!target) {
            target = new BuildInfo();
        }
        target.productUri = this.productUri;
        target.manufacturerName = this.manufacturerName;
        target.productName = this.productName;
        target.softwareVersion = this.softwareVersion;
        target.buildNumber = this.buildNumber;
        target.buildDate = this.buildDate;
        return target;
    }
}
export function decodeBuildInfo(inp) {
    let obj = new BuildInfo();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BuildInfo", BuildInfo, makeExpandedNodeId(340, 0));
//# sourceMappingURL=BuildInfo.js.map