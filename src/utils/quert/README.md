> 声明 - 参照 legado 书源规则进行解析（子集，未实现所有语法）

# 2.0 写法

> tag.div@text

- @为分隔符，用来分隔获取规则
- 每段规则可分为 3 段
- 第一段是类型，如 `class，id，tag` 等， ~~`children` 获取所有子标签，不需要第二段和第三段~~
- 第二段是名称。
- 第三段是位置，`class，tag` 会获取到多个，所以要加位置，`id` 类型不要加，如不加位置会获取所有。
- 位置正数从 0 开始，0 是第一个。
- 如为负数则是取倒数的值，-1 为最倒数第一个，-2 为倒数第二个。
- `!` 是排除，有些位置不符合需要排除用 `!`，后面的序号用 `:` 隔开，0 是第 1 个，负数为倒数序号，-1 最后一个，-2 倒数第 2 个，依次。
- `@` 的最后一段为获取内容，如 `text，textNodes，href，src，html` 等。
- ~~如果有不同网页的规则可以用 | 或 & 分隔 或 %~~
- ~~`|`会以第一个取到值的为准~~
- ~~`&` 会合并所有规则取到的值~~
- ~~`%` 会依次取数，如三个列表，先取列表 1 的第一个，再取列表 2 的第一个，再取列表 3 的第一个，再取列表 1 的第 2 个~~
- 如需要正则替换在最后加上，格式为：`##{{正则表达式}}[##{{替换的文案}}]`
  - 中括号括起来的是可选部分，如果是直接过滤掉广告之类的话。
- 例：`class.odd.0@tag.a.0@text|tag.dd.0@tag.h1@text##全文阅读`
- 例：`class.odd.0@tag.a.0@text&tag.dd.0@tag.h1@text##全文阅读##我是替换的文案`

# 3.0 写法

语法见 https://blog.csdn.net/hou_angela/article/details/80519718

必须以 `@css:` 开头

标准规范与实现库 [Package org.jsoup.select](https://jsoup.org/apidocs/org/jsoup/select/Selector.html)

在线测试 [Try jsoup online](https://try.jsoup.org/)

注意：获取内容可用 text, ~~textNodes~~, ~~ownText~~, html, ~~all~~, href, src 等（删除的是没经过测试的，应该不支持）
