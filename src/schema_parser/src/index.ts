import * as path from 'path';
import {XSDSchemaParser} from "./XSDSchemaParser";
import {PathGenUtil} from "./PathGenUtil"; 
//import {TypeRegistry} from "./TypeRegistry";
import {TypeRegistry, BSDSchemaParser} from './SchemaParser.module';

TypeRegistry.init();

PathGenUtil.ProjRoot = "../../";
//let xsdparser : XSDSchemaParser = new XSDSchemaParser();
//xsdparser.parse('../schemas/Opc.Ua.Types.xsd','../../generated/');
console.log(__dirname);
let bsdparser : BSDSchemaParser = new BSDSchemaParser();
bsdparser.parse(path.join(__dirname,'../schemas/Opc.Ua.Types.bsd'),
        path.join(__dirname,'../../../generated/'));
