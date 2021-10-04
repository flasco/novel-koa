import BaseController from '@pricking/core/dist/controllers/BaseController';
import BaseValidator from './validators';

class IndexController extends BaseController {
  validator = new BaseValidator();
}

export = IndexController;
