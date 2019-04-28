

import * as ec from '../basic-types';
import {RelativePath} from './RelativePath';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowsePath {
  startingNode?: ec.NodeId;
  relativePath?: RelativePath;
}

/**
A request to translate a path into a node id.
*/

export class BrowsePath {
  startingNode: ec.NodeId;
  relativePath: RelativePath;

 constructor( options?: IBrowsePath) {
  options = options || {};
  this.startingNode = (options.startingNode) ? options.startingNode : null;
  this.relativePath = (options.relativePath) ? options.relativePath : new RelativePath();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.startingNode, out);
  this.relativePath.encode(out);

 }


 decode( inp: DataStream) {
  this.startingNode = ec.decodeNodeId(inp);
  this.relativePath.decode(inp);

 }


 clone( target?: BrowsePath): BrowsePath {
  if (!target) {
   target = new BrowsePath();
  }
  target.startingNode = this.startingNode;
  if (this.relativePath) { target.relativePath = this.relativePath.clone(); }
  return target;
 }


}
export function decodeBrowsePath( inp: DataStream): BrowsePath {
  const obj = new BrowsePath();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowsePath', BrowsePath, makeExpandedNodeId(545, 0));
