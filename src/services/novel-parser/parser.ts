import iconv from 'iconv-lite';
import URL from 'url';
import urlencode from 'urlencode';

import nrc from './novel-request';

import { htmlAnalysis } from '@app/utils/quert';
import { ISiteConfig } from '@app/definitions/config';
import { ISearchItem } from '@app/definitions/novel';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
iconv.skipDecodeWarning = true;

class BaseParser {
  config: ISiteConfig;

  constructor(config: ISiteConfig) {
    this.config = config;
    if (!this.config) throw Error('unsupported site');
  }

  async getPageContent(url: string, { useCache = true } = {}) {
    const res = await nrc.push(
      {
        url,
        method: 'get',
        timeout: 5000,
      },
      useCache
    );
    return iconv.decode(res, this.config.charset);
  }

  async getPostContent(url: string, timeout = 5000) {
    const [newUrl, qstring] = url.split('?');
    const res = await nrc.push(
      {
        method: 'post',
        url: newUrl,
        data: qstring,
        timeout,
      },
      true
    );
    return iconv.decode(res, this.config.charset);
  }

  async getChapterList(url: string) {
    const { list } = this.config;

    const content = await this.getPageContent(url);

    const chapters = htmlAnalysis(content, list.chapters);

    const novelList = [];
    const hrefSet = new Set();
    for (let i = chapters.length - 1; i >= 0; i--) {
      const item = chapters[i];
      const title = htmlAnalysis(item, list.title) as string;
      const href = htmlAnalysis(item, list.href) as string;
      if (title.length < 1 || href == null) continue;
      if (!hrefSet.has(href)) {
        novelList.push({
          title,
          url: URL.resolve(url, href).replace(/(.*)(\/.*\/){2}(.*)/, '$1$2$3'),
        });
        hrefSet.add(href);
      }
    }

    hrefSet.clear();
    return novelList.reverse();
  }

  async getLatestChapter(url: string) {
    const res = await this.getPageContent(url);
    return htmlAnalysis(res, this.config.detail.latest);
  }

  async getChapterDetail(url: string) {
    let res = await this.getPageContent(url);

    res = res
      .replace(/&nbsp;/g, '')
      .replace(/<br>/g, '${line}')
      .replace(/<br \/>/g, '${line}')
      .replace(/<br\/>/g, '${line}');

    const { chapter } = this.config;
    const base = htmlAnalysis(res);
    const asContent = htmlAnalysis(base, chapter.content) as string;

    const text = asContent
      .replace(/\${line}/g, '\n')
      .replace(/[ ]+/g, '')
      .replace(/[　]+/g, '')
      .replace(/\n+/g, '\n')
      .replace(/\t+/g, '');

    if (text.trim().length < 5) throw new Error('章节异常');

    const ret = {
      title: htmlAnalysis(base, chapter.title),
      content: text,
    };

    return ret;
  }

  get canSearch() {
    return this.config.search != null;
  }

  async search(keyword: string) {
    const { search, charset } = this.config;
    const { pattern, method, closeEncode } = search;

    const searchUrl = pattern.replace(
      '${key}',
      urlencode.encode(keyword, closeEncode ? 'utf-8' : charset)
    );

    let res;
    if (method === 'post') {
      res = await this.getPostContent(searchUrl, 8000);
    } else {
      res = await this.getPageContent(searchUrl);
    }

    const searchList: ISearchItem[] = [];
    const list = htmlAnalysis(res, search.bookList);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const name = htmlAnalysis(item, search.bookName) as string;
      const author = htmlAnalysis(item, search.author) as string;
      const href = htmlAnalysis(item, search.bookUrl) as string;
      if (href == null || name.length < 1) continue;
      const payload = {
        bookName: name,
        bookUrl: URL.resolve(searchUrl, href),
        author,
        latestChapter: undefined,
      };
      if (search.latestChapter !== '') {
        payload.latestChapter = htmlAnalysis(item, search.latestChapter);
      }
      searchList.push(payload);
    }
    return searchList;
  }

  /** 获取书籍详情 */
  async getBookDetail(url: string) {
    const { latest, description, imageUrl, catalogUrl, author, name } = this.config.detail;
    const res = await this.getPageContent(url);

    const base = htmlAnalysis(res);

    const payload = {
      latest: htmlAnalysis(base, latest),
      desc: (htmlAnalysis(base, description) as string).trim(),
      name: htmlAnalysis(base, name),
      author: htmlAnalysis(base, author),
      image: URL.resolve(this.config.site, htmlAnalysis(base, imageUrl) as string),
      url,
      catalogUrl: url,
    };

    if (catalogUrl != null && catalogUrl !== '') {
      payload.catalogUrl = URL.resolve(this.config.site, htmlAnalysis(base, catalogUrl) as string);
    }

    return payload;
  }
}

export = BaseParser;
