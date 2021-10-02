import { PrickingApplication } from 'pricking-koa';
import AV from 'leanengine';

import serverTimerInitial from './cloud';
import configCenter from './config-center';

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 'T51iKKGXz2t9OriABcYSeRac-MdYXbMMI',
  appKey: process.env.LEANCLOUD_APP_KEY || 'n57PqFRFsbwsSddDPO89Xpj5',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '9wfTPNEVmSjkzMICbztkEMc4',
});

if (process.env.LEANCLOUD_APP_ID && !process.env.SELF_WEBSITE) {
  throw new Error('self_website is undefined');
}

new PrickingApplication({
  rootPath: __dirname,
  port: Number(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3001),
  env: process.env.APP_ENV,
  mode: Number(process.env.APP_MODE),
  loadedCallback: () => {
    configCenter
      .initial()
      .then(() => {
        serverTimerInitial();
      })
      .catch(e => {
        console.trace(e);
        process.exit(0);
      });
  },
});
