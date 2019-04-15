
import * as path from 'path';
import './generate_status_code';
import {generate_data_types} from './generate_data_types';
import {generateNodeIds,metaTypeMap} from './generate_node_ids';
import * as fs from 'fs';
import { SchemaParserConfig } from './SchemaParserConfig';

let datafolder = path.join(__dirname,"../schemas");
let configFilePath = path.join(__dirname, '../schemas/schema_parser_config.json');

let importConfig: SchemaParserConfig = JSON.parse( fs.readFileSync(configFilePath).toString() );

generateNodeIds(path.join(datafolder,'/NodeIds.csv'),"opcua_node_ids.ts", () => {
    generate_data_types(importConfig, metaTypeMap);
});

/*
async generate() => {
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Types.bsd'),path.join(__dirname,'../../generated/'),metaTypeMap, 0);
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Di.NodeSet2.xml'),path.join(__dirname,'../../generated/DI'),metaTypeMap, 1);
});
*/
