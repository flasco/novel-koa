import type { ISiteConfig } from '@app/definitions/config';
import { getRemoteConfigs } from '@app/utils/config-read';
import { getCookie } from '@app/utils/request';

class ConfigCenter {
  configs = new Map<string, ISiteConfig>();
  supportedSites: string[] = [];
  private initialized = false;

  listeners = [];

  async initial() {
    console.log('loading config...');
    this.configs.clear();

    const configRaws = await getRemoteConfigs();

    console.log(
      'novel config loaded, current support site:',
      configRaws.map(i => i.site)
    );

    const worker = configRaws.map(async config => {
      const key = config.site;
      try {
        const cookie = await getCookie(key, { timeout: 8000 });
        config.search.customHeader = JSON.stringify({ cookie });
      } catch (error) {
        console.log(`${key} - init cookie failed`);
      }
      this.supportedSites.push(key);
      this.configs.set(key, config);
    });

    Promise.all(worker).then(() => {
      this.initialized = true;
      this.listeners.forEach(cb => {
        cb?.();
      });
      this.listeners = [];
    });
  }

  addConfigListener(cb: () => void) {
    !this.initialized && this.listeners.push(cb);
  }
}

export = new ConfigCenter();
