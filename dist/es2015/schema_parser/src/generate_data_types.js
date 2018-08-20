import { PathGenUtil } from "./PathGenUtil";
//import {TypeRegistry} from "./TypeRegistry";
import { TypeRegistry, BSDSchemaParser } from './SchemaParser.module';
TypeRegistry.init();
PathGenUtil.ProjRoot = "../";
//let xsdparser : XSDSchemaParser = new XSDSchemaParser();
//xsdparser.parse('../schemas/Opc.Ua.Types.xsd','../../generated/');
export function generate_data_types(srcBsdFile, dstDir, metaTypeMap, namespace) {
    console.log(__dirname);
    let bsdparser = new BSDSchemaParser();
    bsdparser.parse(srcBsdFile, dstDir, metaTypeMap, namespace);
}
//# sourceMappingURL=generate_data_types.js.map