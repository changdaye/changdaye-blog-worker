import { describe, expect, it } from 'vitest';
import { postPath, tagPath } from '../src/lib/routes';

describe('routes', () => {
  it('builds canonical post and tag paths', () => {
    expect(postPath('hello-world')).toBe('/posts/hello-world/');
    expect(tagPath('Spring Boot')).toBe('/tags/spring-boot/');
  });
});
