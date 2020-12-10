const { execSync } = require('child_process');
const ghpages = require('gh-pages');
const ora = require('ora');

function main() {
  const spinner1 = ora('building...').start();
  execSync('yarn build');
  spinner1.succeed();

  const spinner = ora('deploy...').start();

  ghpages.publish(
    'builder',
    {
      branch: 'gh-pages',
      dotfiles: true,
      repo: 'https://github.com/flasco/novel-pricking.git'
    },
    () => spinner.succeed()
  );
}

main();
