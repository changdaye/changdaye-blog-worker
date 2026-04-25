---
title: "spring-cloud-turbine"
subtitle: "\\\"Turbine是聚合服务器发送事件流数据的一个工具，用来监控集群下hystrix的metrics情况。\\\""
description: "Turbine"
date: 2018-04-04
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-turbine
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# Turbine

从个人实例看，Hystrix数据在系统整体健康方面不是非常有用。Turbine是将所有相关/hystrix.stream端点聚合到Hystrix仪表板中使用的/turbine.stream的应用程序。个人实例位于Eureka。运行Turbine就像使用@EnableTurbine注释（例如使用spring-cloud-starter-turbine设置类路径）注释主类一样简单。来自Turbine 1维基的所有文档配置属性都适用。唯一的区别是turbine.instanceUrlSuffix不需要预先添加的端口，除非turbine.instanceInsertPort=false自动处理。

### 注意：

默认情况下，Turbine通过在Eureka中查找其homePageUrl条目，然后将/hystrix.stream附加到注册的实例上查找/hystrix.stream端点。这意味着如果spring-boot-actuator在自己的端口上运行（这是默认值），则对/hystrix.stream的调用将失败。要使涡轮机找到正确端口的Hystrix流，您需要向实例的元数据中添加management.port
	
# 创建 Turbine

1. 创建springboot工程，引入依赖

		<parent>
	        <groupId>org.springframework.boot</groupId>
	        <artifactId>spring-boot-starter-parent</artifactId>
	        <version>1.5.10.RELEASE</version>
	        <relativePath/> <!-- lookup parent from repository -->
	    </parent>
	
	    <properties>
	        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
	        <java.version>1.8</java.version>
	        <spring-cloud.version>Dalston.SR4</spring-cloud.version>
	    </properties>
	
	    <dependencies>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-actuator</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-turbine</artifactId>
	        </dependency>
	
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-test</artifactId>
	            <scope>test</scope>
	        </dependency>
	    </dependencies>
	
	    <dependencyManagement>
	        <dependencies>
	            <dependency>
	                <groupId>org.springframework.cloud</groupId>
	                <artifactId>spring-cloud-dependencies</artifactId>
	                <version>${spring-cloud.version}</version>
	                <type>pom</type>
	                <scope>import</scope>
	            </dependency>
	        </dependencies>
	    </dependencyManagement>
	
2. 启动类上写注解

	@SpringBootApplication
	@EnableTurbine
	@EnableEurekaClient
	@EnableAutoConfiguration
	@Configuration
	public class SpringCloudTurbineApplication {
	
	    public static void main(String[] args) {
	        SpringApplication.run(SpringCloudTurbineApplication.class, args);
	    }
	}

3. 修改application配置文件，添加配置

		spring.application.name=turbine
		server.port=8989
		management.port=8990
   	eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/
   	  #需要收集监控信息的服务名
   	turbine.app-config=eureka-consumer-ribbon-hystrix,eureka-consumer-ribbon-hystrix-new
   	#集群名称为default，当我们服务数量非常多的时候，可以启动多个Turbine服务来构建不同的聚合集群，而该参数可以用来区分这些不同的聚合集群，同时该参数值可以在Hystrix仪表盘中用来定位不同的聚合集群，只需要在Hystrix Stream的URL中通过cluster参数来指定
   	turbine.cluster-name-expression="default"
   	#设置为true，可以让同一主机上的服务通过主机名与端口号的组合来进行区分
   	turbine.combine-host-port=true

4. 启动后访问地址 http://localhost:8989/turbine.stream 把这个地址配置到spring-cloud-hystrix-dashboard中。即可

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/16136385.jpg)






# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-turbine
               
   2. https://www.jianshu.com/p/8cf29cf4c8dd
       
   3. https://springcloud.cc/spring-cloud-dalston.html#_turbine
