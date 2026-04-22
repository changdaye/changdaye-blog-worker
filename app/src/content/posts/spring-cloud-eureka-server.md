---
title: "spring-cloud-eureka-server"
subtitle: "\\\"服务注册与发现\\\""
description: "Spring Cloud 简介"
date: 2018-03-28
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-server
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# Spring Cloud 简介

Spring Cloud为开发人员提供了快速构建分布式系统中一些常见模式的工具（例如配置管理，服务发现，断路器，智能路由，微代理，控制总线）。分布式系统的协调导致了样板模式, 使用Spring Cloud开发人员可以快速地支持实现这些模式的服务和应用程序。他们将在任何分布式环境中运行良好，包括开发人员自己的笔记本电脑，裸机数据中心，以及Cloud Foundry等托管平台。


# 特性

Spring Cloud专注于提供良好的开箱即用经验的典型用例和可扩展性机制覆盖。

* 分布式/版本化配置

* 服务注册和发现

* 路由

* service - to - service调用

* 负载均衡

* 断路器

* 分布式消息传递


# 服务注册与发现

在简单介绍了Spring Cloud和微服务架构之后，下面回归本文的主旨内容，如何使用Spring Cloud搭建服务注册与发现模块。

这里我们会用到Spring Cloud Netflix，该项目是Spring Cloud的子项目之一，主要内容是对Netflix公司一系列开源产品的包装，它为Spring Boot应用提供了自配置的Netflix OSS整合。通过一些简单的注解，开发者就可以快速的在应用中配置一下常用模块并构建庞大的分布式系统。它主要提供的模块包括：服务发现（Eureka），断路器（Hystrix），智能路有（Zuul），客户端负载均衡（Ribbon）等。

所以，我们这里的核心内容就是服务发现模块：Eureka。下面我们动手来做一些尝试。

### 创建 Eureka-Server

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
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-eureka-server</artifactId>
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
	
2. 启动类上写注解 `@EnableEurekaServer`

		@SpringBootApplication
		@EnableEurekaServer
		public class SpringCloudEurekaServerApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudEurekaServerApplication.class, args);
		    }
		}
3. 修改application配置文件，添加配置

   	spring.application.name=eureka-server #服务名称
   	server.port=8080
   	eureka.instance.hostname=localhost # 应用的主机名称
   	eureka.client.register-with-eureka=false #自身仅作为服务器
   	eureka.client.fetch-registry=false # 无需注册自身

4. 启动效果，可以看到没有任何服务注册上来

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-28/29075174.jpg)
	
# 公共eureka-server服务

为了大家更好的学习spring-cloud 我用良心云做了台公共的eureka-server

* `http://eureka-server.jetbrains.org.cn`
* 在Spring Cloud应用的配置文件中，设置eureka的地址为： `eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/`

* 注意：`因为服务器性能较差，1c2g1m的良心云，请不要压测，且已加监控。`

# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-server
    
   2. https://www.jianshu.com/p/599c74a9035e
    
   3. https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-eureka-server
