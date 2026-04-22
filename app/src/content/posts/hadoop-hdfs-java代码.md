---
title: "hadoop hdfs java代码"
subtitle: "\\\"分布式文件系统，可以存储海量文件\\\""
description: "hdfs的特性"
date: 2018-04-04
author: "Mr Chang"
tags:
  - hadoop
  - hdfs
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# hdfs的特性

hdfs是一个分布式系统，用户存储的文件被切块后存储在N台DATANODE服务器上；
每一个文件的块信息及具体存储位置由NAMENODE记录

	文件的切块默认大小是：128M
	
	文件的默认副本数量：3


 参数可以配置在客户端的什么地方？
 
     可以配置在客户端的hadoop安装目录的配置文件hdfs-site.xml中；
     可以在客户端的程序中设置；


# Java API

pom 引入依赖

	<dependency>
	    <groupId>org.apache.hadoop</groupId>
	    <artifactId>hadoop-client</artifactId>
	    <version>3.0.0</version>
	</dependency>
	
	
编写测试类

	public class HdfsClinetDemo {


    FileSystem fs = null;

    /**
     * 加载hdfs的配置信息
     *
     * @throws IOException
     */
    @Before
    public void init() throws IOException {

        System.setProperty("HADOOP_USER_NAME", "root");
        //创建配置信息
        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", "hdfs://hadoop01:9000/"); // 默认是访问本地文件系统：file:///
      	 conf.set("dfs.blocksize", "128m"); // 默认切块大小是128M
        conf.set("dfs.client.use.datanode.hostname", "true");//返回hostname 解决内网无法访问问题，需要修改etc/hosts

        conf.set("dfs.replication", "1"); // 默认副本数是3
        conf.set("dfs.socket.timeout", "180000");//设置超时时间

        fs = FileSystem.get(conf);
    }

    /**
     * 上传文件
     *
     * @throws IOException
     */
    @Test
    public void testUpload() throws IOException {

        fs.copyFromLocalFile(new Path("/Users/changwenhu/IdeaProjects/myproject/big-data-study/hdfs-crud/demo.txt"), new Path("/" + UUID.randomUUID().toString() + ".txt"));
        fs.close();
    }

    /**
     * 下载文件
     *
     * @throws IOException
     * @throws IllegalArgumentException
     */
    @Test
    public void testDownload() throws IOException {

        //     fs.copyToLocalFile(false,new Path("/NOTICE.txt"),new Path("D:/study"),true);
        fs.copyToLocalFile(new Path("/NOTICE.txt"), new Path("D:/study"));
        fs.close();
    }

    /**
     * 删除文件
     */
    @Test
    public void testDelete() throws IOException {

        fs.delete(new Path("/2.txt"), true);
        fs.close();
    }

    /**
     * 移动、更名
     */
    @Test
    public void testRename() throws IOException {

        fs.rename(new Path("/1.txt"), new Path("/bbb/2.txt"));
        fs.close();
    }

    /**
     * 创建目录
     */
    @Test
    public void testMkdir() throws IOException {

        fs.mkdirs(new Path("/a/b/c/d"));
        fs.close();
    }

    /**
     * 查看目录下的文件信息
     */
    @Test
    public void testLs() throws IOException {

        RemoteIterator<LocatedFileStatus> files = fs.listFiles(new Path("/"), true);

        while (files.hasNext()) {
            LocatedFileStatus fileInfo = files.next();
            System.out.println("文件路径：" + fileInfo.getPath());
            System.out.println("文件长度：" + fileInfo.getLen());
            System.out.println("文件块大小：" + fileInfo.getBlockSize());
            System.out.println("文件副本数量：" + fileInfo.getReplication());
            BlockLocation[] blockLocations = fileInfo.getBlockLocations();
            for (BlockLocation block : blockLocations) {
                System.out.println("块长度：" + block.getLength());
                System.out.println("块的偏移量：" + block.getOffset());
                System.out.println("块所在的datanodes:" + Arrays.toString(block.getHosts()));
            }

            System.out.println("---------------------分隔符----------------------");
        }
        fs.close();
    }

    /**
     * 查看目录下的文件和文件夹信息
     */

    @Test
    public void testLs1() throws IOException {

        FileStatus[] fileStatuses = fs.listStatus(new Path("/"));

        for (FileStatus fileStatus : fileStatuses) {
            System.out.println("文件的位置：" + fileStatus.getPath());
            System.out.println("文件的大小：" + fileStatus.getBlockSize());
            System.out.println("======================");
        }
        fs.close();
    }

    /**
     * 读文件的内容：使用流
     */
    @Test
    public void testReadContentToHdfs() throws IOException {

        FSDataInputStream in = fs.open(new Path("/wordcount/input/a.txt"));
        // in.seek(12);
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String line = null;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
        br.close();
        fs.close();
    }

    /**
     * 写数据到文件中去：使用输出流
     */
    @Test
    public void testWriterContentToHdfs() throws IOException {

        FSDataOutputStream out = fs.create(new Path("/1.txt"));

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(out));
        bw.write("ni shi hen niu bi dd");
        bw.newLine();
        bw.close();
        fs.close();
    }

    /**
     * 读文件的内容：使用流
     */
    @Test
    public void testReadCount() throws IOException {

        FSDataInputStream in = fs.open(new Path("/wordcount/input/a.txt"));
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String line = null;
        HashMap<String, Integer> countMap = new HashMap<>();
        while ((line = br.readLine()) != null) {
            String[] words = line.split(" ");
            System.out.println();
            for (String word : words) {
                if (countMap.containsKey(word)) {
                    countMap.put(word, countMap.get(word) + 1);
                } else {
                    countMap.put(word, 1);
                }
            }
        }
        br.close();
        in.close();
        //将结果上传到hdfs的中
        //先创建目录
        fs.mkdirs(new Path("/wordcount/temp/"));

        //得到的结果上传到hdfs
        FSDataOutputStream out = fs.create(new Path("/wordcount/temp/a.txt"));
        Set<Map.Entry<String, Integer>> entries = countMap.entrySet();
        for (Map.Entry<String, Integer> entry : entries) {
            out.write((entry.getKey() + ":" + entry.getValue() + "\n").getBytes());
        }
        out.close();
        in.close();
        fs.close();
    }

# 代码

  https://github.com/changdaye/big-data-study/tree/master/hdfs-crud
