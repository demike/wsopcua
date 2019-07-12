

import {DataStream} from '../basic-types/DataStream';

export enum PermissionType {
   None = 0,
  Browse = 1,
  ReadRolePermissions = 2,
  WriteAttribute = 4,
  WriteRolePermissions = 8,
  WriteHistorizing = 16,
  Read = 32,
  Write = 64,
  ReadHistory = 128,
  InsertHistory = 256,
  ModifyHistory = 512,
  DeleteHistory = 1024,
  ReceiveEvents = 2048,
  Call = 4096,
  AddReference = 8192,
  RemoveReference = 16384,
  DeleteNode = 32768,
  AddNode = 65536,

}

export function encodePermissionType( data: PermissionType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodePermissionType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('PermissionType', PermissionType, encodePermissionType , decodePermissionType , null);
