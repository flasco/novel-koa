import { normalCraw } from './request';
import fs from 'fs';
import path from 'path';

const getConfigContent = async () => {
  const sha = '9179d360fd5dcc9325fcb8ae8d98683b0d5c34b0';
  const result = await normalCraw(
    `https://api.github.com/repos/flasco/origin-dist/git/trees/${sha}`
  );

  const configTreeUrl = result.tree.filter(i => i.path === 'configs').pop()?.url;

  if (!configTreeUrl) {
    throw new Error('初始化书源配置失败 - no config dir');
  }

  const configTree = await normalCraw(configTreeUrl);

  return configTree?.tree?.filter(i => i.path.endsWith('.json')).map(i => i.url);
};

export const getRemoteConfigs = async () => {
  if (process.env.APP_ENV === 'development') {
    console.log('local debug!');
    return [
      JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config/19zw.json'), 'utf-8')),
    ];
  }
  const filesUrls: string[] = await getConfigContent();
  if (!filesUrls?.length) {
    throw new Error('初始化书源配置失败 - read config tree content failed');
  }

  const files = await Promise.all(
    filesUrls.map(url => normalCraw(url).then(res => Buffer.from(res.content, 'base64').toString()))
  );
  return files.map((file: string) => JSON.parse(file));
};
