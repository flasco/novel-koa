export = {
  site: 'www.shuquge.com',
  charset: 'utf-8',
  search: {
    method: 'post',
    pattern: 'http://www.shuquge.com/search.php?searchkey=${key}',
    bookList: 'class.bookbox',
    bookName: 'class.bookname@text',
    bookUrl: 'class.bookname@tag.a@href',
    lastChapter: 'class.update@tag.a@text',
    author: 'class.author.0@text##作者：',
  },
  list: {
    chapters: 'class.listmain@tag.dd',
    title: 'tag.a@text',
    href: 'tag.a@href',
  },
  detail: {
    latest: 'class.listmain@tag.a.0@text',
    description: 'class.intro@text',
    imageUrl: 'class.cover@tag.img@src',
    author: 'class.small@tag.span.0@text##作者：',
    name: 'class.info@tag.h2@text',
  },
  chapter: {
    title: 'tag.h1@text',
    content: 'id.content@html',
  },
};
