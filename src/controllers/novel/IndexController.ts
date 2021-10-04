import { Controller, Description, Index } from '@pricking/core';

import BaseController from '@app/controllers/base/IndexController';
import configCenter from '@app/config-center';

@Controller('')
class AnalyzeController extends BaseController {
  @Index(['/'])
  @Description('首页')
  async getIndexHTML() {
    await this.ctx.render('home', {
      currentTime: new Date(),
      supportedSites: configCenter.supportedSites,
    });
  }
}

export = AnalyzeController;
