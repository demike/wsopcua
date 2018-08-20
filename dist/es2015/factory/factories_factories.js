"use strict";
/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */
import { assert } from "../assert";
var constructorMap = {};
var _global_factories = {};
export function getFactory(type_name) {
    return _global_factories[type_name];
}
;
export function registerFactory(type_name, constructor) {
    /* istanbul ignore next */
    if (getFactory(type_name)) {
        console.log(getFactory(type_name));
        throw new Error(" registerFactory  : " + type_name + " already registered");
    }
    _global_factories[type_name] = constructor;
}
;
/* istanbul ignore next */
export function dump() {
    console.log(" dumping registered factories");
    Object.keys(_global_factories).sort().forEach(function (e) {
        console.log(" Factory ", e);
    });
    console.log(" done");
}
;
export function callConstructor(constructor) {
    assert('function' === typeof constructor);
    var FactoryFunction = constructor.bind.apply(constructor, arguments);
    return new FactoryFunction();
}
export function getConstructor(expandedId) {
    if (!(expandedId && (expandedId.value in constructorMap))) {
        console.log("#getConstructor : cannot find constructor for expandedId ", expandedId.toString());
        return null;
    }
    return constructorMap[expandedId.value];
}
;
export function hasConstructor(expandedId) {
    if (!expandedId) {
        return false;
    }
    assert(expandedId.hasOwnProperty("value"));
    // only namespace 0 can be in constructorMap
    if (expandedId.namespace !== 0) {
        return false;
    }
    return !!constructorMap[expandedId.value];
}
;
export function constructObject(expandedNodeId) {
    var constructor = getConstructor(expandedNodeId);
    if (!constructor) {
        return null;
    }
    return callConstructor(constructor);
}
;
export function register_class_definition(classname, class_constructor, nodeId) {
    registerFactory(classname, class_constructor);
    /* istanbul ignore next */
    if (nodeId.value in constructorMap) {
        throw new Error(" Class " + classname + " with ID " + nodeId + "  already in constructorMap for  " + constructorMap[nodeId.value].name);
    }
    class_constructor.prototype.encodingDefaultBinary = nodeId;
    constructorMap[nodeId.value] = class_constructor;
}
//# sourceMappingURL=factories_factories.js.map