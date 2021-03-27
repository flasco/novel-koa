export = {
  site: 'www.xbiquge.la',
  charset: 'UTF-8',
  search: {
    method: 'post',
    pattern: 'http://www.xbiquge.la/modules/article/waps.php?searchkey=${key}',
    bookList: 'class.grid@tag.tr',
    bookUrl: 'tag.td.0@tag.a@href',
    bookName: 'tag.td.0@tag.a@text',
    latestChapter: 'tag.td.1@tag.a@text',
    author: 'tag.td.2@text',
  },
  detail: {
    latest: 'id.info@tag.p.3@tag.a@text',
    description: "tag.meta[property='og:description']@content",
    imageUrl: "tag.meta[property='og:image']@content",
    author: "tag.meta[property='og:novel:author']@content",
    name: "tag.meta[property='og:novel:book_name']@content",
  },
  list: {
    chapters: 'id.list@tag.a',
    title: 'text',
    href: 'href',
  },
  chapter: {
    title: 'tag.h1@text',
    content: 'id.content@text##亲,点击进.*?广告清新阅读！',
  },
};
