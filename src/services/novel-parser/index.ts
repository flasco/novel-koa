import ConfigCenter from '@app/config-center';
import { ILatestChaptersReqListItem, ISearchItem, ISearchRetItem } from '@app/definitions/novel';

import Parser from './parser';

const initSearchParser = (parserMap: Map<string, Parser>) => {
  const mapper: Parser[] = [];
  parserMap.forEach(value => {
    if (value.canSearch) {
      mapper.push(value);
    }
  });

  return mapper;
};

/** 默认 url 都是经过 supported site 判断的 */
class NovelServices {
  supportedSites = ConfigCenter.supportedSites;
  parserMap: Map<string, Parser>;
  searchParsers: Parser[];
  constructor() {
    this.parserMap = new Map<string, Parser>();
    ConfigCenter.configs.forEach((value, key) => {
      this.parserMap.set(key, new Parser(value));
    });
    this.searchParsers = initSearchParser(this.parserMap);
  }

  private getParser = (url: string) => {
    const currentSite = this.supportedSites.find(i => url.includes(i));
    return this.parserMap.get(currentSite);
  };

  async searchBook(keyword: string) {
    const workArr = this.searchParsers.map(parser =>
      parser.search(keyword).catch(() => [] as ISearchItem[])
    );

    const resultArr = await Promise.all(workArr);
    const result: ISearchRetItem[] = [];
    const nameMap = new Map<string, number>();
    let ptr = 0;

    resultArr.forEach(items =>
      items.forEach(item => {
        const { bookName, bookUrl, author } = item;
        // 如果是当前不支持的书源就直接滤掉
        if (!this.supportedSites.some(site => bookUrl.includes(site))) {
          return;
        }

        const uniqueKey = `${bookName}${author}`;
        const position = nameMap.get(uniqueKey);

        if (position == null) {
          nameMap.set(uniqueKey, ptr);
          result[ptr++] = {
            bookName,
            author,
            plantformId: 0,
            source: [bookUrl],
          };
        } else {
          result[position].source.push(bookUrl);
        }
      })
    );

    return result;
  }

  /** 获取书籍目录 */
  async analyzeList(url: string) {
    return this.getParser(url).getChapterList(url);
  }

  /** 获取章节内容 */
  async analyzeChapter(url: string) {
    return this.getParser(url).getChapterDetail(url);
  }

  /** 获取最新章节 */
  async analyzeLatestChapter(url: string) {
    return this.getParser(url).getLatestChapter(url);
  }

  /** 批量获取最新章节 */
  async analyzeLatestChapters(list: ILatestChaptersReqListItem[]) {
    const resLst = await Promise.all(
      list.map(i => this.analyzeLatestChapter(i.url).catch(() => null))
    );

    const workQueue = [];
    const markList = [];

    const result = resLst.map((item, index) => {
      const listItem = list[index];
      if (item != null && item !== listItem.title) {
        const catalogUrl = listItem.catalogUrl || listItem.url;
        workQueue.push(this.analyzeList(catalogUrl).catch(() => null));
        markList.push(index);
        return {
          title: item,
          list: [],
        };
      } else {
        return null;
      }
    });

    const lists = await Promise.all(workQueue);

    lists.forEach(curList => {
      const index = markList.shift();
      if (curList != null) {
        result[index].list = curList;
      } else {
        result[index] = null;
      }
    });

    return result;
  }

  /** 获取书籍信息 */
  async getBookInfo(url: string) {
    return this.getParser(url).getBookDetail(url);
  }

  /** 批量获取书籍信息，包括最新章节 */
  async getBookInfos(sources: string[]) {
    const stamp = Date.now();
    const workArr = sources.map((url, index) =>
      this.getBookInfo(url)
        .then((info: any) => {
          info.plantformId = index;
          info.stamp = Date.now() - stamp;
          return info;
        })
        .catch(() => null)
    );

    const results = await Promise.all(workArr);

    return results.filter(i => Boolean(i)).sort((a, b) => a.stamp - b.stamp);
  }

  /** 获取书源信息 */
  async getOrigin(catalogUrls: string[]) {
    const workQueue = catalogUrls.map(item => this.getBookInfo(item).catch(() => null));
    const resLst = await Promise.all(workQueue);
    const result = resLst
      .filter(i => Boolean(i))
      .map((i, ind) => ({
        catalogUrl: i.catalogUrl,
        url: catalogUrls[ind],
        latestChapter: i.latest || '获取失败',
      }));
    return result;
  }
}

export = NovelServices;
