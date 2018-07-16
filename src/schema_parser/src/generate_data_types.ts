import * as path from 'path';
import { XSDSchemaParser } from "./XSDSchemaParser";
import { PathGenUtil } from "./PathGenUtil";
//import {TypeRegistry} from "./TypeRegistry";
import { TypeRegistry, BSDSchemaParser } from './SchemaParser.module';

TypeRegistry.init();

PathGenUtil.ProjRoot = "../";
//let xsdparser : XSDSchemaParser = new XSDSchemaParser();
//xsdparser.parse('../schemas/Opc.Ua.Types.xsd','../../generated/');
export function generate_data_types(srcBsdFile: string, dstDir: string, metaTypeMap: { [key: string]: { [key: string]: string[] } }, namespace : any) {
    console.log(__dirname);
    let bsdparser: BSDSchemaParser = new BSDSchemaParser();
    bsdparser.parse(srcBsdFile, dstDir, metaTypeMap, namespace);
}