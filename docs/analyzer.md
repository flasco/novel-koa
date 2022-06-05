# [WIP]analyzer design

> 最大可能去兼容现有的书源规则，方便后续的书源 auto-fetch

> http://www.yckceo.com/yuedu/shuyuan/index.html

本文主要记录现有的解析语法规则，便于后续开发 & 维护

## 现有书源 config

```json
{
  "bookSourceComment": "",
  "bookSourceGroup": "通用",
  "bookSourceName": "笔趣阁（shengxu5w）",
  "bookSourceType": 0,
  "bookSourceUrl": "https://m.shengxu5w.com/",
  "bookUrlPattern": "",
  "concurrentRate": "",
  "customOrder": 0,
  "enabled": true,
  "enabledExplore": true,
  "exploreUrl": "",
  "header": "",
  "lastUpdateTime": 1641204441751,
  "loginCheckJs": "",
  "loginUi": "",
  "loginUrl": "",
  "respondTime": 180000,
  "ruleBookInfo": {
    "author": "@css:body > div.synopsisArea > div > a > p@text##作者：(.*)##$1###",
    "coverUrl": "@css:body > div.synopsisArea > div > img@src",
    "intro": "@css:body > div.synopsisArea > p.review@text",
    "lastChapter": "@css:body > div.recommend > div > p:nth-child(1) > a@text",
    "name": "@css:body > header > span@text",
    "tocUrl": "@css:body > div.recommend > h2:nth-child(3) >a @href"
  },
  "ruleContent": {
    "content": "@css:#chaptercontent@all"
  },
  "ruleExplore": {},
  "ruleSearch": {
    "author": "@css:p:nth-child(2)@text##(.*) \\| 作者：(.*)##$2###",
    "bookList": "@css:body > div > div > a ",
    "bookUrl": " @css:a@href",
    "kind": "@css:p:nth-child(2)@text##(.*) \\| 作者：(.*)##$1###",
    "lastChapter": "@css:p:nth-child(3)@text##(.*) \\| 更新：(.*)##$2###",
    "name": "@css:p.title@text"
  },
  "ruleToc": {
    "chapterList": "@css:div[id=chapterlist]>p>a:not(a[style])",
    "chapterName": "a@text",
    "chapterUrl": "a@href"
  },
  "searchUrl": "https://m.shengxu5w.com/s.php?keyword={{key}}",
  "weight": 0
}
```

## 基础功能拆解

### search

#### searchUrl

```json
{
  "searchUrl": "/search.html,{\n    \"method\": \"POST\",\n    \"body\": \"searchtype=all&searchkey={{key}}\",\n    \"headers\": {\n        \"Cookie\": \"Hm_lvt_8c192ce3c567023d62750bd92c7fcfa9={{Math.round((new Date()).getTime()/1000)}}; Hm_lpvt_8c192ce3c567023d62750bd92c7fcfa9={{Math.round((new Date()).getTime()/1000)}}\",\n        \"User-Agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62\"\n    }\n}"
}
```

抽象基础语法 = `[requestUrl],[requestOptions - json]`

```json
{
  "method": "POST",
  "body": "searchtype=all&searchkey={{key}}",
  "headers": {
    "Cookie": "Hm_lvt_8c192ce3c567023d62750bd92c7fcfa9={{Math.round((new Date()).getTime()/1000)}}; Hm_lpvt_8c192ce3c567023d62750bd92c7fcfa9={{Math.round((new Date()).getTime()/1000)}}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62"
  }
}
```

可以发现需要支持 mush 语法，内嵌变量。（可以通过 lodash 的一个 functionin 做到）

#### search rule

```json
{
  "ruleSearch": {
    "bookList": "id.sitembox@tag.dl",
    "name": "tag.h3@text",
    "author": "class.book_other.0@tag.span.0@text",
    "kind": "class.book_other.0@tag.span.2@text",
    "wordCount": "class.book_other.0@tag.span.3@text",
    "lastChapter": "class.book_other.1@tag.a@text",
    "intro": "class.book_des@text",
    "coverUrl": "tag.dt@tag.img@src",
    "bookUrl": "tag.h3@tag.a@href"
  }
}
```

### bookInfo

```json
{
  "ruleBookInfo": {
    "author": "@css:body > div.synopsisArea > div > a > p@text##作者：(.*)##$1###",
    "coverUrl": "@css:body > div.synopsisArea > div > img@src",
    "intro": "@css:body > div.synopsisArea > p.review@text",
    "lastChapter": "@css:body > div.recommend > div > p:nth-child(1) > a@text",
    "name": "@css:body > header > span@text",
    "tocUrl": "@css:body > div.recommend > h2:nth-child(3) >a @href"
  }
}
```

tocUrl = 完整列表 url

### contentInfo

```json
{
  "content": "@css:#chaptercontent@all",
  "nextContentUrl": "text.下章@href||text.下一章@href",
  "prevContentUrl": "text.上章@href||text.上一章@href"
}
```

因为有存在部分书源的章节会拆的很细，需要支持上下章节的翻阅.

然后这里应该还需要支持一下标题的解析，否则标题展示是个问题。

如果是细分章节的书源，还需要想一下怎么处理进度的映射。（url 上应该可以借此判断，如果是这样的话，应该不需要标题解析了）

### TocInfo

> toc = 目录

```json
{
  "ruleToc": {
    "chapterList": "@css:div[id=chapterlist]>p>a:not(a[style])",
    "chapterName": "a@text",
    "chapterUrl": "a@href"
  }
}
```
