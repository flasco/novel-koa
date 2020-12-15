import path from 'path';
import fse from 'fs-extra';
import { ISiteConfig } from '@app/definitions/config';

const initConfigs = () => {
  const files = fse.readdirSync(__dirname);
  const configs = new Map<string, ISiteConfig>();
  const supportedSites = [];
  files.forEach(p => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(path.resolve(__dirname, p));
    const key = config.site;
    supportedSites.push(key);
    configs.set(key, config);
  });
  return { configs, supportedSites };
};

export const { configs: configMap, supportedSites } = initConfigs();
