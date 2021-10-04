import ConfigCenter from '@app/config-center';
import Validator from '@pricking/core/dist/lib/validator';

class BaseValidator extends Validator {
  supportedUrl(url: string, msg = '暂不支持的网站') {
    if (!ConfigCenter.supportedSites.some(site => url.includes(site))) {
      throw new Error(msg);
    }

    return this;
  }
}

export = BaseValidator;
