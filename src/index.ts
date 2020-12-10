import './path';
import { PrickingApplication } from '@flasco/pricking-koa'

new PrickingApplication({
  baseUrl: __dirname,
  port: 9205,
  env: 'development'
})