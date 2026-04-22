# changdaye-blog-worker

一个基于 **Astro + Cloudflare Workers** 的中文技术博客重构项目。

当前仓库已经将旧博客 `changdaye.github.io` 的历史文章迁入新的站点结构，并使用新的知识库 / 专栏风页面继续承载内容。

> English backup: see [README.en.md](./README.en.md)

## 当前状态

目前项目已经完成：

- 基于 Astro 的全新静态博客结构
- Cloudflare Workers 静态资源部署
- 全量旧文章迁入新站内容模型
- 文章配图尽量本地化为静态资源
- 首页专题入口 + 最新文章流
- 文章页左侧目录 / 中间正文 / 右侧信息栏
- 标签页、About、RSS、404 页面

## 本地开发

```bash
cd app
npm install
npm run check
npm run build
```

## 部署到 Cloudflare Workers

```bash
cd app
npm install
npm run build
npm run deploy
```

## 仓库说明

- `app/`：新的 Astro 博客工程
- `app/src/content/posts/`：博客文章内容
- `app/public/images/`：本地静态图片资源
- `docs/`：设计与实现计划文档

## 备注

旧仓库 `changdaye.github.io` 现在主要作为历史内容参考来源；新的页面结构、样式、组件和部署方式都以当前仓库为准。
