---
title: "jenkins导致磁盘占满问题"
subtitle: "\\\"jenkins导致磁盘占满问题 \\\""
description: "背景"
date: 2019-03-04
author: "Mr Chang"
tags:
  - jenkins
  - linux
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 背景

1. 今天登陆jenkins提示磁盘空间不足，且构建发生错误

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20190304165846.png)
	

# 排查问题

1. cd到jenkins 安装目录
2. 执行df -h 发现root目录沾满
3. 执行 du -ah --max-depth=1 发现是.jenkins 目录占用的
4. 逐渐cd 进去，并执行 du -ah --max-depth=1 最终发现是jobs目录占用过大

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20190304170221.png)

5. 手动删除其中的构建历史
6. 异常恢复


# 优化解决

1. jenkins在创建构建项目的时候，直接设置好构建历史保留天数等，见下图

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20190304170406.png)
