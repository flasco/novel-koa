const { $, fs } = require('zx');

(async function () {
  await fs.remove('dist');
  await $`yarn tsc -p tsconfig.build.json`;
  await $`yarn tscpaths -p tsconfig.build.json -s ./src -o ./dist`;
  await fs.copySync('src/views', 'dist/views');
})();
