import {BSDSchemaParser} from "./BSDSchemaParser";
import {XSDSchemaParser} from "./XSDSchemaParser";
import {PathGenUtil} from "./PathGenUtil"; 
import {TypeRegistry} from "./TypeRegistry";

TypeRegistry.init();

PathGenUtil.ProjRoot = "../../";
let xsdparser : XSDSchemaParser = new XSDSchemaParser();
xsdparser.parse('../schemas/Opc.Ua.Types.xsd','../../generated/');
let bsdparser : BSDSchemaParser = new BSDSchemaParser();
bsdparser.parse('../schemas/Opc.Ua.Types.bsd','../../generated/');
