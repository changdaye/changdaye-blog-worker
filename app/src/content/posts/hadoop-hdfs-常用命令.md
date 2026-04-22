---
title: "hadoop hdfs 常用命令"
subtitle: "\\\"分布式文件系统，可以存储海量文件\\\""
description: "说明"
date: 2018-04-03
author: "Mr Chang"
tags:
  - hadoop
  - hdfs
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 说明

通过上篇博客，我们已经搭建好了单机版的hdfs，下面介绍下常用命令。

* 上传机器本地的一个文件到HDFS中

		hadoop  fs  -put  /本地文件  /hdfs的目录
		(-copyFromLocal)
		
		比如：
		hadoop fs  -put /root/a.txt   /

* 从HDFS中下载一个文件到本地机器

		hadoop  fs  -get  /hdfs路径   /本地路径
		(-copyToLocal)
		    
		比如：
		hadoop  fs  -get  /a.txt  /root

* 在HDFS中创建目录
		
		hadoop  fs  -mkdir  /aaa/bbb 

* 查看HDFS中指定目录下的信息
		
		hadoop  fs  -ls  /

* 删除HDFS中的一个文件
		
		hadoop  fs  -rm  /spark-2.2.0-bin-hadoop2.7.tgz

* 删除HDFS中的一个空文件夹
		
		hadoop fs -rmdir /aaa/bbb

* 删除HDFS中的整个文件夹
		
		hadoop  fs  -rm  -r  /aaa

* 移动HDFS中的文件或目录到另一个路径； 或者改名
		
		hadoop  fs  -mv  /aaa/bbb  /ccc 
    	hadoop  fs  -mv  /a.txt  /aaa/a.txt.o

* 查看HDFS中文件的内容（文本文件）
		
		hadoop  fs  -cat  /aaa/a.txt.o
		hadoop  fs  -tail  /aaa/a.txt.o     查看a.txt.o中的末尾27（？）行
		hadoop  fs  -tail -f  /aaa/a.txt.o   实时监视a.txt.o中新增的内容

* 追加一个本地文件内容到HDFS中已存在的文件中
		
		hadoop  fs  -appendToFile  /root/a.txt   /aaa/a.txt.o
* 修改HDFS中的文件权限

		修改所属用户和所属组：
		hadoop fs -chown -R angelababy:mygirls /aaa
		修改权限：
		hadoop fs -chmod 777 /aaa
