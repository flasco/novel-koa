export interface ISiteConfig {
  site: string;
  concurrency?: number;
  charset: string;
  search: {
    method: string;
    pattern: string;
    closeEncode?: string;
    bookList: string;
    bookName: string;
    bookUrl: string;
    latestChapter: string;
    author: string;
  };
  list: {
    chapters: string;
    title: string;
    href: string;
  };
  detail: {
    latest: string;
    description: string;
    catalogUrl?: string;
    imageUrl: string;
    author: string;
    name: string;
  };
  chapter: {
    title: string;
    content: string;
    next?: string;
    prev?: string;
  };
}
