import { queue, QueueObject } from 'async';
import LRUCache from 'lru-cache';

import { delay } from '@app/utils';
import { configMap, supportedSites } from '@app/config';
import { craw } from '@app/utils/request';

/**
 * 1. N个书源，N个队列
 * 2. 限制并发数量
 */

const MAX_POOL_SIZE = 10000;
const MAX_POOL_AGE = 2 * 60 * 60;

const MAX_TASK_SIZE = Math.floor((MAX_POOL_SIZE / configMap.size) * 0.67);

class NoverRequestCore {
  private wrokers: Record<string, QueueObject<string>> = {};
  private workingList: Record<string, Set<string>> = {};
  private resultPool = new LRUCache<string, Buffer>({
    max: MAX_POOL_SIZE,
    maxAge: MAX_POOL_AGE,
  });

  constructor() {
    this.init();
  }

  private init() {
    configMap.forEach((config, key) => {
      this.workingList[key] = new Set<string>();
      this.wrokers[key] = queue((url: string, callback) => {
        this.workingList[key].add(url);
        this.analyseContent(url)
          .then(val => this.resultPool.set(url, val))
          .catch(() => undefined)
          .finally(() => {
            this.workingList[key].delete(url);
            callback();
          });
      }, config?.concurrency ?? 6);
    });
  }

  private async analyseContent(url: string) {
    return craw(url, 5000);
  }

  private pushTask(url: string) {
    const currentSite = supportedSites.find(i => url.includes(i));
    if (!currentSite) throw new Error('task create failed, unsupported site');
    if (this.workingList[currentSite].has(url)) return true;
    if (this.resultPool.has(url)) return true;
    if (this.wrokers[currentSite].length() > MAX_TASK_SIZE) {
      throw new Error('task create failed, over limit');
    }
    this.wrokers[currentSite].push(url);
    return true;
  }

  async push(url: string) {
    this.pushTask(url);
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
