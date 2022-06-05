export = () => async (ctx, next) => {
  if (process.env.APP_ENV === 'development' || /tassel-\d.avosapps.us/.test(ctx.host)) {
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type');
    // 跨域允许的请求方式
    ctx.set('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  }

  // 让options尝试请求快速结束
  if (ctx.method.toLowerCase() === 'options') {
    ctx.body = 200;
  } else {
    await next();
  }
};
