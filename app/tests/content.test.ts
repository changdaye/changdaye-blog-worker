import { describe, expect, it } from 'vitest';
import { buildTopicOverview, estimateReadingMinutes, getAdjacentPosts, getPrimaryTopic, sortPostsByDate, uniqueTags } from '../src/lib/content';

const posts = [
  { slug: 'first', body: 'a '.repeat(220), data: { title: 'First', date: new Date('2017-09-06'), tags: ['Java', 'Spring Boot'] } },
  { slug: 'second', body: 'b '.repeat(420), data: { title: 'Second', date: new Date('2018-01-22'), tags: ['Monitoring', 'Java'] } },
  { slug: 'third', body: 'c '.repeat(640), data: { title: 'Third', date: new Date('2019-11-20'), tags: ['消息队列', 'Java'] } }
] as any[];

describe('content helpers', () => {
  it('sorts posts newest first and flattens unique tags', () => {
    const sorted = sortPostsByDate([...posts]);
    expect(sorted[0].data.date.toISOString()).toContain('2019-11-20');
    expect(uniqueTags(posts)).toEqual(['Java', 'Spring Boot', 'Monitoring', '消息队列']);
  });

  it('computes previous and next links from newest-first order', () => {
    const sorted = sortPostsByDate([...posts]);
    const middle = getAdjacentPosts(sorted, 'second');
    expect(middle.previous?.slug).toBe('third');
    expect(middle.next?.slug).toBe('first');
  });

  it('derives topic and reading metadata', () => {
    expect(getPrimaryTopic(posts[0])).toBe('Java');
    expect(estimateReadingMinutes(posts[2].body)).toBeGreaterThanOrEqual(2);
    expect(buildTopicOverview(posts)[0]).toMatchObject({ tag: 'Java', count: 3 });
  });
});
