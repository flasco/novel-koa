import BaseController from 'pricking-koa/dist/controllers/BaseController';
import BaseValidator from './validators';

class IndexController extends BaseController {
  validator = new BaseValidator();
}

export = IndexController;
