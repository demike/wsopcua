export var doDebug = false;

export function setDebug(debug: boolean) {
    doDebug = debug;
}

export function debugLog(...args) {
    if (doDebug) {
        console.debug(...args);
    }
}

/*
export function debugLog(str : String) {
    console.log(str);
} 
*/
var _fillUp = function (value: string, count: number, fillWith: string) {
    var l = count - value.length;
    var ret = "";
    while (--l > -1)
        ret += fillWith;
    return ret + value;
}

export function hexDump (view : DataView | ArrayBuffer, offset?: number, length?: number) {

    //var view = new DataView(arrayBuffer);
    view = (view instanceof DataView) ? view : new DataView(view);
    offset = offset || 0;
    length = length || view.byteLength;

    var out = _fillUp("Offset", 8, " ") + "  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\n";
    var row = "";
    for (var i = 0; i < length; i += 16) {
        row += _fillUp(offset.toString(16).toUpperCase(), 8, "0") + "  ";
        var n = Math.min(16, length - offset);
        var string = "";
        for (var j = 0; j < 16; ++j) {
            if (j < n) {
                var value = view.getUint8(offset);
                string += value >= 32 ? String.fromCharCode(value) : ".";
                row += _fillUp(value.toString(16).toUpperCase(), 2, "0") + " ";
                offset++;
            }
            else {
                row += "   ";
                string += " ";
            }
        }
        row += " " + string + "\n";
    }
    out += row;
    return out;
};