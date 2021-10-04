import axios from 'axios';
import https from 'https';
import { delay } from '.';

const baseAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  responseType: 'arraybuffer', // 不对抓取的数据进行编码解析
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
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
    console.trace(error.message, url, payload);
    throw new Error(`postCrawl failed, ${error.message}`);
  }
}

export async function craw(url: string, timeout = 5000) {
  try {
    const result = await baseAxios.get<Buffer>(url, {
      cancelToken: getSource(timeout),
    });
    return result.data;
  } catch (error) {
    console.trace(error.message, url);
    throw new Error(`craw failed, ${error.message}`);
  }
}

export async function normalCraw<T = any>(url: string, timeout = 5000) {
  for (let i = 0; i <= 3; i++) {
    try {
      const { data } = await axios.get<T>(url, {
        cancelToken: getSource(timeout),
      });
      return data;
    } catch (error) {
      await delay(2000);
      console.log(`请求失败，第${i + 1}次重试...`);
    }
  }
  throw new Error('请求失败');
}
