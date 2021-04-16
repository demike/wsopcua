/**
 * create the package.json in dist
 */
const fs = require('fs-extra');
const path = require('path');

packageJson = require('../package.json');

const pkgManifest = {
  name: packageJson.name,
  version: packageJson.version,
  license: packageJson.license,
  author: packageJson.author,
  private: packageJson.private,
  types: `./index.d.ts`,
  main: `./cjs/index.js`,
  module: `./_esm/index.js`,
  es2015: `./_esm/index.js`,
  dependencies: packageJson.dependencies,
  files: ['/**/!(*.tsbuildinfo)'],
};

fs.writeJSONSync(path.resolve(__dirname, `../dist/package.json`), pkgManifest, { spaces: 2 });

/**
 * copy docs to dist
 */

fs.copySync(
  path.resolve(__dirname, '../documentation'),
  path.resolve(__dirname, '../dist/documentation'),
  { overwrite: true },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  }
);

fs.copySync(
  path.resolve(__dirname, '../README.md'),
  path.resolve(__dirname, '../dist/README.md'),
  { overwrite: true },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  }
);

/**
 * copy the schema generator
 */
/* TODO enable it again
fs.copySync(
  path.resolve(__dirname, '../src/schema_parser/dist/wsopcua-schema-gen.js'),
  path.resolve(__dirname, '../dist/wsopcua-schema-gen.js'),
  { overwrite: true },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  }
);
*/
