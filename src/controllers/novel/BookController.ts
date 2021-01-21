import { Controller, Description, Get, Post } from 'pricking-koa';

import BaseController from '@app/controllers/common/IndexController';
import NovelServices from '@app/services/novel-parser';

@Controller('/v3/books')
class AnalyseController extends BaseController {
  novelServices = new NovelServices();

  @Get('/info')
  @Description('查询书籍详情')
  async getBookInfo() {
    const currentTime = new Date().toDateString();
    await this.ctx.render('home', {
      currentTime,
    });
  }

  @Post('/infos')
  @Description('批量查询书籍详情')
  async getBookInfos() {
    const { sources = [] } = this.ctx.request.body;

    const results = await this.novelServices.getBookInfos(sources);
    this.ctx.success(results);
  }

  @Get('/search')
  @Description('搜索')
  async searchBook() {
    this.ctx.success({});
  }

  @Post('/origin')
  @Description('查询书籍书源详情')
  async getBookOriginDetail() {
    this.ctx.success({});
  }
}

export = AnalyseController;
