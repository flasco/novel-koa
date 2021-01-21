import { configMap, supportedSites } from '@app/constants';

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

  public async analyseList(url: string) {
    return this.getParser(url).getChapterList(url);
  }

  public async analyseChapter(url: string) {
    return this.getParser(url).getChapterDetail(url);
  }

  public async analyseLatestChapter(url: string) {
    return this.getParser(url).getLatestChapter(url);
  }

  /** TODO: 待修改 */
  public async analyseLatestChapters(url: string) {
    return this.getParser(url).getChapterList(url);
  }

  public async getBookInfo(url: string) {
    return this.getParser(url).getBookDetail(url);
  }

  public async getBookInfos(sources: any[]) {
    // return this.getParser(url).getBookDetail(url);
    return sources;
  }
}

export = NovelServices;
