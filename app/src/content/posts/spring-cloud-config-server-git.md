---
title: "spring-cloud-config-server-git"
subtitle: "\\\"Spring Cloud Config为分布式系统中的外部配置提供服务器和客户端支持\\\""
description: "Spring Cloud Config"
date: 2018-04-05
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-config-server-git
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# Spring Cloud Config

Spring Cloud Config为分布式系统中的外部配置提供服务器和客户端支持。
使用Config Server，您可以在所有环境中管理应用程序的外部属性。
客户端和服务器上的概念映射与Spring Environment和PropertySource抽象相同，因此它们与Spring应用程序非常契合，但可以与任何以任何语言运行的应用程序一起使用。
随着应用程序通过从开发人员到测试和生产的部署流程，您可以管理这些环境之间的配置，并确定应用程序具有迁移时需要运行的一切。
服务器存储后端的默认实现使用git，因此它轻松支持标签版本的配置环境，以及可以访问用于管理内容的各种工具。很容易添加替代实现，并使用Spring配置将其插入。

定位资源的默认策略是克隆一个git仓库（在spring.cloud.config.server.git.uri），并使用它来初始化一个迷你SpringApplication。
小应用程序的Environment用于枚举属性源并通过JSON端点发布。

HTTP服务具有以下格式的资源：

    /{application}/{profile}[/{label}]
    /{application}-{profile}.yml
    /{label}/{application}-{profile}.yml
    /{application}-{profile}.properties
    /{label}/{application}-{profile}.properties
    
    
其中“应用程序”作为SpringApplication中的spring.config.name注入（即常规的Spring Boot应用程序中通常是“应用程序”），“配置文件”是活动配置文件（或逗号分隔列表的属性），“label”是可选的git标签（默认为“master”）。

Spring Cloud Config服务器从git存储库（必须提供）为远程客户端提供配置：

	spring.cloud.config.server.git.uri=https://github.com/changdaye/spring-cloud-config-repo-demo/


# Spring Cloud Config服务器


服务器为外部配置（名称值对或等效的YAML内容）提供了基于资源的HTTP。服务器可以使用@EnableConfigServer注释轻松嵌入到Spring Boot应用程序中。所以这个应用程序是一个配置服务器：


# 创建 Spring Cloud Config Server

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
	            <artifactId>spring-cloud-config-server</artifactId>
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
		@EnableConfigServer
		public class SpringCloudConfigServerGitApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudConfigServerGitApplication.class, args);
		    }
		}
		
3. 修改application配置文件，添加配置
		
		spring.application.name=config-server
		spring.cloud.config.server.git.uri=https://github.com/changdaye/spring-cloud-config-repo-demo/
		server.port=8085
		logging.level.root=info
		spring.rabbitmq.host=118.24.24.243
		spring.rabbitmq.port=5672
		spring.rabbitmq.username=springcloud
		spring.rabbitmq.password=123456
		management.security.enabled=false
		
	* 这里我们直接是bus-mq版本的spring-cloud-config-server
	* 远程配置文件地址是 https://github.com/changdaye/spring-cloud-config-repo-demo

# 使用

1. 启动服务即可
2. 刷新配置命令 

		### 刷新my-initializr配置测试  ** 可以替换成端口号
		POST https://config-server-git.jetbrains.org.cn/bus/refresh?destination=my-initializr:**

# 公共config-server

* https://config-server-git.jetbrains.org.cn
* 远程配置中心位置：https://github.com/changdaye/spring-cloud-config-repo-demo，添加自己的配置只需要提交request合并即可。


# 备注
Spring Cloud Bus的更新只对三种情况有效

1. @ConfigurationProperties
2. @RefreshScope
3. 日志级别


# 参考资料

1. https://springcloud.cc/spring-cloud-dalston.html#_spring_cloud_config_server
2. https://github.com/changdaye/spring-cloud-config-repo-demo
3. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-config-server-git
