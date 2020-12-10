import compose from 'koa-compose';
import AV from 'leanengine';

export = compose([AV.koa2()]);
