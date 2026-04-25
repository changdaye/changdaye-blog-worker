---
title: "spring-cloud-eureka-consumer-ribbon"
subtitle: "\\\"客户端负载均衡服务消费者\\\""
description: "客户端负载平衡器：Ribbon"
date: 2018-03-31
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-consumer-ribbon
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 客户端负载平衡器：Ribbon
Ribbon是一个客户端负载均衡器，它可以很好地控制HTTP和TCP客户端的行为。Feign已经使用Ribbon，所以如果您使用`@FeignClient`，则本节也适用。

Ribbon中的中心概念是指定客户端的概念。每个负载平衡器是组合的组合的一部分，它们一起工作以根据需要联系远程服务器，并且集合具有您将其作为应用程序开发人员（例如使用`@FeignClient`注释）的名称。Spring Cloud使用`RibbonClientConfiguration`为每个命名的客户端根据需要创建一个新的合奏作为`ApplicationContext`。这包含（除其他外）`ILoadBalancer`，`RestClient`和`ServerListFilter`。
# 创建 Eureka-Consumer-Ribbon

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
	            <artifactId>spring-cloud-starter-ribbon</artifactId>
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
		public class SpringCloudEurekaConsumerRibbonApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudEurekaServerApplication.class, args);
		    }
		}
		
		@Bean
	    @LoadBalanced//负载均衡
	    public RestTemplate restTemplate() {
	        return new RestTemplate();
	    }
3. 修改application配置文件，添加配置

		spring.application.name=eureka-consumer-ribbon
		server.port=8083
		eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/
		
4. 启动效果
   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/62845163.jpg)
	
	* 这里看到我们启动了2个eureka-client，为了测试`ribbon负载均衡`，默认使用的是`轮训规则`
5. spring-cloud-eureka-consumer-ribbon 调用 spring-cloud-eureka-client 中的接口

	    @GetMapping("/consumer")
	    public String dc() {
	
	        //获取具体的服务提供者的地址
	
	        return restTemplate.getForObject("http://eureka-client/dc", String.class);
	
	    }
6. 请求ip:8083/consumer(及`spring-cloud-eureka-consumer-ribbon接口`)观察`eureka-client中dc接口日志`输出，两个eureka-client，dc接口日志如果都有输出及实现了负载均衡。

# 思考

根据上述方式，我们实现了简单的负载均衡服务调用，发现有2个问题是restTemplate调用接口时每次都需要写请求地址与返回类型，那么有没有更优雅的方式呢？下节我们引入`Spring Cloud Feign`
	
# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-consumer-ribbon
    
   2. http://blog.didispace.com/spring-cloud-starter-dalston-2-2/
    
   3. https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon
