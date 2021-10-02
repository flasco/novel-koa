import { Controller, Description, Get, Post } from 'pricking-koa';

import BaseController from '@app/controllers/base/IndexController';
import NovelService from '@app/services/novel-parser';

@Controller('/v3/analyze')
class AnalyzeController extends BaseController {
  novelService = new NovelService();

  @Get('/chapter')
  @Description('解析章节')
  async getChapter() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelService.analyzeChapter(url);

    this.ctx.success(result);
  }

  @Get('/catalog')
  @Description('获取书籍目录')
  async getCatalog() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelService.analyzeList(url);

    this.ctx.success(result);
  }

  @Get('/latest-chapter')
  @Description('获取最新章节')
  async getLatestChapter() {
    const {
      query: { url },
    } = this.ctx;
    /** 通常最新章节的 url 与书籍目录 url 相同，当然也有不同的 */
    this.validator.required(url).supportedUrl(url);
    const result = await this.novelService.analyzeLatestChapter(url);

    this.ctx.success(result);
  }

  @Post('/batch-latest-chapters')
  @Description('批量获取最新章节')
  async getLatestChapters() {
    const { body: list } = this.ctx.request;

    this.validator
      .isNumber(list.length, '不符合规则的参数')
      .required(list[0].url, '不符合规则的参数 - url');
    const result = await this.novelService.analyzeLatestChapters(list);

    this.ctx.success(result);
  }

  @Post('/origin')
  @Description('获取书源最新章节')
  async getOrigin() {
    const { body: list } = this.ctx.request;

    const result = await this.novelService.getOrigin(list);

    this.ctx.success(result);
  }
}

export = AnalyzeController;
