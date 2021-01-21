import { Controller, Description, Get, Post } from 'pricking-koa';

import BaseController from '@app/controllers/common/IndexController';
import NovelServices from '@app/services/novel-parser';

@Controller('/v3/analysis')
class AnalyseController extends BaseController {
  novelServices = new NovelServices();

  @Get('/chapter')
  @Description('解析章节')
  async getChapter() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelServices.analyseChapter(url);

    this.ctx.success(result);
  }

  @Get('/catalog')
  @Description('获取书籍目录')
  async getCatalog() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelServices.analyseList(url);

    this.ctx.success(result);
  }

  @Get('/latest-chapter')
  @Description('获取最新章节')
  async getLatestChapter() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelServices.analyseLatestChapter(url);

    this.ctx.success(result);
  }

  @Post('/latest-chapters')
  @Description('批量获取最新章节')
  async updateBookShelf() {
    const { body } = this.ctx.request;
    const result = await this.novelServices.analyseLatestChapters(body);

    this.ctx.success(result);
  }
}

export = AnalyseController;
