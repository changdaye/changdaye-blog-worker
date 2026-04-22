import { describe, expect, it } from 'vitest';
import { splitFrontmatter, parseSimpleFrontmatter } from '../src/lib/import-frontmatter';

const sample = `---\ntitle: Hello\nsubtitle: World\ndate: 2017-09-06\nauthor: Mr Chang\nheader-img: img/post-bg-swift.jpg\ncatalog: true\ntags:\n  - Java\n  - Spring\n---\n\ncontent`;

describe('frontmatter import helpers', () => {
  it('splits markdown and parses known fields', () => {
    const { frontmatter, body } = splitFrontmatter(sample);
    expect(body.trim()).toBe('content');
    expect(parseSimpleFrontmatter(frontmatter)).toEqual({
      title: 'Hello',
      subtitle: 'World',
      date: '2017-09-06',
      author: 'Mr Chang',
      headerImage: 'img/post-bg-swift.jpg',
      catalog: true,
      tags: ['Java', 'Spring']
    });
  });
});
