export = {
  site: 'www.hgq26.com',
  charset: 'gbk',
  search: {
    method: 'post',
    pattern: 'https://www.hgq26.com/modules/article/search.php?searchkey=${key}',
    bookList: 'class.grid searall@tag.tr!0',
    bookName: 'tag.a.0@text',
    bookUrl: 'tag.a.0@href',
    latestChapter: 'tag.a.1@text',
    author: 'class.odd.1@text',
  },
  list: {
    chapters: 'id.readerlist@tag.li',
    title: 'tag.a@text',
    href: 'tag.a@href',
  },
  detail: {
    latest: 'id.newlist@tag.li.0@tag.a@text',
    description: 'id.bookintro@text',
    imageUrl: 'id.bookimg@tag.img@src',
    author: 'id.author@text',
    catalogUrl: 'id.reader@tag.a@href',
    name: 'class.bookright@tag.h1@text',
  },
  chapter: {
    title: 'tag.h1@text',
    content: 'id.content@html##你是天才.*',
  },
};
