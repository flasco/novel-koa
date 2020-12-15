const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const ghpages = require('gh-pages');
const ora = require('ora');
const path = require('path');

function main() {
  const spinner1 = ora('building...').start();

  execSync('rm -rf ./builder');
  execSync('yarn build');
  execSync('cp ./*.* ./builder && cp ./.gitign* ./builder');

  spinner1.succeed();
  const pkgPath = path.resolve(__dirname, '../builder/package.json');
  const pkg = require(pkgPath);
  pkg.scripts.start = 'node dist/index';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  const spinner = ora('deploy...').start();

  ghpages.publish(
    'builder',
    {
      branch: 'gh-pages',
      dotfiles: true,
      repo: 'https://gitee.com/flasco/pricking-novel.git',
    },
    () => spinner.succeed()
  );
}

main();
