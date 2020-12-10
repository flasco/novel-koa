import { Controller, Get } from '@flasco/pricking-koa/dist/utils/decorator';

import BaseController from '@app/controllers/common/IndexController';
import novelRequest from '@app/services/novel-request';

@Controller('cat')
class IndexController extends BaseController {
  nrc = novelRequest;
  
  @Get('say')
  async speak() {
    const { query } = this.ctx;
    const result = await this.nrc.push(query.url);
    this.ctx.success(result);
  }
}

export = IndexController;
