import { describe, expect, it } from 'vitest';
import { buildLocalImagePath, replaceMarkdownImageUrl } from '../src/lib/images';

describe('selected image localization helpers', () => {
  it('maps remote urls into deterministic local paths', () => {
    const url = 'https://cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg';
    expect(buildLocalImagePath(url)).toBe('/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg');
    expect(replaceMarkdownImageUrl(`![](${url})`)).toBe('![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg)');
  });
});
