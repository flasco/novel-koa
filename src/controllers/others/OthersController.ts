import { Controller, Description, Get } from 'pricking-koa';

import BaseController from '@app/controllers/base/IndexController';
import { craw } from '@app/utils/request';

@Controller('/v3/others')
class AnalyseController extends BaseController {
  @Get('/site-map')
  @Description('当前源')
  async getChapter() {
    this.ctx.success({});
  }

  @Get('/get-image')
  @Description('获取图片资源')
  async getCatalog() {
    const { img } = this.ctx.query;
    const data = await craw(img);
    this.ctx.status = 200;
    this.ctx.type = 'image/png';
    this.ctx.body = data;
  }
}

export = AnalyseController;
