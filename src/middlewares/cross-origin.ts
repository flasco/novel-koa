const allowedSite = process.env.APP_ENV === 'development' ? '*' : 'https://*.avosapps.us';

export = () => async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Origin', allowedSite);
  // 允许的header类型
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type');
  // 跨域允许的请求方式
  ctx.set('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');

  // 让options尝试请求快速结束
  if (ctx.method.toLowerCase() === 'options') {
    ctx.body = 200;
  } else {
    await next();
  }
};
