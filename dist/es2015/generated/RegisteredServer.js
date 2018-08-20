import * as ec from '../basic-types';
import { decodeLocalizedText } from './LocalizedText';
import { encodeApplicationType, decodeApplicationType } from './ApplicationType';
/**
The information required to register a server with a discovery server.
*/
export class RegisteredServer {
    constructor(options) {
        options = options || {};
        this.serverUri = (options.serverUri) ? options.serverUri : null;
        this.productUri = (options.productUri) ? options.productUri : null;
        this.serverNames = (options.serverNames) ? options.serverNames : [];
        this.serverType = (options.serverType) ? options.serverType : null;
        this.gatewayServerUri = (options.gatewayServerUri) ? options.gatewayServerUri : null;
        this.discoveryUrls = (options.discoveryUrls) ? options.discoveryUrls : [];
        this.semaphoreFilePath = (options.semaphoreFilePath) ? options.semaphoreFilePath : null;
        this.isOnline = (options.isOnline) ? options.isOnline : null;
    }
    encode(out) {
        ec.encodeString(this.serverUri, out);
        ec.encodeString(this.productUri, out);
        ec.encodeArray(this.serverNames, out);
        encodeApplicationType(this.serverType, out);
        ec.encodeString(this.gatewayServerUri, out);
        ec.encodeArray(this.discoveryUrls, out, ec.encodeString);
        ec.encodeString(this.semaphoreFilePath, out);
        ec.encodeBoolean(this.isOnline, out);
    }
    decode(inp) {
        this.serverUri = ec.decodeString(inp);
        this.productUri = ec.decodeString(inp);
        this.serverNames = ec.decodeArray(inp, decodeLocalizedText);
        this.serverType = decodeApplicationType(inp);
        this.gatewayServerUri = ec.decodeString(inp);
        this.discoveryUrls = ec.decodeArray(inp, ec.decodeString);
        this.semaphoreFilePath = ec.decodeString(inp);
        this.isOnline = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new RegisteredServer();
        }
        target.serverUri = this.serverUri;
        target.productUri = this.productUri;
        if (this.serverNames) {
            target.serverNames = ec.cloneComplexArray(this.serverNames);
        }
        target.serverType = this.serverType;
        target.gatewayServerUri = this.gatewayServerUri;
        target.discoveryUrls = ec.cloneArray(this.discoveryUrls);
        target.semaphoreFilePath = this.semaphoreFilePath;
        target.isOnline = this.isOnline;
        return target;
    }
}
export function decodeRegisteredServer(inp) {
    let obj = new RegisteredServer();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisteredServer", RegisteredServer, makeExpandedNodeId(434, 0));
//# sourceMappingURL=RegisteredServer.js.map