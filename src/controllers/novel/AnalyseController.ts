import { Controller, Description, Get, Post } from 'pricking-koa/dist/utils/decorator';

import BaseController from '@app/controllers/common/IndexController';
import NovelServices from '@app/services/novel-parser';

@Controller('/v3/analysis')
class AnalyseController extends BaseController {
  @Get('/chapter')
  @Description('解析章节')
  async getChapter() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await new NovelServices().analyseChapter(url);

    this.ctx.success(result);
  }

  @Get('/catalog')
  @Description('解析目录')
  async getCatalog() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await new NovelServices().analyseList(url);

    this.ctx.success(result);
  }

  @Get('/latest-chapter')
  @Description('获取更新情况(最新章节)')
  async getLatestChapter() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await new NovelServices().analyseLatestChapter(url);

    this.ctx.success(result);
  }

  @Post('/update-shelf')
  @Description('获取更新情况(最新章节)')
  async updateBookShelf() {
    const {
      query: { url },
    } = this.ctx;
    this.validator.required(url).supportedUrl(url);
    const result = await new NovelServices().analyseLatestChapters(url);

    this.ctx.success(result);
  }
}

export = AnalyseController;
