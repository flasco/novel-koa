const { $, fs } = require('zx');

(async function () {
  await fs.remove('dist');
  await $`yarn tsc -p tsconfig.build.json`;
  await $`yarn tscpaths -p tsconfig.build.json -s ./src -o ./dist`;
  fs.copySync('src/views', 'dist/views');
  const pkg = fs.readJSONSync('./package.json');
  pkg.scripts.start = 'node index.js';
  pkg.devDependencies = {};
  fs.writeJSONSync('dist/package.json', pkg);
})();
