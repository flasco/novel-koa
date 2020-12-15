import { Controller, Description, Get, Post } from 'pricking-koa';

import BaseController from '@app/controllers/common/IndexController';

@Controller('/v3/books')
class AnalyseController extends BaseController {
  @Get('/info')
  @Description('查询书籍详情')
  async getBookInfo() {
    this.ctx.success({});
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
