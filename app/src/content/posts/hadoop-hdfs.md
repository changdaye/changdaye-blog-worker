---
title: "hadoop hdfs"
subtitle: "\\\"分布式文件系统，可以存储海量文件\\\""
description: "大数据"
date: 2018-04-03
author: "Mr Chang"
tags:
  - hadoop
  - hdfs
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 大数据

大数据到底在干嘛（数据分析）：

* 收集大量业务行为数据，进行数据分析，得到一些业务结论
* 支撑业务功能（推荐）
* 支撑公司的运营分析


当数据分析面对的是海量（1T以上）的数据时，普通技术手段难以胜任，就需要更强大的技术手段来实现：

* 存储：分布式文件系统（HDFS）
* 运算分析：分布式运算程序（MAP REDUCE）
* 分布式运算程序的运行调度：（YARN）


# HADOOP

是一套用于解决海量数据分析处理的软件系统，它包含三个核心组件：

  * HDFS： 分布式文件系统，可以存储海量文件
  * MAP REDUCE：分布式运算程序，可以分布式地并行处理数据
  *  YARN ：分布式程序的调度系统

# HDFS

HDFS分布式文件系统会将用户提交的文件存储在一个服务器集群中

HDFS中有两种重要的服务器软件角色：

* Datanode --负责存储用户文件的块
* Namenode --负责记录用户存储的文件的虚拟路径，及文件每一个块的具体位置（哪一块在哪一台datanode服务器上）

# 安装

1. 安装jdk
2. 上传hadoop安装包，下载地址：http://hadoop.apache.org/#Download+Hadoop
3. 修改`/root/hadoop-2.8.1/etc/hadoop/core-site.xml`,这里设置了主机名。修改`/etc/sysconfig/network`
	添加 hadoop01，修改`/etc/hosts`，添加vps ip地址 映射 hadoop01
	
		<configuration>
			<property>
			<name>fs.defaultFS</name>
			<value>hdfs://hadoop01:9000/</value>
			</property>
		</configuration>
		
4. 修改`/root/hadoop-2.8.1/etc/hadoop/hdfs-site.xml`

		<configuration>
			<property>
				<name>dfs.namenode.name.dir</name>
				<value>/root/dfsdata/name/</value>
			</property>
	
			<property>
				<name>dfs.datanode.data.dir</name>
				<value>/root/dfsdata/data/</value>
			</property>
		</configuration>
		
5. 配置环境变量

		export HADOOP_HOME=/root/hadoop-2.8.1
		export PATH= $PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

6. 格式化 namenode 

		hadoop namenode -format
		
7. 启动namenode

		hadoop-daemon.sh start namenode


8. 启动datanode

		hadoop-daemon.sh start datanode
		
9. 使用浏览器访问hadoop01的50070端口，能打开一个namenode状态信息的网页

# 遇到的问题

因为我是在阿里云上配置的hadoop环境，在启动namenode的时候一直失败，查看日志报错是：`java.net.BindException: Problem binding to [Namenode:9000] java.net.BindException: Cannot assign requested address; For more details see:  http://wiki.apache.org/hadoop/BindException
`,通过Google说是服务已启动，端口被占用，但是我`netstat -a | grep 9000`发现并没有。折腾了很多次，直到提交工单给阿里发现无法绑定公网IP的地址，即在 /etc/hosts 需要这样设置。

	内网IP地址  你的hostname
	公网IP地址  别的hostname
	
 * 我只有一台master节点，so。。。
 ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-3/36601488.jpg)
	
# 效果

![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-3/58061162.jpg)
