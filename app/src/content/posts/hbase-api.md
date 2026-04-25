---
title: "hbase API"
subtitle: "\\\"nosql 数据库\\\""
description: "pom添加依赖"
date: 2018-04-09
author: "Mr Chang"
tags:
  - hadoop
  - hbase api
  - big-data-study
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# pom添加依赖

    <dependency>
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-client-project</artifactId>
        <version>1.4.3</version>
    </dependency>
    
    
# 代码编写

	public class HbaseDemo {
	
	
	    private Admin admin = null;
	
	    private  Configuration conf =null;
	
	    private  Connection conn = null;
	
	
	    @Before
	    public void initAdmin() throws Exception {
	        System.setProperty("HADOOP_USER_NAME", "root");
	
	        conf = HBaseConfiguration.create();
	        conf.set("hbase.zookeeper.quorum", "hadoop01:2181");
	
	        conn = ConnectionFactory.createConnection(conf);
	        // 获取一个schema管理工具
	        admin = conn.getAdmin();
	    }
	
	
	    @After
	    public void closeAdmin() throws Exception {
	        admin.close();
	        conn.close();
	    }
	
	
	    /**
	     * 建表
	     *
	     * @throws Exception
	     */
	    @Test
	    public void testCreateTable() throws Exception {
	        // 创建一个表描述对象
	        HTableDescriptor hd = new HTableDescriptor(TableName.valueOf("t3"));
	
	        HColumnDescriptor hc = new HColumnDescriptor("f1");
	        hc.setMaxVersions(1);
	
	        hd.addFamily(hc);
	
	        // 设置预分区分割点
	        String r1 = "10";
	        byte[] r1_byte = r1.getBytes();
	
	        String r2 = "20";
	        byte[] r2_byte = r2.getBytes();
	
	        String r3 = "30";
	        byte[] r3_byte = r3.getBytes();
	
	        String r4 = "40";
	        byte[] r4_byte = r4.getBytes();
	
	        byte[][] points = { r1_byte, r2_byte, r3_byte, r4_byte };
	
	        // 利用admin建表 ; 预分区
	        admin.createTable(hd, points);
	
	    }
	
	    /**
	     * 修改表定义
	     *
	     * @throws IOException
	     */
	    @Test
	    public void testModifyTableDefination() throws IOException {
	
	        // 获取t3的原定义
	        HTableDescriptor td = admin.getTableDescriptor(TableName.valueOf("t3"));
	
	        HColumnDescriptor hd = new HColumnDescriptor("f2");
	
	        td.addFamily(hd);
	
	        // 修改表定义
	        admin.modifyTable(TableName.valueOf("t33"), td);
	
	
	    }
	
	    /**
	     * 删除表
	     *
	     * @throws IOException
	     *
	     */
	    @Test
	    public void dropTable() throws IOException {
	        // 禁用表
	        admin.disableTable(TableName.valueOf("t1"));
	
	        // 删除
	        admin.deleteTable(TableName.valueOf("t1"));
	
	    }
	
	    /**
	     * 插入数据
	     *
	     * @throws Exception
	     */
	    @Test
	    public void testInsertData() throws Exception {
	        byte[] f1Bytes = "f1".getBytes();
	
	        // 创建连接
	
	        // 获取表
	        Table table = conn.getTable(TableName.valueOf("t3"));
	
	        // 封装要插入的数据为一个put对象
	        Put put = new Put("8800".getBytes());
	        put.addColumn(f1Bytes, "name".getBytes(), "zhangsan".getBytes());
	        put.addColumn(f1Bytes, Bytes.toBytes("age"), Bytes.toBytes(18));
	
	        // 插入数据
	        table.put(put);
	
	        table.close();
	
	    }
	
	    /**
	     * 修改数据
	     */
	    @Test
	    public void testUpdateData() throws Exception {
	        byte[] f1Bytes = "f1".getBytes();
	
	        // 创建连接
	
	        // 获取表
	        Table table = conn.getTable(TableName.valueOf("t3"));
	
	        // 封装要插入的数据为一个put对象
	        Put put = new Put("8800".getBytes());
	        put.addColumn(f1Bytes, Bytes.toBytes("age"), Bytes.toBytes(19));
	
	        // 插入数据，会覆盖原数据
	        table.put(put);
	
	        table.close();
	
	    }
	
	    /**
	     * 查询数据
	     *
	     * @throws IOException
	     */
	    @Test
	    public void testGet() throws IOException {
	        // 获取表
	        Table table = conn.getTable(TableName.valueOf("app"));
	
	        Get get = new Get("u01".getBytes());
	        get.addFamily("f2".getBytes());  //设置需要查询的列族
	        // get.addColumn("f1".getBytes(), "name".getBytes()); //设置需要查询的key
	
	        Result result = table.get(get);
	        System.out.println(result.isEmpty());
	
	        System.out.println();
	
	        // byte[] value = result.getValue("f1".getBytes(), "addr".getBytes()); //
	        // 从result中取一个指定的key的value
	        while (result.advance()) {
	            Cell cell = result.current();
	
	
				/*byte[] rowkey = cell.getRowArray();
				byte[] family = cell.getFamilyArray();
				byte[] key = cell.getQualifierArray();
				byte[] value = cell.getValueArray();
				System.out.println(new String(rowkey, cell.getRowOffset(), cell.getRowLength()));
				System.out.println(new String(family, cell.getFamilyOffset(), cell.getFamilyLength()));
				String keyString = new String(key, cell.getQualifierOffset(), cell.getQualifierLength());
				System.out.println(keyString);
				if ("age".equals(keyString)) {
					System.out.println(Bytes.toInt(value, cell.getValueOffset(), cell.getValueLength()));
				} else {
					System.out.println(new String(value, cell.getValueOffset(), cell.getValueLength()));
				}*/
	
	
	            byte[] cloneRow = CellUtil.cloneRow(cell);
	            byte[] cloneFamily = CellUtil.cloneFamily(cell);
	            byte[] cloneQualifier = CellUtil.cloneQualifier(cell);
	            byte[] cloneValue = CellUtil.cloneValue(cell);
	
	            System.out.println(new String(cloneRow));
	            System.out.println(new String(cloneFamily));
	            System.out.println(new String(cloneQualifier));
	            System.out.println(new String(cloneValue));
	
	
	            System.out.println("------------闪亮的分割线------------------------------");
	
	        }
	
	        table.close();
	    }
	
	
	    @Test
	    public void testScan() throws IOException {
	
	
	        // 获取表
	        Table table = conn.getTable(TableName.valueOf("t3"));
	
	
	        Scan scan = new Scan("88".getBytes(), "99\000".getBytes());
	
	        ResultScanner scanner = table.getScanner(scan);
	
	        Iterator<Result> iterator = scanner.iterator();
	        while(iterator.hasNext()) {
	            Result result = iterator.next();
	            byte[] name = result.getValue("f1".getBytes(), "name".getBytes());
	            System.out.println(new String(name));
	            System.out.println("----------------风骚的分割线------------------");
	        }
	
	        table.close();
	
	
	    }
	
	
	
	    /**
	     * 删除数据
	     *
	     * @throws Exception
	     */
	    @Test
	    public void testDeleteData() throws Exception {
	
	        // 获取表
	        Table table = conn.getTable(TableName.valueOf("t3"));
	
	        Delete delete = new Delete("8800".getBytes());
	        // delete.addFamily("f1".getBytes());
	        delete.addColumn("f1".getBytes(), "name".getBytes());
	
	        table.delete(delete);
	    }
	
	}
