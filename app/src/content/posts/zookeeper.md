---
title: "zookeeper"
subtitle: "\\\"分布式应用程序协调服务\\\""
description: "介绍"
date: 2018-04-07
author: "Mr Chang"
tags:
  - hadoop
  - zookeeper
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 介绍

ZooKeeper是一个分布式的，开放源码的分布式应用程序协调服务，是Google的Chubby一个开源的实现，是Hadoop和Hbase的重要组件。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。

ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。

ZooKeeper包含一个简单的原语集，  提供Java和C的接口。

ZooKeeper代码版本中，提供了分布式独享锁、选举、队列的接口，代码在zookeeper-3.4.3\src\recipes。其中分布锁和队列有Java和C两个版本，选举只有Java版本


# 数据存储形式

zookeeper中对用户的数据采用kv形式存储

只是zk有点特别：

	key：是以路径的形式表示的，那就意味着，各key之间有父子关系，比如
	/ 是顶层key
	用户建的key只能在/ 下作为子节点，比如建一个key： /aa  这个key可以带value数据
	也可以建一个key：   /bb
	也可以建key： /aa/xx 
	zookeeper中，对每一个数据key，称作一个znode
	
	
# znode类型

zookeeper中的znode有多种类型：

1. PERSISTENT  持久的：创建者就算跟集群断开联系，该类节点也会持久存在与zk集群中
2. EPHEMERAL  短暂的：创建者一旦跟集群断开联系，zk就会将这个节点删除
3. SEQUENTIAL  带序号的：这类节点，zk会自动拼接上一个序号，而且序号是递增的

组合类型：
PERSISTENT  ：持久不带序号
EPHEMERAL  ：短暂不带序号 
PERSISTENT  且 SEQUENTIAL   ：持久且带序号
EPHEMERAL  且 SEQUENTIAL  ：短暂且带序号


# 集群部署

1. 上传安装包到集群服务器
2. 解压
3. 修改配置文件

		进入zookeeper的安装目录的conf目录
		cp zoo_sample.cfg zoo.cfg
		vi zoo.cfg

		# The number of milliseconds of each tick
		tickTime=2000
		initLimit=10
		syncLimit=5
		dataDir=/root/zkdata #数据存放目录
		clientPort=2181
		
		#autopurge.purgeInterval=1
		server.1=hadoop01:2888:3888 #各个节点 2888节点通讯端口 3888选举leader端口
		server.2=hadoop02:2888:3888
		server.3=hadoop03:2888:3888
		
4. 增加myid文件

	`echo 1 > /root/zkdata/myid` #在hadoop01执行
	
	`echo 2 > /root/zkdata/myid` #在hadoop02执行
	
	`echo 3 > /root/zkdata/myid` #在hadoop03执行

5. 启动

	`bin/zkServer.sh start`
	
	启动后，用jps应该能看到一个进程：`QuorumPeerMain`

	但是，光有进程不代表zk已经正常服务，需要用命令检查状态：
	`bin/zkServer.sh status`
	能看到角色模式：为`leader`或`follower`，即正常了。(单节点是`Mode: standalone`)
	
	
# 数据管理

1. 创建节点： create /aaa 'ppppp'
2. 查看节点下的子节点：   ls /aaa
3. 获取节点的value： get /aaa
4. 修改节点的value： set /aaa 'mmmmm'
5. 删除节点：rmr /aaa


# 数据监听

1. ls /aaa watch   
查看/aaa的子节点的同时，注册了一个监听“节点的子节点变化事件”的监听器

2. get /aaa watch
获取/aaa的value的同时，注册了一个监听“节点value变化事件”的监听器

**注意：注册的监听器在正常收到一次所监听的事件后，就失效**


# crud与事件监听代码

	public class ZookeeperCrudTest {
	
	    ZooKeeper zk = null;
	    @Before
	    public void initZKConnect() throws Exception {
	//        zk = new ZooKeeper("hadoop01,hadoop02,hadoop03", 2000, null);
	        // 参数1：connectString——zookeeper服务器的地址
	        // 参数2：客户端与服务端连接超时的时限
	        // 参数3：客户端收到zookeeper集群的事件通知后，需要调用的逻辑（由用户自己根据需要来实现）
	        zk = new ZooKeeper("hadoop01", 2000, null);
	
	    }
	
	    /**
	     * 写入持久节点
	     * @throws Exception
	     */
	    @Test
	    public void writeDataTozk() throws Exception {
	
	
	        // 参数1： path —— 要写入的数据的key
	        // 参数2： data —— 要写入的数据的value
	        // 参数3： acl —— 设置要写入的数据的访问权限
	        // 参数4： createMode —— 设置要写入的数据节点的类型： Persistent节点；Ephemeral节点；Sequential节点
	        // Persistent节点 ——永久节点，客户端一旦建立，就会在zk集群中一直保留，除非客户端主动删除
	        // Ephemeral节点 —— 短暂节点，创建这个数据节点的客户端一旦与zk集群断开连接，zk集群就会自动将这个数据节点删除
	        // Sequential节点 —— 带序号的节点，创建一个这种类型的key时，zk会自动在客户端指定的key后加一个序号，并且zk集群负责维护序号的自增
	        String path = zk.create("/aaa", "hello zk".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
	        System.out.println(path);
	
	
	    }
	    /**
	     * 写入短暂节点
	     * @throws Exception
	     */
	    @Test
	    public void writeDataTozk2() throws Exception {
	        String path = zk.create("/bbb", "hello EPHEMERAL".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
	        Thread.sleep(5000);
	        System.out.println(path);
	    }
	
	    /**
	     * 写入带序号的持久节点
	     * @throws Exception
	     */
	    @Test
	    public void writeDataTozk3() throws Exception {
	
	        String path1 = zk.create("/aaa/a1", "hello a1".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT_SEQUENTIAL);
	        String path2 = zk.create("/aaa/a2", "hello a2".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT_SEQUENTIAL);
	        String path3 = zk.create("/aaa/a3", "hello a3".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT_SEQUENTIAL);
	
	        System.out.println(path1);
	        System.out.println(path2);
	        System.out.println(path3);
	
	    }
	
	    /**
	     * 写入一个对象到zookeeper中
	     * @throws Exception
	     */
	    @Test
	    public void writeDataTozk4() throws Exception {
	
	        Status status = new Status("001", "online");
	
	        // 将对象序列化成byte数组
	        ByteArrayOutputStream bao = new ByteArrayOutputStream();
	        ObjectOutputStream oos = new ObjectOutputStream(bao);
	        oos.writeObject(status);
	
	        byte[] byteArray = bao.toByteArray();
	
	        // 向zk写数据
	        zk.create("/testbean", byteArray, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
	
	        // 从zk中取数据
	        byte[] data = zk.getData("/testbean", false, null);
	
	        // 将byte数组反序列化成对象
	        ByteArrayInputStream bain = new ByteArrayInputStream(data);
	        ObjectInputStream oin = new ObjectInputStream(bain);
	        Status s = (Status) oin.readObject();
	
	        System.out.println(s.getId() + "," + s.getMode());
	
	        zk.close();
	
	    }
	
	    /**
	     * 获取指定key的数据
	     * @throws Exception
	     */
	    @Test
	    public void readDataFromzk() throws Exception {
	        byte[] data = zk.getData("/a10000000004", false, null);
	
	        String value = new String(data);
	        System.out.println(value);
	    }
	
	    /**
	     * 获取指定key的子节点信息
	     */
	    @Test
	    public void getChildren() throws Exception {
	
	        List<String> children = zk.getChildren("/aaa", false);
	        for (String childName : children) {
	            System.out.println(childName);
	        }
	    }
	
	    /**
	     * 删除zk中的数据
	     * @throws Exception
	     */
	    @Test
	    public void deleteData() throws Exception {
	        zk.delete("testbean",-1);
	
	        byte[] data = zk.getData("/testbean", false, null);
	
	        String value = new String(data);
	        System.out.println(value);
	
	    }
	
	    /**
	     *修改zk中的数据
	     * @throws Exception
	     */
	    @Test
	    public void updateData() throws Exception {
	        zk.setData("/aaa", "saosao".getBytes(), -1);
	        zk.close();
	    }
	
	    /**
	     * 判断一个节点是否存在
	     * @throws Exception
	     */
	    @Test
	    public void existData() throws Exception {
	
	        // 返回的是指定节点的状态信息（元数据）
	        Stat stat = zk.exists("/aaa", false);
	        System.out.println(stat==null?"不存在":"存在");
	    }
	
	
	
	    /**
	     * 监听功能：客户端可以向zk注册监听请求，监听的事件可以有以下类型：
	     * 	1、子节点变化事件
	     *  2、节点数据内容变化事件
	     * @throws Exception
	     */
	    @Test
	    public void testWatchDataChange() throws Exception {
	
	        zk = new ZooKeeper("hadoop01", 2000, new Watcher() {
	            @Override
	            public void process(WatchedEvent event) {
	                if(event.getType() == Event.EventType.None) {
	                    return;
	                }
	                System.out.println("收到的事件的类型：" + event.getType());
	                System.out.println("收到的事件所发生的key：" + event.getPath());
	                System.out.println("事件的状态： "+event.getState());
	                try {
	                    zk.getData("/aaa", true, null);
	                } catch (Exception e) {
	                }
	            }
	        });
	
	        // 注册监听，没有专门的方法，而是在获取数据的方法中注册
	        zk.getData("/aaa",true, null);  // 监听节点数据是否改变
	
	        Thread.sleep(30000);
	    }
	
	
	    /**
	     * 监听子节点变化事件
	     * @throws Exception
	     */
	    @Test
	    public void testWatchChildrenChanged() throws Exception {
	
	        zk = new ZooKeeper("hadoop01", 2000, new Watcher() {
	            @Override
	            public void process(WatchedEvent event) {
	                if (event.getType() == Event.EventType.None) {
	                    return;
	                }
	                System.out.println("收到的事件的类型：" + event.getType());
	                System.out.println("收到的事件所发生的key：" + event.getPath());
	                System.out.println("事件的状态： " + event.getState());
	                try {
	                    zk.getChildren("/aaa", true);
	                } catch (Exception e) {
	                }
	            }
	        });
	
	        // 注册监听，没有专门的方法，而是在获取数据的方法中注册
	        zk.getChildren("/aaa", true);
	
	        Thread.sleep(30000);
	    }
	    @After
	    public void closeZKConnect() throws Exception {
	//        zk = new ZooKeeper("hadoop01,hadoop02,hadoop03", 2000, null);
	
	        zk.close();
	    }
	}
	
# 代码

https://github.com/changdaye/big-data-study/tree/master/zookeeper-crud
