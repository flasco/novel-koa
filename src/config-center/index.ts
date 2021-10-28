import type { ISiteConfig } from '@app/definitions/config';
import { getRemoteConfigs } from '@app/utils/config-read';

class ConfigCenter {
  configs = new Map<string, ISiteConfig>();
  supportedSites: string[] = [];

  listeners = [];

  async initial() {
    console.log('loading config...');
    this.configs.clear();

    const configRaws = await getRemoteConfigs();

    console.log(
      'novel config loaded, current support site:',
      configRaws.map(i => i.site)
    );

    configRaws.forEach(config => {
      const key = config.site;
      this.supportedSites.push(key);
      this.configs.set(key, config);
    });

    this.listeners.forEach(cb => {
      cb?.();
    });
  }

  addConfigListener(cb: () => void) {
    this.listeners.push(cb);
  }
}

export = new ConfigCenter();
