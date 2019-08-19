


import * as path from 'path';
import './generate_status_code';
import {generate_data_types} from './generate_data_types';
import {generateNodeIds, metaTypeMap} from './generate_node_ids';
import * as fs from 'fs';
import { SchemaParserConfig } from './SchemaParserConfig';

import * as program from 'commander';

const pkg = require('../package.json');
const appName = 'wsopcua-schema-gen'; // Object.keys(pkg.bin)[0];

const datafolder = path.join(__dirname, '../schemas');
const defaultConfigFilePath = path.join(__dirname, '../schemas/schema_parser_config.json');

console.log(defaultConfigFilePath);

program
    .description(pkg.description)
    .name(appName)
    .option('-c --config <path>', 'set path to configuration file')
    .version(pkg.verison)
    .parse(process.argv);

// parse the default configuration file
const importConfig: SchemaParserConfig = JSON.parse( fs.readFileSync(defaultConfigFilePath).toString() );

// parse the configuration file provided through command line
if (program.config) {
    //
    try {
        const customConfig: SchemaParserConfig = JSON.parse( fs.readFileSync(program.config).toString());
        importConfig.projects = [...importConfig.projects, ...customConfig.projects];
    } catch (err) {
        console.log('Error reading the config file: ', program.config, err );
    }
}

generateNodeIds(path.join(datafolder, '/NodeIds.csv'), 'opcua_node_ids.ts', () => {
    generate_data_types(importConfig, metaTypeMap);
});

/*
async generate() => {
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Types.bsd'),path.join(__dirname,'../../generated/'),metaTypeMap, 0);
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Di.NodeSet2.xml'),path.join(__dirname,'../../generated/DI'),metaTypeMap, 1);
});
*/
