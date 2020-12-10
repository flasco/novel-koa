import fse from 'fs-extra';
import path from 'path';
import { queue } from 'async';
import LRUCache from 'lru-cache';

import { delay } from '@app/utils';
import { configDir } from '@app/constants';

/**
 * 1. N个书源，N个队列
 * 2. 限制并发数量
 */

class NoverRequestCore {
  private wrokers = {};
  private workingList: Record<string, Set<string>> = {};
  private configs = new Map();
  private supportedSites: string[] = [];
  private resultPool = new LRUCache({
    max: 10000,
    maxAge: 4 * 60 * 60,
  });

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const files = fse.readdirSync(configDir);
    files.forEach(p => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require(path.resolve(configDir, p));
      const key = config.site;
      this.configs.set(key, config);
      this.supportedSites.push(key);
      this.workingList[key] = new Set<string>();
      this.wrokers[key] = queue((url: string, callback) => {
        this.workingList[key].add(url);
        this.analyseContent(url)
          .then(val => {
            this.resultPool.set(url, val);
          })
          .catch(() => undefined)
          .finally(() => {
            this.workingList[key].delete(url);
            callback();
          });
      }, config?.concurrency ?? 6);
    });
  }

  private async analyseContent(url: string) {
    await delay(6000);
    return url;
  }

  private pushTask(url: string) {
    const currentSite = this.supportedSites.find(i => url.includes(i));
    if (!currentSite) return false;
    if (this.workingList[currentSite].has(url)) return true;
    if (this.resultPool.has(url)) return true;
    this.wrokers[currentSite].push(url);
    return true;
  }

  async push(url: string) {
    const isSuccess = this.pushTask(url);
    if (!isSuccess) throw new Error('task create failed');
    for (let i = 0; i < 6; i++) {
      const result = this.resultPool.get(url);
      if (result) return result;
      await delay(600);
    }

    throw new Error('wait timeout');
  }
}

/** 全局唯一 */
export = new NoverRequestCore();
