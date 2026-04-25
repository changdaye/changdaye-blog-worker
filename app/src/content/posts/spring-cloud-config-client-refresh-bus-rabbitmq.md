---
title: "spring-cloud-config-client-refresh-bus-rabbitmq"
subtitle: "\\\"Spring Cloud Config为分布式系统中的外部配置提供服务器和客户端支持\\\""
description: "创建 Spring Cloud Config客户端"
date: 2018-04-06
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-config-client-refresh-bus-rabbitmq
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 创建 Spring Cloud Config客户端

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
	            <artifactId>spring-cloud-starter-bus-amqp</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-config</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-web</artifactId>
	        </dependency>
	
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-test</artifactId>
	            <scope>test</scope>
	        </dependency>
	    </dependencies>
	    
	    
2. 启动类上写注解

		@SpringBootApplication
		@EnableConfigServer
		public class SpringCloudConfigServerGitApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudConfigServerGitApplication.class, args);
		    }
		}
		
3. 修改bootstrap.yml配置文件，添加配置
		
		spring:
		  application:
		    name: config-client-refresh-bus-rabbitmq
		  cloud:
		    config:
		      uri: https://config-server-git.jetbrains.org.cn/
		      profile: dev
		      label: master
		
	* 从那个config-server上拉取什么项目的配置，所用的环境是什么，分支用的什么
	
4. 修改application.properties配置文件，添加配置

		spring.rabbitmq.host=118.24.24.243
		spring.rabbitmq.port=5672
		spring.rabbitmq.username=springcloud
		spring.rabbitmq.password=123456
		management.security.enabled=false
# 测试

1. 修改 https://github.com/changdaye/spring-cloud-config-repo-demo 中 config-client-refresh-bus-rabbitmq-dev.yml配置文件，然后提交到master
2. 调用刷新配置 ** 为端口号,这里其实个人觉得应该还要加上主机名的
	`POST https://config-server-git.jetbrains.org.cn/bus/refresh?destination=config-client-refresh-bus-rabbitmq:**`
	即可

# 备注

Spring Cloud Bus的更新只对三种情况有效

1. @ConfigurationProperties
2. @RefreshScope
3. 日志级别

# 参考资料

1. https://springcloud.cc/spring-cloud-dalston.html#_spring_cloud_config
2. https://github.com/changdaye/spring-cloud-config-repo-demo
3. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-config-client-refresh-bus-rabbitmq
