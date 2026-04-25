---
title: "spring-cloud-eureka-client"
subtitle: "\\\"服务注册与发现-客户端\\\""
description: "创建 Eureka-Server-Client"
date: 2018-03-29
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-client
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---### 创建 Eureka-Server-Client

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
	            <artifactId>spring-boot-starter-web</artifactId>
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
	
2. 启动类上写注解 `@@EnableEurekaClient`

		@SpringBootApplication
		@@EnableEurekaClient
		public class SpringCloudEurekaClientApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudEurekaServerApplication.class, args);
		    }
		}
3. 修改application配置文件，添加配置

   	spring.application.name=eureka-client
   	server.port=8081
   	eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/

4. 启动效果，可以看到没有任何服务注册上来

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-28/10326339.jpg)
	
# 注意

这里提示的红字英文是我们关闭了eureka-server的自我保护模式，及eureka-server，application配置文件中的这几行配置

	#关闭保护机制
	eureka.server.enable-self-preservation=false
	#心跳间隔时间1s
	eureka.instance.lease-renewal-interval-in-seconds=1
	#连续2s未响应时将服务注销
	eureka.instance.lease-expiration-duration-in-seconds=2
	
# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-client
    
   2. https://www.jianshu.com/p/599c74a9035e
    
   3. https://springcloud.cc/spring-cloud-dalston.html#_service_discovery_eureka_clients
