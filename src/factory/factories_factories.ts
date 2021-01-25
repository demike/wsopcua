'use strict';
/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */

import { assert } from '../assert';
import { ExpandedNodeId, NodeId } from '../basic-types';

const constructorMap: { [key: string]: Function } = {};

const _global_factories: { [key: string]: Function } = {};

export function getFactory(type_name: string) {
  return _global_factories[type_name];
}

export function registerFactory(type_name: string, constructor: Function) {
  /* istanbul ignore next */
  if (getFactory(type_name)) {
    console.log(getFactory(type_name));
    throw new Error(' registerFactory  : ' + type_name + ' already registered');
  }
  _global_factories[type_name] = constructor;
}

/* istanbul ignore next */
export function dump() {
  console.log(' dumping registered factories');
  Object.keys(_global_factories)
    .sort()
    .forEach(function (e) {
      console.log(' Factory ', e);
    });
  console.log(' done');
}

export function callConstructor(constructor: Function) {
  assert('function' === typeof constructor);

  const FactoryFunction = constructor.bind.apply(constructor, arguments);

  return new FactoryFunction();
}

export function getConstructor(expandedId: NodeId) {
  if (!(expandedId && (expandedId.value as any) /*.toString()*/ in constructorMap)) {
    console.log('#getConstructor : cannot find constructor for expandedId ', expandedId.toString());
    return null;
  }
  return constructorMap[<string | number>expandedId.value];
}

export function hasConstructor(expandedId: NodeId) {
  if (!expandedId) {
    return false;
  }
  assert(expandedId.hasOwnProperty('value'));
  // only namespace 0 can be in constructorMap
  if (expandedId.namespace !== 0) {
    return false;
  }
  return !!constructorMap[<string | number>expandedId.value];
}

export function constructObject(expandedNodeId: NodeId) {
  const constructor = getConstructor(expandedNodeId);
  if (!constructor) {
    return null;
  }
  return callConstructor(constructor);
}

export function register_class_definition(
  classname: string,
  class_constructor: any,
  nodeId: ExpandedNodeId
) {
  registerFactory(classname, class_constructor);

  /* istanbul ignore next */
  if ((nodeId.value as any) /*.toString()*/ in constructorMap) {
    throw new Error(
      ' Class ' +
        classname +
        ' with ID ' +
        nodeId +
        '  already in constructorMap for  ' +
        constructorMap[<number | string>nodeId.value].name
    );
  }
  class_constructor.prototype.encodingDefaultBinary = nodeId;
  constructorMap[<number | string>nodeId.value] = class_constructor;
}
