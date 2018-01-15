    "use strict";
/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */


import {assert} from "../assert";
import * as _ from 'underscore';


var constructorMap = {};

var _global_factories = {};

export function getFactory(type_name : string ) {
    return _global_factories[type_name];
};

export function registerFactory(type_name : string, constructor : Function) {

    /* istanbul ignore next */
    if (getFactory(type_name)) {
        console.log(getFactory(type_name));
        throw new Error(" registerFactory  : " + type_name + " already registered");
    }
    _global_factories[type_name] = constructor;
};

/* istanbul ignore next */
export function dump() {
    console.log(" dumping registered factories");
    Object.keys(_global_factories).sort().forEach(function (e) {
        console.log(" Factory ", e);
    });
    console.log(" done");
};

export function callConstructor(constructor: Function ) {

    assert(_.isFunction(constructor));

    var FactoryFunction = constructor.bind.apply(constructor, arguments);

    return new FactoryFunction();
}


export function getConstructor(expandedId) {

    if (!(expandedId && (expandedId.value in constructorMap))) {
        console.log("#getConstructor : cannot find constructor for expandedId ", expandedId.toString());
        return null;
    }
    return constructorMap[expandedId.value];
};

export function hasConstructor(expandedId) {
    if (!expandedId) { return false; }
    assert(expandedId.hasOwnProperty("value"));
    // only namespace 0 can be in constructorMap
    if (expandedId.namespace !== 0){ return false}
    return !!constructorMap[expandedId.value];
};

export function constructObject(expandedNodeId) {
    var constructor = getConstructor(expandedNodeId);
    if (!constructor) { return null; }
    return callConstructor(constructor);
};

export function register_class_definition(classname, class_constructor) {

    registerFactory(classname, class_constructor);

    var expandedNodeId = class_constructor.prototype.encodingDefaultBinary;

    /* istanbul ignore next */
    if (expandedNodeId.value in constructorMap) {
        throw new Error(" Class " + classname + " with ID " + expandedNodeId + "  already in constructorMap for  " + constructorMap[expandedNodeId.value].name);
    }
    constructorMap[expandedNodeId.value] = class_constructor;
}


