import { describe, expect, it } from 'vitest';
import { parseLegacyPost } from '../src/lib/import-frontmatter';

const sample = `---\nlayout: post\ntitle:      快速搭建个人博客\nsubtitle:   手把手教你在半小时内搭建自己的个人博客\ndate:       2017-02-06\nauthor:     BY\nheader-img: img/home-bg.jpg\ncatalog: true\ntags:\n    - 博客\n    - Jekyll\n---\n\n> 正所谓前人栽树。`;

describe('legacy frontmatter import', () => {
  it('parses legacy post metadata into the new import shape', () => {
    const parsed = parseLegacyPost(sample, '2017-02-06-快速搭建个人博客.md');
    expect(parsed.slug).toBe('快速搭建个人博客');
    expect(parsed.title).toBe('快速搭建个人博客');
    expect(parsed.subtitle).toContain('手把手教你');
    expect(parsed.date).toBe('2017-02-06');
    expect(parsed.author).toBe('BY');
    expect(parsed.headerImage).toBe('img/home-bg.jpg');
    expect(parsed.tags).toEqual(['博客', 'Jekyll']);
    expect(parsed.body).toContain('正所谓前人栽树');
  });
});
