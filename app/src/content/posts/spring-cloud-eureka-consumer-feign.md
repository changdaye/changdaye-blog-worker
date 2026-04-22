---
title: "spring-cloud-eureka-consumer-feign"
subtitle: "\\\"更快捷优雅的客户端负载均衡服务消费\\\""
description: "声明性REST客户端：Feign"
date: 2018-04-01
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-consumer-feign
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 声明性REST客户端：Feign
Feign是一个声明式的Web服务客户端。这使得Web服务客户端的写入更加方便 要使用Feign创建一个界面并对其进行注释。它具有可插入注释支持，包括`Feign注释`和`JAX-RS注释`。Feign还支持可插拔编码器和解码器。Spring Cloud增加了对Spring MVC注释的支持，并使用Spring Web中默认使用的`HttpMessageConverters`。Spring Cloud集成Ribbon和Eureka以在使用Feign时提供负载均衡的http客户端。
# 创建 Eureka-Consumer-Feign

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
	            <artifactId>spring-cloud-starter-eureka</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-feign</artifactId>
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
	
2. 启动类上写注解

		@SpringBootApplication
		@EnableEurekaClient
		@EnableFeignClients
		public class SpringCloudEurekaConsumerFeignApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudEurekaConsumerFeignApplication.class, args);
		    }
		}
3. 修改application配置文件，添加配置

		spring.application.name=spring-cloud-eureka-consumer-feign
		server.port=8084
		eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/		
4. 启动效果
   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/69111377.jpg)
    * 这里看到我们启动了2个eureka-client，因为Feign集成了Ribbon，所以启动2个client正好可以测试负载均衡
	
5. spring-cloud-eureka-consumer-feign 调用 spring-cloud-eureka-client 中的接口
	* controller很简单
	
			@GetMapping("/consumer")
			    public String dc() {
			        return dcClientService.consumer();
			    }
   * service书写（service上多了注解@FeignClient，value值是eureka-client注册的服务名）
   		
	   		@FeignClient(value = "eureka-client")
			public interface DcClientService {
			
			    @GetMapping("/dc")
			    String consumer();
			}
6. 请求ip:8084/consumer(及`spring-cloud-eureka-consumer-feign接口`)观察`eureka-client中dc接口日志`输出，两个eureka-client，dc接口日志如果都有输出及实现了负载均衡。

# 思考

根据前几篇的博客，我们基本了解了spring cloud 中eureka-server，eureka-client，ribbon，feign，并实现了很优雅的调用eureka-client的服务，那么有个问题，如果eureka-client挂了或者出处了如何处理，是否可以在spring-cloud-eureka-consumer-**中设置如果eureka-client挂了，就执行另外的逻辑，有人想到了try catch，下一节我们引入`Hystrix断路器	`
# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-consumer-feign
      
   2. https://www.jianshu.com/p/4070dd376978
    
   3. https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-feign
