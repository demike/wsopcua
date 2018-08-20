export var ServerState;
(function (ServerState) {
    ServerState[ServerState["Running"] = 0] = "Running";
    ServerState[ServerState["Failed"] = 1] = "Failed";
    ServerState[ServerState["NoConfiguration"] = 2] = "NoConfiguration";
    ServerState[ServerState["Suspended"] = 3] = "Suspended";
    ServerState[ServerState["Shutdown"] = 4] = "Shutdown";
    ServerState[ServerState["Test"] = 5] = "Test";
    ServerState[ServerState["CommunicationFault"] = 6] = "CommunicationFault";
    ServerState[ServerState["Unknown"] = 7] = "Unknown";
})(ServerState || (ServerState = {}));
export function encodeServerState(data, out) {
    out.setUint32(data);
}
export function decodeServerState(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("ServerState", ServerState, encodeServerState, decodeServerState, null);
//# sourceMappingURL=ServerState.js.map