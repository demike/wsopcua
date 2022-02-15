import * as path from 'path';
import { generateStatusCodes } from './generate_status_code';
import { generate_data_types } from './generate_data_types';
import { generateNodeIds, metaTypeMap } from './generate_node_ids';
import * as fs from 'fs';
import { SchemaParserConfig, sanitizeProjectImportConfig } from './SchemaParserConfig';

import * as program from 'commander';
import { PathGenUtil } from './PathGenUtil';
import { generateAttributeIds } from './generate_attribute_ids';

const pkg = require('../package.json');
const appName = 'wsopcua-schema-gen'; // Object.keys(pkg.bin)[0];

const datafolder = path.join(__dirname, '../schemas');
const defaultConfigFilePath = path.join(__dirname, '../schemas/schema_parser_config.json');

console.log(defaultConfigFilePath);

program
  .description(pkg.description)
  .name(appName)
  .option('-c --config <path>', 'set path to configuration file')
  .option('--genids', 'generate node ids')
  .option('--gencodes', 'generate status codes')
  .version(pkg.verison)
  .parse(process.argv);

if (program.gencodes) {
  generateStatusCodes();
}

if (program.genids) {
  generateAttributeIds(path.join(datafolder, '/AttributeIds.csv'));
}

// parse the default configuration file
const importConfig: SchemaParserConfig = JSON.parse(
  fs.readFileSync(defaultConfigFilePath).toString()
);
importConfig.projects[0].projectName = PathGenUtil.PROJECT_NAME;
for (const projectImport of importConfig.projects) {
  sanitizeProjectImportConfig(projectImport, defaultConfigFilePath);
}

// parse the configuration file provided through command line
if (program.config) {
  // we  use a custom config file --> set the default one to readonly (do not overwrite our own types)
  importConfig.projects[0].readonly = true;
  try {
    const customConfig: SchemaParserConfig = JSON.parse(fs.readFileSync(program.config).toString());
    for (const projectImport of customConfig.projects) {
      sanitizeProjectImportConfig(projectImport, program.config);
    }

    importConfig.projects = [...importConfig.projects, ...customConfig.projects];
  } catch (err) {
    console.log('Error reading the config file: ', program.config, err);
  }
}

generateNodeIds(path.join(datafolder, '/NodeIds.csv'), program.genids, () => {
  generate_data_types(importConfig, metaTypeMap);
});

/*
async generate() => {
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Types.bsd'),path.join(__dirname,'../../generated/'),metaTypeMap, 0);
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Di.NodeSet2.xml'),path.join(__dirname,'../../generated/DI'),
        metaTypeMap, 1);
});
*/
