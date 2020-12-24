import views from 'koa-views';
import path from 'path';

export = () => views(path.join(__dirname, '../views'), { extension: 'ejs' });
