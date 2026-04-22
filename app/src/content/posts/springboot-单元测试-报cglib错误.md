---
title: "springboot 单元测试 报cglib错误"
subtitle: "\\\"从controller正常执行不报错，只有单元测试报错 \\\""
description: "Caused by: java.lang.IllegalStateException:"
date: 2018-01-19
author: "Mr Chang"
tags:
  - springboot
  - cglib
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---Caused by: java.lang.IllegalStateException:
	 Cannot enable lazy loading because CGLIB is not available. 
	 Add CGLIB to your classpath.
	
CGLIB依赖很明显是加了的，所以考虑到是不是版本不兼容问题。


解决：

升级CGLIB包版本，我用的2.2就报错，升级到3.1就好了。


	<dependency>
	
	<groupId>cglib</groupId>
	
	<artifactId>cglib</artifactId>
	
	<version>3.1</version>
	
	</dependency>
