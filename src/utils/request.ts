import axios from 'axios';
import https from 'https';

const baseAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  responseType: 'arraybuffer', //不对抓取的数据进行编码解析
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    Connection: 'keep-alive',
    'content-type': 'application/x-www-form-urlencoded',
    Referer: 'https://www.baidu.com',
  },
});

const getSource = (timeout: number) => {
  const source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, timeout);
  return source.token;
};

export async function postCrawl(url: string, payload: any, timeout = 5000) {
  try {
    const result = await baseAxios.post<Buffer>(url, payload, {
      cancelToken: getSource(timeout),
    });
    return result.data;
  } catch (error) {
    throw new Error('postCrawl failed, ' + error.message);
  }
}

export async function craw(url: string, timeout = 5000) {
  try {
    const result = await baseAxios.get<Buffer>(url, {
      cancelToken: getSource(timeout),
    });
    return result.data;
  } catch (error) {
    throw new Error('craw failed, ' + error.message);
  }
}
