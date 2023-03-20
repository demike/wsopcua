'use strict';
import * as path from 'path';
import * as fs from 'fs';

export function generateAttributeIds(csvFilePath: string) {
  fs.readFile(csvFilePath, 'utf8', (err: Error | null, data: string) => {
    if (err) {
      console.log(err);
    } else {
      writeEnumFile(data);
    }
  });
}

function writeEnumFile(data: string) {
  const fileName = 'AttributeIds.ts';
  const outFile = fs.createWriteStream(path.join(__dirname + '/../../constants', fileName));
  outFile.write('// this file has been automatically generated\n');
  outFile.write('// using schema_parser/generate_attribure_ids.ts\n');
  outFile.write('export enum AttributeIds {\n');

  const lines = data.split('\n');
  lines.forEach(function (line) {
    const [name, value] = line.split(',');
    if (!name || !value) {
      return;
    }
    outFile.write(' ' + name + ' = ' + value.trimEnd() /* remove \r */ + ',\n');
  });
  outFile.write(' INVALID = 999\n');
  outFile.write('}\n');
  outFile.close();
}
