/**
 * Alias subpath import (`dist/_cjs/*`, `dist/_esm/*`) to top-level path mapping (`wsopcua/*`)
 */
const fs = require('fs-extra');
const path = require('path');
const packageJson = require('../package.json');

const DIST_PATH = path.resolve(__dirname, `../dist`);
const TYPES_PATH = path.resolve(__dirname, `../dist/`);

const insertPackageJsonRecursively = function (dirPath) {
  files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      insertPackageJsonRecursively(dirPath + '/' + file);
    } else {
      if (file === 'index.d.ts' && dirPath !== TYPES_PATH) {
        // create package.json files skipping the root package.json
        createPackageManifest(dirPath);
      }
    }
  });
};

exports.createExports = () => {
  const exp = {
    './package.json': {
      default: './package.json',
    },
  };
  createExportsRecursive(TYPES_PATH, exp);

  return exp;
};

function createExportsRecursive(dirPath, exp) {
  files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      createExportsRecursive(dirPath + '/' + file, exp);
    } else {
      if (file === 'index.d.ts') {
        // create exports entry
        let relPath = toUnixPath(path.relative(TYPES_PATH, dirPath));
        key = relPath !== '' ? `./${relPath}` : '.';

        if (relPath) {
          relPath = relPath + '/';
        }

        exp[key] = {
          types: `./${relPath}index.d.ts`,
          node: `./_cjs/${relPath}index.js`,
          require: `./_cjs/${relPath}index.js`,
          es2015: `./_esm/${relPath}index.js`,
          default: `./_esm/${relPath}index.js`,
        };
      }
    }
  });
}

function createPackageManifest(barrelPath) {
  let relPath = toUnixPath(path.relative(TYPES_PATH, barrelPath));
  console.log(relPath);
  let relPathReverse = toUnixPath(path.relative(barrelPath, TYPES_PATH));
  console.log(relPathReverse);
  let alias = relPath;

  const pkgManifest = {
    name: `${packageJson.name}/${relPath}`,
    types: `${relPathReverse}/${relPath}/index.d.ts`,
    main: `${relPathReverse}/_cjs/${relPath}/index.js`,
    module: `${relPathReverse}/_esm/${relPath}/index.js`,
    es2015: `${relPathReverse}/_esm/${relPath}/index.js`,
  };

  const packageJsonPath = path.resolve(DIST_PATH, `${relPath}/package.json`);
  console.log(packageJsonPath);

  fs.outputJSONSync(path.resolve(DIST_PATH, packageJsonPath), pkgManifest, {
    spaces: 2,
  });

  return pkgManifest;
}

function toUnixPath(p) {
  return p.split(path.sep).join(path.posix.sep);
}

insertPackageJsonRecursively(TYPES_PATH);
