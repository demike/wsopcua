/**
 * utility to generate source file ./lib/raw_status_codes.js from  Opc.Ua.StatusCodes.csv
 *
 */
'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

// see OPC-UA Part 6 , A2
const codeMap: { [key: string]: number } = {};
const code_list: { name: string; value: number; description: string }[] = [];

export function generateStatusCodes() {
  const datafolder = path.join(__dirname, '../schemas');

  fs.readFile(
    path.join(datafolder, '/StatusCodes.csv'),
    'utf8',
    (err: Error | null, data: string) => {
      if (err) {
        console.log(err);
      } else {
        const lines = data.split('\n');
        lines.forEach(function (line) {
          const e = line.split(',');
          const codeName = e[0];
          console.log(e);
          code_list.push({
            name: e[0],
            value: parseInt(e[1], 16),
            description: e[2],
          });
          codeMap[codeName] = parseInt(e[1], 16);
        });

        console.log('codeMap', codeMap);
        parseStatusCodeXML();
      }
    }
  );
}

function parseStatusCodeXML() {
  const outFile = fs.createWriteStream(__dirname + '/../../constants/raw_status_codes.ts');

  outFile.write(`\n
    /**
     * @module node-opcua-status-codes
     */
    // this file has been automatically generated
    import { ConstantStatusCode, ModifiableStatusCode, ExtraStatusCodeBits } from '../basic-types/status_code';\n
    // tslint:disable: max-line-length
    // tslint:disable: quotemark\n`);

  outFile.write(' export class StatusCodes  { \n');

  code_list.forEach(function (obj) {
    const description = obj.description.trim().replace(/^"|"$/g, '');
    const s = util.format(
      ' /** %s */\n  static %s: ConstantStatusCode = new ConstantStatusCode({ name: %s , value: %s  , description: "%s"});\n',
      description,
      obj.name,
      "'" + obj.name + "'",
      '0x' + obj.value.toString(16),
      description
    );
    outFile.write(s);
  });

  outFile.write(
    '  static GoodWithOverflowBit = new ModifiableStatusCode({ base: StatusCodes.Good, extraBits: (ExtraStatusCodeBits.Overflow | ExtraStatusCodeBits.InfoTypeDataValue)});\n'
  );

  outFile.write('};\n');

  /*
    outFile.write('// this file has been automatically generated\n');
    outFile.write('// tslint:disable: max-line-length\n');
    outFile.write('// tslint:disable: quotemark\n');
    outFile.write('import { IStatusCodeOptions } from \'../basic-types/status_code\';\n');
    outFile.write(' export class StatusCodes: {[key: string]: IStatusCodeOptions} = { \n');
    outFile.write('  Good: { name: \'Good\', value: 0, description: "No Error" }\n');

    const sep = ',';

    code_list.forEach(function(obj) {
        const s =
            sep + ' ' +  obj.name + ': { name: \'' + obj.name + '\' , value: 0x' + obj.value.toString(16) +
                ' , description: "' + obj.description + '" }\n';
        outFile.write(s);
    });
    outFile.write('};\n');
    */
}
