import { describe, expect, it } from 'vitest';
import { sortPostsByDate, uniqueTags } from '../src/lib/content';

const posts = [
  { data: { date: new Date('2017-09-06'), tags: ['Java', 'Spring Boot'] } },
  { data: { date: new Date('2019-11-20'), tags: ['消息队列', 'Java'] } }
] as any[];

describe('content helpers', () => {
  it('sorts posts newest first and flattens unique tags', () => {
    const sorted = sortPostsByDate([...posts]);
    expect(sorted[0].data.date.toISOString()).toContain('2019-11-20');
    expect(uniqueTags(posts)).toEqual(['Java', 'Spring Boot', '消息队列']);
  });
});
