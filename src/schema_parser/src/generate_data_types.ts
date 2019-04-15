import * as path from 'path';
import { XSDSchemaParser } from "./XSDSchemaParser";
import { PathGenUtil } from "./PathGenUtil";
//import {TypeRegistry} from "./TypeRegistry";
import { TypeRegistry, BSDSchemaParser } from './SchemaParser.module';
import { SchemaParserConfig, sanitizeProjectImportConfig } from './SchemaParserConfig';

PathGenUtil.ProjRoot = __dirname + "../../";

TypeRegistry.init();

//let xsdparser : XSDSchemaParser = new XSDSchemaParser();
//xsdparser.parse('../schemas/Opc.Ua.Types.xsd','../../generated/');
export async function generate_data_types(config: SchemaParserConfig, metaTypeMap: { [key: string]: { [key: string]: string[] } }) {
    console.log(__dirname);
    for (const projectConf of config.projects) {
        sanitizeProjectImportConfig(projectConf);
        let bsdparser: BSDSchemaParser = new BSDSchemaParser();
        await bsdparser.parse(projectConf, metaTypeMap);
    }
}