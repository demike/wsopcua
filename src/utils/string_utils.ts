"use strict";

export function capitalizeFirstLetter(str: string) : string  {
    if (str == null) {
        return str;
    }
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

var ACode = "A".charCodeAt(0);
var ZCode = "Z".charCodeAt(0);
export function isUpperCaseChar(c) : boolean {
    var code = c.charCodeAt(0);
    return code >= ACode && code <= ZCode;
}

// HelloWorld => helloWorld
// XAxis      => xAxis
// EURange    => euRange
export function lowerFirstLetter(str : string) : string {
    if (str == null) {
        return str;
    }
    var result =  str.substr(0, 1).toLowerCase() + str.substr(1);
    if (result.length>3 && isUpperCaseChar(str[1]) && isUpperCaseChar(str[2])) {
        result =  str.substr(0, 2).toLowerCase() + str.substr(2);
    }
    return result;
}

