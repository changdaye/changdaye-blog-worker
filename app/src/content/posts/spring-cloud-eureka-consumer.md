---
title: "spring-cloud-eureka-consumer"
subtitle: "\\\"普通服务消费者（传统方式）\\\""
description: "创建 Eureka-Consumer"
date: 2018-03-30
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-consumer
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---### 创建 Eureka-Consumer

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
		public class SpringCloudEurekaConsumerApplication {
		
		    public static void main(String[] args) {
		        SpringApplication.run(SpringCloudEurekaServerApplication.class, args);
		    }
		}
3. 修改application配置文件，添加配置

		spring.application.name=eureka-consumer
		server.port=8082
		eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/
		
4. 启动效果，可以看到没有任何服务注册上来
   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/81721676.jpg)

5. spring-cloud-eureka-consumer 调用 spring-cloud-eureka-client 中的接口
	
	
	    @GetMapping("/consumer")
	    public String dc() {
	
	        //获取具体的服务提供者的地址
	        ServiceInstance serviceInstance = loadBalancerClient.choose("eureka-client");
	        String url = "http://" + serviceInstance.getHost() + ":" + serviceInstance.getPort() + "/dc";//拼接具体的请求地址
	
	        System.out.println(url);
	
	        return restTemplate.getForObject(url, String.class);
	
	    }
	
# 思考

根据上述方式，我们实现了简单的服务调用，那么有个疑问，如果`spring-cloud-eureka-client`有多个呢，那么我们如何处理呢，这里spring-cloud为我们实现了`负载均衡(spring-cloud-eureka-consumer-ribbon)`，下篇介绍

	
# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-consumer
    
   2. https://www.jianshu.com/p/4fd7c2bac05b
    
   3. https://springcloud.cc/spring-cloud-dalston.html#spring-cloud-ribbon
