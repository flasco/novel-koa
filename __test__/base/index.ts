import { AppMode, PrickingApplication } from 'pricking-koa';
import supertest from 'supertest';
import path from 'path';

const application = new PrickingApplication({
  rootPath: path.resolve(__dirname, '../../src'),
  env: 'development',
  port: 0,
  mode: AppMode.Test,
});

export const app = supertest(application.start());
