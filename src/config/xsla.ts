export = {
  site: 'www.xinxs.la',
  charset: 'UTF-8',
  search: {
    method: 'get',
    pattern: 'https://www.xinxs.la/ar.php?keyWord=${key}',
    bookList: 'class.txt-list@tag.li',
    bookUrl: 'class.s2@tag.a@href',
    bookName: 'class.s2@tag.a@text',
    latestChapter: 'class.s3@text',
    author: 'class.s4@text',
  },
  detail: {
    latest: "tag.meta[property='og:novel:latest_chapter_name']@content",
    description: "tag.meta[property='og:description']@content",
    imageUrl: "tag.meta[property='og:image']@content",
    author: "tag.meta[property='og:novel:author']@content",
    name: "tag.meta[property='og:novel:book_name']@content",
  },
  list: {
    chapters: 'class.section-box@tag.a',
    title: 'text',
    href: 'href',
  },
  chapter: {
    title: 'tag.h1@text',
    content: 'id.content@text##章节错误.*?刷新页面。',
  },
};
