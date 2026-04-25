---
title: "hbase的介绍与安装"
subtitle: "\\\"nosql 数据库\\\""
description: "介绍"
date: 2018-04-08
author: "Mr Chang"
tags:
  - hadoop
  - hbase
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 介绍

HBASE是一个数据库----可以提供数据的实时随机读写

HBASE与mysql、oralce、db2、sqlserver等关系型数据库不同，它是一个NoSQL数据库（非关系型数据库）

* Hbase的表模型与关系型数据库的表模型不同：
* Hbase的表`没有固定的字段定义`；
* Hbase的表中每行存储的都是一些`key-value`对
* Hbase的表中有列族的划分，用户可以指定将哪些kv插入哪个列族
* Hbase的表在物理存储上，是按照列族来分割的，不同列族的数据一定存储在不同的文件中
* Hbase的表中的每一行都固定有一个行键，而且每一行的行键在表中不能重复
* Hbase中的数据，包含行键，包含key，包含value，都是byte[ ]类型，hbase不负责为用户维护数据类型
* `HBASE对事务的支持很差`


HBASE相比于其他nosql数据库(mongodb、redis、cassendra、hazelcast)的特点：

Hbase的表数据存储在HDFS文件系统中从而，hbase具备如下特性：存储容量可以线性扩展； 数据存储的安全性可靠性极高！



# 安装HBASE


HBASE是一个分布式系统

其中有一个管理角色：  HMaster(一般2台，一台active，一台backup)

其他的数据节点角色：  HRegionServer(很多台，看数据容量)

首先，要有一个HDFS集群，并正常运行； regionserver应该跟hdfs中的datanode在一起

其次，还需要一个zookeeper集群，并正常运行

然后，安装HBASE

角色分配如下：

	Hdp01:  namenode  datanode  regionserver  hmaster  zookeeper
	Hdp02:  datanode   regionserver  zookeeper
	Hdp03:  datanode   regionserver  zookeeper

集群时间同步：
`yum install ntpdate -y 
ntpdate 0.asia.pool.ntp.org `


1. [上传hbase安装包](http://www.apache.org/dyn/closer.lua/hbase/)
2. 解压
3. 修改`hbase-env.sh`
 
		export JAVA_HOME=/root/apps/jdk1.7.0_67
		export HBASE_MANAGES_ZK=false
	
4. 修改`hbase-site.xml`

		<configuration>
			<!-- 指定hbase在HDFS上存储的路径 -->
	        <property>
	                <name>hbase.rootdir</name>
	                <value>hdfs://hdp01:9000/hbase</value>
	        </property>
			<!-- 指定hbase是分布式的 -->
	        <property>
	                <name>hbase.cluster.distributed</name>
	                <value>true</value>
	        </property>
			<!-- 指定zk的地址，多个用“,”分割 -->
	        <property>
	                <name>hbase.zookeeper.quorum</name>
	                <value>hdp01:2181,hdp02:2181,hdp03:2181</value>
	        </property>
		</configuration>
		
5. 修改 regionservers
	
		hdp01
		hdp02
   	hdp03

6. 启动hbase集群

   	bin/start-hbase.sh
   	启动完后，还可以在集群中找任意一台机器启动一个备用的master
   	
   	bin/hbase-daemon.sh start master
   	新启的这个master会处于backup状态

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-8/17395107.jpg)
		
# 命令行客户端

	bin/hbase shell
	Hbase> list     // 查看表
	Hbase> status   // 查看集群状态
	Hbase> version  // 查看集群版本
		
		
	命令行操作示范：
		
	// 建表
	create 't_user','base_info','extra_info'
	
	// 插入数据
	put 't_user','rk001','base_info:name','zhangsan'
	put 't_user','rk001','extra_info:married','false'
	
	// 查询数据
	-- 全表扫描
	scan 't_user'
	
	-- 单行获取
	get 't_user','rk001'
	
	// 修改数据 —— 就是put插入后覆盖
	
	// 删除数据
	--> 删除一个kv
	delete 't_user','rk001','base_info:name'
	
	--> 删掉整行
	deleteall 't_user','rk001'
	
	--> 清空整个表
	truncate 't_user'
	
	--> 删除整个表
	disable 't_user'
	drop 't_user'

# HBASE表模型

hbase的表模型跟mysql之类的关系型数据库的表模型差别巨大

hbase的表模型中有：行的概念；但没有字段的概念

行中存的都是key-value对，每行中的key-value对中的key可以是各种各样，每行中的key-value对的数量也可以是各种各样


**hbase表模型的要点**


1. 一个表，有表名
2. 一个表可以分为多个列族（不同列族的数据会存储在不同文件中）
3. 表中的每一行有一个“`行键rowkey`”，而且行键在表中不能重复
4. 表中的每一对kv数据称作一个cell
5. hbase可以对数据存储多个历史版本（历史版本数量可配置）
6. 整张表由于数据量过大，会被横向切分成若干个region（用rowkey范围标识），不同region的数据也存储在不同文件中
   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-8/36091052.jpg)
7. hbase会对插入的数据按顺序存储：
要点一：首先会按行键排序
要点二：同一行里面的kv会按列族排序，再按k排序...

**HBASE表的物理存储结构**

![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-8/81408117.jpg)
