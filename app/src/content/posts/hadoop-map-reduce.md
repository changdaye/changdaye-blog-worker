---
title: "hadoop MAP REDUCE"
subtitle: "\\\"分布式运算编程模型\\\""
description: "MAP REDUCE"
date: 2018-04-04
author: "Mr Chang"
tags:
  - hadoop
  - MAP REDUCE
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# MAP REDUCE


一个分布式运算程序，往往需要分成多个阶段，最基本应该分2个阶段：

	阶段1：读数据，拆分数据
	阶段2：聚合数据


什么是MAP REDUCE

两个角度：

角度1：MAP REDUCE是一种分布式运算编程模型

	它将整个运算逻辑分成两个阶段：
	阶段1：将数据映射成key:value形式
	阶段2：将key:value按相同key分组，对每组聚合运算
	之所以这么设计，是因为可以方便地把整个运算过程实现成分布式并行计算的过程

角度2：MAP REDUCE 是hadoop提供的一个对上述编程思想实现好的一套编程框架

	它为map阶段实现了一个程序：map task
	它为reduce阶段实现了一个程序： reduce task
	maptask 和reducetask都可以在多台机器上并行运行；（分布式并行运行）
	它的这些程序已经完成了整个分布式运算过程中的绝大部分流程、工作；只需要用户提供两个阶段中的数据处理逻辑：
	map阶段：映射逻辑（就是实现框架所提供的一个接口Mapper）
	reduce阶段：聚合逻辑（就是实现框架所提供的一个接口：Reducer）

# 运行MAP REDUCE程序
###  安装yarn
1. 在yarn上运行，配置yarn，修改`/root/hadoop-2.8.1/etc/hadoop/yarn-site.xml`
	
		<!-- Site specific YARN configuration properties -->
		<property>
			<name>yarn.resourcemanager.hostname</name>
			<value>hadoop01</value>
		</property>
		
		<property>
			<name>yarn.nodemanager.aux-services</name>
			<value>mapreduce_shuffle</value>
		</property>
		
		<!-- 指定一个nodemanager节点的内存资源  -->
		<property>
			<name>yarn.nodemanager.resource.memory-mb</name>
			<value>4096</value>
		</property>
		
		<!-- 指定一个nodemanager节点的cpu核数  -->
		<property>
			<name>yarn.nodemanager.resource.cpu-vcores</name>
			<value>2</value>
		</property>

2. 修改`/root/hadoop-2.8.1/etc/hadoop/slaves`

   	hadoop01

3. 启动

   	yarn-daemon.sh start resourcemanager   命令在resource manager所在的节点上输入(管理节点)
   	yarn-daemon.sh start nodemanager   命令在node manager所在的节点上输入（运算节点）

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-4/40829439.jpg)

4. 查看

   	启动完后，可以用浏览器访问resource manager的8088端口：
   	http://hadoop01:8088/

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-4-4/2705881.jpg)

### 书写map reduce代码


	public class HadoopMapreduceDemo {
	    /**
	     * 用于设置job参数
	     * 并提交mr程序相关资源（jar包，配置参数等）给yarn去运行
	     *
	     * @param args
	     */
	    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
	        System.setProperty("HADOOP_USER_NAME", "root");
	
	        Configuration conf = new Configuration();
	
	//        conf.set("mapreduce.framework.name", "yarn");
	//        conf.set("yarn.resourcemanager.hostname", "hadoop01");
	        conf.set("mapreduce.framework.name", "local");// 默认值：将mr程序交给LocalJobRunner去运行
	
	//        conf.set("fs.defaultFS", "hdfs://hadoop01:9000");
	        conf.set("mapreduce.app-submission.cross-platform", "true");
	        conf.set("fs.defaultFS", "file:///");  //默认值；
	        conf.set("yarn.app.mapreduce.am.staging-dir", "/Users/changwenhu/IdeaProjects/myproject/big-data-study/hadoop-mapreduce");  //默认值；/user
	
	        Job job = Job.getInstance(conf);
	
	        // 告知job对象，我们的mr程序jar所在的本地路径
	//        job.setJar("/Users/changwenhu/IdeaProjects/myproject/big-data-study/hadoop-mapreduce/target/hadoop-mapreduce-0.0.1-SNAPSHOT.jar");//这种方式是提交给resourcemanager服务器运行，无需手动上传
	        job.setJarByClass(HadoopMapreduceDemo.class);//这种方式是上传到resourcemanager 服务器上运行
	
	        // 设置本次job所使用的mapper类和reducer类
	        job.setMapperClass(WordcountMapper.class);
	        job.setReducerClass(WordcountReducer.class);
	
	        // 设置本次job的map阶段输出的key-value类型
	        job.setMapOutputKeyClass(Text.class);
	        job.setMapOutputValueClass(IntWritable.class);
	
	        // 设置本次job的reduce阶段输出的key-value类型
	        job.setOutputKeyClass(Text.class);
	        job.setOutputValueClass(IntWritable.class);
	
	        // 设置本次job的输入数据所在路径
	        FileInputFormat.setInputPaths(job, new Path("/Users/changwenhu/IdeaProjects/myproject/big-data-study/hadoop-mapreduce/input/"));
	
	        // 设置本次job的输出结果文件所在路径
	        FileOutputFormat.setOutputPath(job, new Path("/Users/changwenhu/IdeaProjects/myproject/big-data-study/hadoop-mapreduce/output/"));
	
	        // 设置本次job的reduce task运行实例数
	        // maptask的数量不能这样直接设置，mr框架内有一个固定的机制来计算需要启动多少个maptask
	        job.setNumReduceTasks(2);
	
	        // 将本次job的jar包和设置的上述信息提交给yarn
	        //job.submit();
	        boolean res = job.waitForCompletion(true);
	        System.out.println(res ? "mr在yarn里面运行成功了，本客户端撒油啦啦了" : "呃呃呃....mr程序在yarn里面好像出问题了，我也退出了");
	    }
	
	    /**
	     * KEYIN: 是maptask读取到的数据中的key（一行起始偏移量）的类型：Long
	     * VALUEIN:是maptask读取到的数据中的value（一行的内容）类型：String
	     * <p>
	     * KEYOUT:是我们的映射逻辑所产生的key（单词）的类型：String
	     * VALUEOUT:是我们的映射逻辑所产生的value（1）的类型：Integer
	     * <p>
	     * 但是，HADOOP中这些key：value数据需要经常进行磁盘序列化，网络传输，这些key-value数据需要实现序列化机制；
	     * 但是jdk中的Long、String、Integer实现的是jdk自己的serializable序列化接口，
	     * 这种序列化机制把一个对象序列化成字节时，体积臃肿
	     * 所以，hadoop自己开发了一套序列化机制：Writable接口
	     * 那么，在mapreduce编程中涉及到的需要序列化的数据都需要实现Writable接口
	     * 所以，String应该替换成hadoop中已经实现了Writable接口的类型：Text
	     * Long应该替换成：LongWritable类型
	     * Integer应该替换成：IntWritable类型
	     * Float应该替换成：FloatWritable类型
	     * Double应该替换成：DoubleWritable类型
	     * .....
	     * 如果key或者value数据是用户自定义的类，那么这个类也得实现Writable接口
	     *
	     * @author hunter.ganhoo
	     */
	
	    public static class WordcountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
	        /**
	         * 本方法是由maptask来调用的
	         * maptask每读取一行数据，就会调用一次，而且会将该行的起始偏移量传入参数key，该行的内容传入参数value
	         * context是提供给我们来返回映射结果数据的
	         */
	        @Override
	        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
	            //value为读到的每行数据
	            String[] split = value.toString().split(" ");
	
	            //切出的每行中的每个单词
	
	            for (String word : split) {
	
	                context.write(new Text(word.toLowerCase()), new IntWritable(1));
	            }
	
	        }
	    }
	
	    /**
	     * KEYIN: reduce task传入的key的类型，（其实就是mapper阶段产生的key的类型）
	     * VALUEIN:reduce task传入的value的类型（其实就是mapper阶段产生的value的类型）
	     * <p>
	     * KEYOUT: 是我们的聚合逻辑所产生的结果的key的类型
	     * VALUEOUT:是我们的聚合逻辑所产生的结果的value的类型
	     *
	     * @author hunter.ganhoo
	     */
	
	    public static class WordcountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
	        /**
	         * reduce方法由 reduce task程序调用
	         * reduce task 对每一组数据调用一次reduce方法
	         * <p>
	         * 那么，reduce task就得想办法把一组数据传入我们的reduce方法
	         * 方法中: 参数key就是这一组数据的key
	         * 参数values是这一组数据的一个迭代器，可以迭代这一组数据中所有的value
	         */
	        @Override
	        protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
	            //这里key是单词，values是这个单词出现的次数迭代器，及1 1 1 1 1 1
	            Iterator<IntWritable> iterator = values.iterator();
	
	            int count = 0;
	            while (iterator.hasNext()) {
	                IntWritable value = iterator.next();
	                count += value.get();
	            }
	            context.write(key, new IntWritable(count));
	        }
	    }
	
	
	}
	

# 注意 

在mapreduce编程中，需要注意以下几个重要环节：

1. map阶段把数据分给不同的reduce时，会`分区`，默认是按key的hashcode来分，有可能打乱你的业务逻辑；
你要控制，将需要分到一个reducetask的数据，保证能分到一个reducetask；
靠：`Partitioner`的计算逻辑；

2. map阶段的数据发给reduce时，还会`排序`，默认是按key.compareTo()比大小后排序；所以，你要根据自己的业务需求，控制key上的`compareTo()`方法，按你的需求比大小；

3. reduce task拿到数据后，在处理之前，首先会对数据`分组`，每组调一次reduce方法；为了让它将正确的数据分成正确的组，需要控制分组比较规则`GroupingComparator`；
