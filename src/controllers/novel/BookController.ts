import { Controller, Description, Get, Post } from 'pricking-koa';

import BaseController from '@app/controllers/base/IndexController';
import NovelServices from '@app/services/novel-parser';

@Controller('/v3/books')
class AnalyseController extends BaseController {
  novelServices = new NovelServices();

  @Get('/info')
  @Description('查询书籍详情')
  async getBookInfo() {
    const { url } = this.ctx.query;

    const result = await this.novelServices.getBookInfo(url);
    this.ctx.success(result);
  }

  @Post('/infos')
  @Description('批量查询书籍详情')
  async getBookInfos() {
    const { body: sources = [] } = this.ctx.request;

    this.validator.isNumber(sources.length, '不符合规则的参数');

    const results = await this.novelServices.getBookInfos(sources);
    this.ctx.success(results);
  }

  @Get('/search')
  @Description('搜索')
  async searchBook() {
    const { keyword } = this.ctx.query;
    this.validator.required(keyword, '请输入关键字');

    const result = await this.novelServices.searchBook(keyword);
    this.ctx.success(result);
  }
}

export = AnalyseController;
