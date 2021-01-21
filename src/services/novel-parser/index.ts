import { configMap, supportedSites } from '@app/constants';
import { ILatestChaptersReqListItem } from '@app/definitions/novel';

import Parser from './parser';

const initParserMap = () => {
  const parserMap = new Map<string, Parser>();
  supportedSites.forEach(key => {
    parserMap.set(key, new Parser(configMap.get(key)));
  });
  return parserMap;
};

/** 默认 url 都是经过 supported site 判断的 */
class NovelServices {
  private readonly parserMap = initParserMap();

  private getParser = (url: string) => {
    const currentSite = supportedSites.find(i => url.includes(i));
    return this.parserMap.get(currentSite);
  };

  /** 获取书籍目录 */
  public async analyseList(url: string) {
    return this.getParser(url).getChapterList(url);
  }

  /** 获取章节内容 */
  public async analyseChapter(url: string) {
    return this.getParser(url).getChapterDetail(url);
  }

  /** 获取最新章节 */
  public async analyseLatestChapter(url: string) {
    return this.getParser(url).getLatestChapter(url);
  }

  /** 批量获取最新章节 */
  public async analyseLatestChapters(list: ILatestChaptersReqListItem[]) {
    const resLst = await Promise.all(
      list.map(i => this.analyseLatestChapter(i.url).catch(() => null))
    );

    const workQueue = [];
    const markList = [];

    const result = resLst.map((item, index) => {
      const listItem = list[index];
      if (item != null && item !== listItem.title) {
        const catalogUrl = listItem.fullUrl || listItem.url;
        workQueue.push(this.analyseList(catalogUrl).catch(() => null));
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
  public async getBookInfo(url: string) {
    return this.getParser(url).getBookDetail(url);
  }

  /** 批量获取书籍信息 */
  public async getBookInfos(sources: any[]) {
    // return this.getParser(url).getBookDetail(url);
    return sources;
  }
}

export = NovelServices;
