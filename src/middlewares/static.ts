import staticServer from 'koa-static';

import path from 'path';

export = () =>
  staticServer(path.join(__dirname, '../public'), {
    maxage: 1000 * 60 * 60 * 24 * 30,
    hidden: true,
    gzip: true,
  });
