export interface ILatestChaptersReqListItem {
  /** 章节名 */
  title: string;
  /** 书籍url */
  url: string;
  /** 目录url，大部分情况下catalogUrl = url */
  catalogUrl?: string;
}

export interface ISearchItem {
  /** 书籍名字 */
  bookName: string;
  /** 书籍url */
  bookUrl: string;
  /** 作者 */
  author: string;
  /** 最新章节名 */
  latestChapter: string;
}

export interface ISearchRetItem {
  bookName: string;
  author: string;
  plantformId: number;
  source: string[];
}
