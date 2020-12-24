import { app } from './base';

test('hello world', done => {
  expect(1 + 1).toBe(2);
  app
    .get('/v3/books/api/info')
    .expect(200)
    .end((_, res) => {
      expect(res.text.length).toBeGreaterThan(10);
      done();
    });
});
