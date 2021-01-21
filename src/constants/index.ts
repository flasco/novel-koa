import path from 'path';
import fse from 'fs-extra';
import { ISiteConfig } from '@app/definitions/config';

const initConfigs = () => {
  const configPath = path.resolve(__dirname, '../config');
  const files = fse.readdirSync(configPath);
  const configs = new Map<string, ISiteConfig>();
  const supportedSites = [];
  files.forEach(p => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(path.resolve(configPath, p));
    const key = config.site;
    supportedSites.push(key);
    configs.set(key, config);
  });
  return { configs, supportedSites };
};

export const { configs: configMap, supportedSites } = initConfigs();
