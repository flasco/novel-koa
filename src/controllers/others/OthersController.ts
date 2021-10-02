import { Controller, Description, Get, Index } from 'pricking-koa';

import BaseController from '@app/controllers/base/IndexController';
import { craw } from '@app/utils/request';
import NovelService from '@app/services/novel-parser';

@Controller('/v3/others')
class OthersController extends BaseController {
  novelService = new NovelService();

  @Index(['/api-doc'])
  async getApiDocHTML() {
    await this.ctx.render('api');
  }

  @Get('/site-map')
  @Description('当前源')
  async getChapter() {
    this.ctx.success(this.novelService.supportedSites);
  }

  @Get('/get-image')
  @Description('获取图片资源')
  async getCatalog() {
    const { img } = this.ctx.query;
    this.validator.required(img, '缺少必传的参数');

    const data = await craw(img);
    this.ctx.status = 200;
    this.ctx.type = 'image/png';
    this.ctx.body = data;
  }
}

export = OthersController;
