/**
 * Alias subpath import (`dist/_cjs/*`, `dist/_esm/*`) to top-level path mapping (`wsopcua/*`)
 */
const fs = require('fs-extra');
const path = require('path');
const packageJson = require('../package.json');

const DIST_PATH = path.resolve(__dirname, `../dist`);

const insertPackageJsonRecursively = function (dirPath) {
  files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      insertPackageJsonRecursively(dirPath + '/' + file);
    } else {
      if (file === 'index.d.ts' && dirPath !== DIST_PATH) {
        const pkgManifest = createPackageManifest(dirPath);
        fs.writeJSON(path.resolve(__dirname, `${dirPath}/package.json`), pkgManifest, {
          spaces: 2,
        });
      }
    }
  });
};

function createPackageManifest(barrelPath) {
  let relPath = toUnixPath(path.relative(DIST_PATH, barrelPath));
  console.log(relPath);
  let relPathReverse = toUnixPath(path.relative(barrelPath, DIST_PATH));
  console.log(relPathReverse);
  let alias = relPath;

  const pkgManifest = {
    name: `${packageJson.name}/${relPath}`,
    types: `${relPathReverse}/${relPath}/index.d.ts`,
    main: `${relPathReverse}/_cjs/${relPath}/index.js`,
    module: `${relPathReverse}/_esm/${relPath}/index.js`,
    es2015: `${relPathReverse}/_esm/${relPath}/index.js`,
  };
  return pkgManifest;
}

function toUnixPath(p) {
  return p.split(path.sep).join(path.posix.sep);
}

insertPackageJsonRecursively(DIST_PATH);
