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
  repository: packageJson.repository,
  types: `./index.d.ts`,
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

copySync('../documentation', '../dist/documentation');
copySync('../README.md', '../dist/README.md');
copySync('../LICENSE.md', '../dist/LICENSE.md');
copySync('../license', '../dist/license');

/**
 * copy the schema generator
 */

copySync('../src/schema_parser/dist/wsopcua-schema-gen.js', '../dist/bin/wsopcua-schema-gen.js');
copySync('../src/schema_parser/schemas', '../dist/schemas');

function copySync(src, dst) {
  fs.copySync(
    path.resolve(__dirname, src),
    path.resolve(__dirname, dst),
    { overwrite: true },
    function (err) {
      if (err) {
        console.error(err);
        process.exit(-1);
      }
    }
  );
}
