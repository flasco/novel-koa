export = {
  site: 'www.19zw.com',
  charset: 'gbk',
  search: {
    method: 'get',
    pattern: 'https://www.19zw.com/modules/article/search.php?searchkey=${key}',
    bookList: 'class.novelslistss@tag.li',
    bookName: 'class.s2@tag.a@text',
    bookUrl: 'class.s2@tag.a@href',
    latestChapter: 'class.s3@tag.a@text',
    author: 'class.s4@text',
  },
  list: {
    chapters: 'id.list@tag.dd@tag.a',
    title: 'text',
    href: 'href',
  },
  detail: {
    description: 'id.intro@text',
    imageUrl: 'id.fmimg@tag.img@src',
    latest: "tag.meta[property='og:novel:latest_chapter_name']@content",
    author: 'id.info@tag.p.0@tag.a.0@text',
    name: 'id.info@tag.h1@text',
  },
  chapter: {
    title: 'tag.h1@text',
    content: 'id.content@html##一九中文网.*最新章节！',
  },
};
