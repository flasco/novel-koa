import { supportedSites } from '@app/constants';
import Validator from 'pricking-koa/dist/lib/validator';

class BaseValidator extends Validator {
  supportedUrl(url: string, msg = '暂不支持的网站') {
    if (!supportedSites.some(site => url.includes(site))) {
      throw new Error(msg);
    }

    return this;
  }
}

export = BaseValidator;
