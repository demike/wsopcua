/**
 * create the package.json in dist
 */
const fs = require('fs-extra');
const path = require('path');

const packageJson = require('../package.json');
const generatAlias = require('./generate-alias');

const pkgManifest = {
  name: packageJson.name,
  version: packageJson.version,
  license: packageJson.license,
  author: packageJson.author,
  private: packageJson.private,
  types: `./_types/index.d.ts`,
  main: `./_cjs/index.js`,
  module: `./_esm/index.js`,
  es2015: `./_esm/index.js`,
  dependencies: packageJson.dependencies,
  files: ['/**/!(*.tsbuildinfo)'],
  bin: {
    'wsopcua-schema-gen': './bin/wsopcua-schema-gen.js',
  },
  exports: generatAlias.createExports(),
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

fs.copySync(
  path.resolve(__dirname, '../src/schema_parser/dist/wsopcua-schema-gen.js'),
  path.resolve(__dirname, '../dist/bin/wsopcua-schema-gen.js'),
  { overwrite: true },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  }
);

fs.copySync(
  path.resolve(__dirname, '../src/schema_parser/schemas'),
  path.resolve(__dirname, '../dist/schemas'),
  { overwrite: true },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  }
);
