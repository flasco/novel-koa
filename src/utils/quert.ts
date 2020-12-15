import cheerio from 'cheerio';

export function htmlAnalysis(content: any, instStr = '') {
  let $: cheerio.Cheerio;
  if (typeof content === 'string') {
    $ = cheerio.load(content, { decodeEntities: false })('html');
  } else {
    $ = cheerio(content);
  }

  if (instStr.length < 1) return $;
  const insts = instStr.split('!')[0].split('@');

  while (insts.length > 1) {
    const inst = insts.shift();
    $ = formatX(inst, $);
  }

  const inst = insts[0].split('##')[0];
  const formatApi = inst.includes('.') ? formatX : formatLatest;
  const resX = formatApi(insts[0], $);

  return resX;
}

function formatX(inst: string, $: cheerio.Cheerio) {
  const words = inst.split('.');
  switch (words[0]) {
    case 'class': {
      const rx = $.find('.' + words[1].split(/ +/g).join('.'));
      if (words[2] != null) return rx.eq(+words[2] || 0);
      return rx;
    }
    case 'id': {
      const rx = $.find('#' + words[1]);
      if (words[2] != null) return rx.eq(+words[2] || 0);
      return rx;
    }
    case 'tag': {
      const rx = $.find(words[1]);
      if (words[2] != null) return rx.eq(+words[2] || 0);
      return rx;
    }
  }

  return '';
}

function formatLatest(key: string, $: cheerio.Cheerio) {
  const [inst, regx] = key.split('##');

  switch (inst) {
    case 'text': {
      const x = [];
      for (let i = 0; i < $.length; i++) {
        x.push(cheerio($[i]).text());
      }
      const text = x.join('\n').trim();
      return text.replace(new RegExp(regx, 'gi'), '');
    }
    case 'html': {
      return $.html().replace(new RegExp(regx, 'gi'), '');
    }
    default: {
      const result = $.attr(key);
      return result;
    }
  }
}
