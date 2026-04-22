---
title: "Gitalk 评论插件"
subtitle: "\\\"为博客添加 Gitalk 评论插件 \\\""
description: "背景"
date: 2019-03-14
author: "Mr Chang"
tags:
  - jenkins
  - linux
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 背景
1. Disqus需要翻墙才能正常使用
2. 畅言有广告
3. 2种评论系统都很难统一管理


# 优化
1. 使用Gitalk评论插件 ，

	![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190314101523.png)
	
2. gitalk 使用 Github 帐号登录，界面干净整洁，支持 MarkDown语法。
3. Gitalk 是一个基于 GitHub Issue 和 Preact 开发的评论插件。


# 特性

1. 使用 GitHub 登录
2. 支持多语言 [en, zh-CN, zh-TW, es-ES, fr, ru]
3. 支持个人或组织
4. 无干扰模式（设置 distractionFreeMode 为 true 开启）
5. 快捷键提交评论 （cmd|ctrl + enter）

# 安装

`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">`

  `<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>`
  
  ![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190314101812.png)
  
  具体安装步骤  请参考官方文档 https://github.com/gitalk/gitalk/blob/master/readme-cn.md
  
# 效果

![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190314101938.png)

![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190314102034.png)

# 备注
1. 值得一提的是issus的label限制不能大于50字符

`id: decodeURI(location.pathname),      // Ensure uniqueness and length less than 50`
