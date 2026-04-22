---
title: "hadoop Hive"
subtitle: "\\\"就是一个利用HDFS存储数据，利用mapreduce运算数据的数据仓库工具\\\""
description: "HIVE 基本概念"
date: 2018-04-04
author: "Mr Chang"
tags:
  - hadoop
  - Hive
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# HIVE 基本概念


在真实生产中，数据处理的需求量非常多，如果对每个需求都需要开发一个mapreduce程序来实现，则开发的成本代价太高，开发的周期很长；

所以，急需要一种工具，能够快速生成mapreduce程序，则可以极大地降低开发成本，降低对开发人员的技术难度要求，极大缩减项目开发周期；

HIVE就是这么一个神器！！！
它可以让你把你的数据文件 “映射”成一个表，然后还可以让你输入SQL指令，它就能将你的SQL指令解析后生成mapreduce程序进行逻辑运算；


HIVE： 就是一个利用HDFS存储数据，利用mapreduce运算数据的数据仓库工具



# 安装
1. 上传安装包 `wget http://oss.jetbrains.org.cn/apache-hive-1.2.1-bin.tar.gz`
2. 解压 `tar -zxvf apache-hive-1.2.1-bin.tar.gz`


# 启动方式

1. 用bin/hive 启动一个交互式查询软件来使用
2. 用bin/hiveserver2 启动一个hive的服务端软件来接收查询请求

# HIVE的建库

CREATE DATABASE db_name;

**建库的实质：**

1. HIVE 会记住关于库定义的信息（库名叫什么）
2. HIVE会在HDFS上创建一个库目录：/user/hive/warehouse/db_name

# HIVE的建表
1. 内部表建表语句

	CREATE TABLE t_name(filed1 type,field2 type,field3 type)
	ROW FORMAT DELIMITED FIELDS TERMINATED BY ‘,’ ;
	
	**建表的实质：**
	
	* HIVE 会记住关于表定义的信息（表名叫什么、有哪些字段、数据文件的分隔符？）
	* HIVE会在HDFS上创建一个表数据文件存储目录：/user/hive/warehouse/db_name/t_name

2. 外部表建表语句

CREATE EXTERNAL TABLE t_name(filed1 type,field2 type,field3 type)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ‘,’ 
LOCATION ‘/aa/bb/’ ; （这里的地址都是hdfs中的地址，不是宿主机的）


	注意：当drop一个内部表时，hive会清楚这个表的元数据，并删除这个表的数据目录；
	当drop一个外部表时，hive会清除这个表的元数据，但不会删它的数据目录；
	
	通常，外部表用于映射最开始的数据文件（一般是由别的系统所生成的）
	
3. 分区表建表语句

分区表：会在表数据存储目录中，允许有子目录（分区）

CREATE TABLE t_access(ip string,url string)
PARTITIONED BY (day string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ‘,’;

建表时，只是指定这个表可以按day变量的具体值建子目录；所以建表时，不会生成子目录；

导入数据到该表时，就需要指定一个具体的day变量的值，hive就会用这个值建一个子目录，并将数据文件放入该子目录；


**导入数据语句：**

* LOAD DATA LOCAL INPATH ‘/root/access.1’ INTO TABLE t_access PARTITION(day=’2017-11-25’);
* LOAD DATA LOCAL INPATH ‘/root/access.2’ INTO TABLE t_access PARTITION(day=’2017-11-26’);


# Hive的特点

* 可扩展 
Hive可以自由的扩展集群的规模，一般情况下不需要重启服务。

* 延展性 
Hive支持用户自定义函数，用户可以根据自己的需求来实现自己的函数。

* 容错 
良好的容错性，节点出现问题SQL仍可完成执行。


# 数据导入导出

方式1：导入数据的一种方式：
手动用hdfs命令，将文件放入表目录；

方式2：在hive的交互式shell中用hive命令来导入本地数据到表目录
hive>load data local inpath '/root/order.data.2' into table t_order;

方式3：用hive命令导入hdfs中的数据文件到表目录
hive>load data inpath '/access.log.2017-08-06.log' into table t_access partition(dt='20170806');


# 其他

hive 的其他sql 语法 与 常用关系型数据库，如mysql，oracle等语法类似，这里不做细致说明。。
