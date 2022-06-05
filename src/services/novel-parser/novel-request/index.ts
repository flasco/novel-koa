import { queue, QueueObject } from 'async';
import LRUCache from 'lru-cache';

import { delay } from '@app/utils';
import ConfigCenter from '@app/config-center';
import { craw, postCrawl } from '@app/utils/request';

/**
 * 1. N个书源，N个队列
 * 2. 限制并发数量
 */

const MAX_POOL_SIZE = 10000;
const MAX_POOL_AGE = 20 * 60 * 1000; // 缓存 20 min

const MAX_TASK_SIZE = Math.floor((MAX_POOL_SIZE / ConfigCenter.configs.size) * 0.67);

interface IPayload {
  url: string;
  data?: any;
  method?: 'get' | 'post';
  timeout?: number;
  headers: any;
}
class NoverRequestCore {
  private wrokers: Record<string, QueueObject<IPayload>> = {};
  private workingList: Record<string, Set<string>> = {};
  private resultPool = new LRUCache<string, Buffer>({
    max: MAX_POOL_SIZE,
    maxAge: MAX_POOL_AGE,
  });

  constructor() {
    ConfigCenter.addConfigListener(this.init);
  }

  init = () => {
    ConfigCenter.configs.forEach((config, key) => {
      this.workingList[key] = new Set<string>();
      this.wrokers[key] = queue((payload: IPayload, callback) => {
        const { url } = payload;
        const uniqueKey = this.getUniqueKey(payload);

        this.workingList[key].add(url);
        this.analyzeContent(payload)
          .then(val => this.resultPool.set(uniqueKey, val))
          .catch(() => undefined)
          .finally(() => {
            this.workingList[key].delete(url);
            callback();
          });
      }, config?.concurrency ?? 6);
    });
  };

  private async analyzeContent(payload: IPayload) {
    const { url, data, timeout = 5000, method, headers } = payload;
    if (method === 'get') {
      return craw(url, { timeout, headers });
    }
    return postCrawl(url, data, { timeout, headers });
  }

  private getUniqueKey(payload: IPayload) {
    const { url, method, data = {} } = payload;
    const dataStr =
      typeof data === 'string'
        ? data
        : Object.keys(data)
            .map(k => `${k}:${k[data]}`)
            .join('');
    const uniqueKey = `${method}-${url}_${dataStr}`;
    return uniqueKey;
  }

  private getCurrentSite(payload: IPayload) {
    const { url } = payload;
    const currentSite = ConfigCenter.supportedSites.find(i => url.includes(i));
    if (!currentSite) {
      throw new Error('task create failed, unsupported site');
    }
    return currentSite;
  }

  private pushTask(payload: IPayload, useCache: boolean) {
    const uniqueKey = this.getUniqueKey(payload);
    const currentSite = this.getCurrentSite(payload);

    if (this.workingList[currentSite].has(uniqueKey)) {
      return true;
    }
    if (useCache && this.resultPool.has(uniqueKey)) {
      return true;
    }
    if (this.wrokers[currentSite].length() > MAX_TASK_SIZE) {
      throw new Error('task create failed, over limit');
    }
    this.wrokers[currentSite].push(payload);
    return true;
  }

  async push(payload: IPayload, useCache = true) {
    this.pushTask(payload, useCache);
    const fetchCnt = Math.round((payload.timeout ?? 5000) / 500);
    for (let i = 0; i < fetchCnt; i++) {
      const result = this.resultPool.get(this.getUniqueKey(payload));
      if (result) {
        return result;
      }
      await delay(500);
    }

    throw new Error('wait timeout');
  }
}

/** 全局唯一 */
export = new NoverRequestCore();
