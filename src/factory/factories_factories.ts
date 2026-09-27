'use strict';
/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */

import { assert } from '../assert';
import { ExpandedNodeId, NodeId } from '../basic-types';

const constructorMap: { [key: string]: Function } = {};

/**
 * Constructors for companion-spec / custom types (ns != 0).
 *
 * The numeric namespace index is session-specific (it is just an index into the
 * server's NamespaceArray, OPC UA Part 3), so it must not be used as a lookup key:
 * the same type can be ns=2 on one server, ns=3 on another, or change after a
 * reboot. The stable identifier is (namespaceUri, id), resolved per session via
 * the NamespaceArray. See https://github.com/demike/wsopcua/issues/10
 */
const customConstructorMap: { [key: string]: Function } = {};

function customFactoryKey(namespaceUri: string, id: NodeId): string {
  return namespaceUri + '\u0000' + id.identifierType + ':' + String(id.value);
}

function resolveCustomFactoryKey(
  id: NodeId,
  namespaceArray?: string[]
): string | undefined {
  const namespaceUri =
    (id as ExpandedNodeId).namespaceUri ??
    (namespaceArray && id.namespace > 0 ? namespaceArray[id.namespace] : undefined);
  if (!namespaceUri) {
    return undefined;
  }
  return customFactoryKey(namespaceUri, id);
}

const _global_factories: { [key: string]: Function } = {};

function getFactory(type_name: string) {
  return _global_factories[type_name];
}

function registerFactory(type_name: string, constructor: Function) {
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

function callConstructor(constructor: Function) {
  assert('function' === typeof constructor);

  return new (constructor as new () => any)();
}

export function getConstructor(expandedId: NodeId, namespaceArray?: string[]) {
  if (!expandedId) {
    console.log('#getConstructor : cannot find constructor for expandedId ', expandedId);
    return null;
  }
  // ns=0 fast path (stable, spec-defined ids): unchanged behavior
  if (expandedId.namespace === 0 && !(expandedId as ExpandedNodeId).namespaceUri) {
    if (!((expandedId.value as any) /* .toString()*/ in constructorMap)) {
      console.log(
        '#getConstructor : cannot find constructor for expandedId ',
        expandedId.toString()
      );
      return null;
    }
    return constructorMap[<string | number>expandedId.value];
  }
  // companion-spec / custom type: resolve via stable (namespaceUri, id) key
  const key = resolveCustomFactoryKey(expandedId, namespaceArray);
  if (key && key in customConstructorMap) {
    return customConstructorMap[key];
  }
  // fallback to the legacy value-keyed map so classes registered without a
  // namespaceUri (generated before the issue #10 fix) keep resolving as before
  if ((expandedId.value as any) in constructorMap) {
    return constructorMap[<string | number>expandedId.value];
  }
  console.log('#getConstructor : cannot find constructor for expandedId ', expandedId.toString());
  return null;
}

export function hasConstructor(expandedId: NodeId, namespaceArray?: string[]) {
  if (!expandedId) {
    return false;
  }
  assert(expandedId.hasOwnProperty('value'));
  if (expandedId.namespace === 0 && !(expandedId as ExpandedNodeId).namespaceUri) {
    return !!constructorMap[<string | number>expandedId.value];
  }
  const key = resolveCustomFactoryKey(expandedId, namespaceArray);
  if (key && key in customConstructorMap) {
    return true;
  }
  // legacy value-keyed registrations (see getConstructor)
  return (expandedId.value as any) in constructorMap;
}

export function constructObject(expandedNodeId: NodeId, namespaceArray?: string[]) {
  const constructor = getConstructor(expandedNodeId, namespaceArray);
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

  class_constructor.prototype.encodingDefaultBinary = nodeId;

  // Companion-spec / custom types carry a namespaceUri (stable identifier, see
  // https://github.com/demike/wsopcua/issues/10) and are registered in the
  // uri-keyed map. Everything else keeps the legacy value-keyed registration
  // so previously generated code keeps working unchanged.
  if (nodeId.namespace !== 0 && nodeId.namespaceUri) {
    const key = customFactoryKey(nodeId.namespaceUri, nodeId);
    /* istanbul ignore next */
    if (key in customConstructorMap && customConstructorMap[key] !== class_constructor) {
      throw new Error(
        ' Class ' +
          classname +
          ' with ID ' +
          nodeId +
          '  already in constructorMap for  ' +
          customConstructorMap[key].name
      );
    }
    customConstructorMap[key] = class_constructor;
    return;
  }

  /* istanbul ignore next */
  if (
    (nodeId.value as any) /* .toString()*/ in constructorMap &&
    constructorMap[<number | string>nodeId.value] !== class_constructor
  ) {
    throw new Error(
      ' Class ' +
        classname +
        ' with ID ' +
        nodeId +
        '  already in constructorMap for  ' +
        constructorMap[<number | string>nodeId.value].name
    );
  }
  constructorMap[<number | string>nodeId.value] = class_constructor;
}
