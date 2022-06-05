import cheerio from 'cheerio';
import { htmlTagNames } from 'html-tag-names';

const htmlTagSets = new Set(htmlTagNames);
htmlTagSets.delete('html');
htmlTagSets.delete('content');
htmlTagSets.delete('text');

/** cheerio chinese doc: https://github.com/cheeriojs/cheerio/wiki/Chinese-README */

export function htmlAnalysis(content: any, instStr = '') {
  let $: cheerio.Cheerio;
  if (typeof content === 'string') {
    $ = cheerio.load(content, { decodeEntities: false })('html');
  } else {
    $ = cheerio(content);
  }

  if (instStr.length < 1) {
    return $;
  }
  const insts = instStr.split('@');

  while (insts.length > 1) {
    const inst = insts.shift();
    $ = formatX(inst, $);
  }

  const inst = insts[0].split('##')[0];
  const formatApi = inst.includes('.') || htmlTagSets.has(inst) ? formatX : formatLatest;
  const resX = formatApi(insts[0], $);

  return resX;
}

const numberFilter = (numberInst: string, rx: cheerio.Cheerio) => {
  if (numberInst != null) {
    /**
     * 此处是做过滤用
     * @example
     * !0:!1:!2 // 排除第一个，第二个，第三个元素
     * 注意，目前仅支持 !0:!1:!2 这种格式作为反选，其他格式暂不支持（比如0:1:2，或者是混排的那种 -> !0:2:3）
     * !-1 也不支持
     */
    if (numberInst.startsWith('!')) {
      const filterdIndex = numberInst.split(':').map(i => parseInt(i.slice(1)));
      return rx.filter(ind => !filterdIndex.includes(ind));
    }
    return rx.eq(Number(numberInst) || 0);
  }
  return rx;
};
function formatX(inst: string, $: cheerio.Cheerio) {
  const oldPrefix = ['class', 'id', 'tag'];
  if (oldPrefix.some(prefix => inst.startsWith(prefix))) {
    const words = inst.split('.');
    switch (words[0]) {
      case 'class': {
        const rx = $.find(`.${words[1].split(/ +/g).join('.')}`);
        return numberFilter(words[2], rx);
      }
      case 'id': {
        const rx = $.find(`#${words[1]}`);
        return numberFilter(words[2], rx);
      }
      case 'tag': {
        const rx = $.find(words[1]);
        return numberFilter(words[2], rx);
      }
    }
  } else {
    //
    /**
     * 兼容新的格式（css样式选择的那种）
     * 允许冗余写法，比如已经是 a 标签了，第二次又查找 a 标签。like “bookUrl”
     * @example
     * "author": "p:nth-of-type(1)@span:nth-of-type(2)@text",
     * "bookList": "div.result-item",
     * "bookUrl": ".result-game-item-title-link@a@href",
     * "kind": "p:nth-of-type(2)@span:nth-of-type(2)@text",
     * "lastChapter": ".result-game-item-info-tag-item@a@text",
     * "name": ".result-game-item-title-link@span@text"
     */
    return $.is(inst) ? $ : $.find(inst);
  }

  return $;
}

function formatLatest(key: string, $: cheerio.Cheerio) {
  const [inst, regx, replacedText = ''] = key.split('##');

  switch (inst) {
    case 'textNodes':
    case 'html':
    case 'text': {
      const x = [];
      for (let i = 0; i < $.length; i++) {
        x.push(cheerio($[i]).text());
      }
      const text = x.join('\n').trim();
      return text.replace(new RegExp(regx, 'gi'), replacedText);
    }
    /** 只取 tag 自己的 text，tag children 的内容直接丢掉 */
    case 'ownText': {
      const text = $.contents()
        .filter(function () {
          return this.nodeType === 3;
        })
        .text()
        .trim();
      return text.replace(new RegExp(regx, 'gi'), replacedText);
    }
    default: {
      const result = $.attr(key);
      return result;
    }
  }
}
