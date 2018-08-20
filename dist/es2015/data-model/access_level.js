"use strict";
/**
 * @module opcua.datamodel
 */
import { registerBasicType } from '../factory/factories_basic_type';
import * as utils from '../utils';
export var AccessLevelFlag;
(function (AccessLevelFlag) {
    AccessLevelFlag[AccessLevelFlag["CurrentRead"] = 1] = "CurrentRead";
    AccessLevelFlag[AccessLevelFlag["CurrentWrite"] = 2] = "CurrentWrite";
    AccessLevelFlag[AccessLevelFlag["HistoryRead"] = 4] = "HistoryRead";
    AccessLevelFlag[AccessLevelFlag["HistoryWrite"] = 8] = "HistoryWrite";
    AccessLevelFlag[AccessLevelFlag["SemanticChange"] = 16] = "SemanticChange";
    AccessLevelFlag[AccessLevelFlag["StatusWrite"] = 32] = "StatusWrite";
    AccessLevelFlag[AccessLevelFlag["TimestampWrite"] = 64] = "TimestampWrite";
    AccessLevelFlag[AccessLevelFlag["NONE"] = 2048] = "NONE";
})(AccessLevelFlag || (AccessLevelFlag = {}));
;
// @example
//      makeAccessLevel("CurrentRead | CurrentWrite").should.eql(0x03);
export function makeAccessLevel(str) {
    var accessFlag;
    if (str === "" || str === 0) {
        accessFlag = AccessLevelFlag.NONE;
    }
    else {
        accessFlag = AccessLevelFlag[str];
    }
    if (utils.isNullOrUndefined(accessFlag)) {
        throw new Error("Invalid access flag specified '" + str + "' should be one of " + AccessLevelFlag);
    }
    return accessFlag;
}
;
registerBasicType({
    name: "AccessLevelFlag",
    subtype: "Byte",
    defaultValue: function () {
        return makeAccessLevel("CurrentRead | CurrentWrite");
    },
    encode: function (value, stream) {
        stream.writeUInt8(value.value & 0x8F);
    },
    decode: function (stream) {
        var code = stream.readUInt8();
        return code ? code : AccessLevelFlag.NONE;
    },
    coerce: function (value) {
        return makeAccessLevel(value);
    },
    random: function () {
        return this.defaultValue();
    }
});
//# sourceMappingURL=access_level.js.map