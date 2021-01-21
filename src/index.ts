import './path';
import { AppMode, PrickingApplication } from 'pricking-koa';
import AV from 'leanengine';

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 'T51iKKGXz2t9OriABcYSeRac-MdYXbMMI',
  appKey: process.env.LEANCLOUD_APP_KEY || 'n57PqFRFsbwsSddDPO89Xpj5',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || '9wfTPNEVmSjkzMICbztkEMc4',
});

if (process.env.LEANCLOUD_APP_ID) {
  if (!process.env.SELF_WEBSITE) throw new Error('self_website is undefined');
}

const PORT = +(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3001);

new PrickingApplication({
  rootPath: __dirname,
  port: PORT,
  env: 'development',
  mode: AppMode.Debug,
});
