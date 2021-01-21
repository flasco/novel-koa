export interface ILatestChaptersReqListItem {
  title: string;
  /** 书籍url */
  url: string;
  /** 目录url，大部分情况下fullUrl = url */
  fullUrl?: string;
}
