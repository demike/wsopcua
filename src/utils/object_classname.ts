"use strict"
/**
 * @method getObjectClassName
 * @param obj
 * @return {string}
 */
export function getObjectClassName(obj) : string {
    return Object.prototype.toString.call(obj).slice(8, -1);
}