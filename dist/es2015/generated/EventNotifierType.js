export var EventNotifierType;
(function (EventNotifierType) {
    EventNotifierType[EventNotifierType["None"] = 0] = "None";
    EventNotifierType[EventNotifierType["SubscribeToEvents"] = 1] = "SubscribeToEvents";
    EventNotifierType[EventNotifierType["HistoryRead"] = 4] = "HistoryRead";
    EventNotifierType[EventNotifierType["HistoryWrite"] = 8] = "HistoryWrite";
})(EventNotifierType || (EventNotifierType = {}));
export function encodeEventNotifierType(data, out) {
    out.setUint32(data);
}
export function decodeEventNotifierType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("EventNotifierType", EventNotifierType, encodeEventNotifierType, decodeEventNotifierType, null);
//# sourceMappingURL=EventNotifierType.js.map