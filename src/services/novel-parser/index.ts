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
    const parser = this.getParser(url);
    return parser.getChapterList(url);
  }

  public async analyseChapter(url: string) {
    const parser = this.getParser(url);
    return parser.getChapterDetail(url);
  }

  public async analyseLatestChapter(url: string) {
    const parser = this.getParser(url);
    return parser.getLatestChapter(url);
  }

  /** TODO: 待修改 */
  public async analyseLatestChapters(url: string) {
    const parser = this.getParser(url);
    return parser.getChapterList(url);
  }
}

export = NovelServices;
