import path from 'path';
import fse from 'fs-extra';

const initConfigs = () => {
  const files = fse.readdirSync(__dirname);
  const configs = new Map<string, Record<string, any>>();
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
