"use strict";
/**
 * @method getObjectClassName
 * @param obj
 * @return {string}
 */
export function getObjectClassName(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}
//# sourceMappingURL=object_classname.js.map