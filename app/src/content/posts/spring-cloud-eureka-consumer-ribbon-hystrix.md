---
title: "spring-cloud-eureka-consumer-ribbon-hystrix"
subtitle: "\\\"服务调用容错\\\""
description: "断路器：Hystrix客户端"
date: 2018-04-02
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-eureka-consumer-ribbon-hystrix
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 断路器：Hystrix客户端
Netflix的创造了一个调用的库Hystrix实现了断路器图案。在微服务架构中，通常有多层服务调用。
![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/50678168.jpg)
较低级别的服务中的服务故障可能导致用户级联故障。当对特定服务的呼叫达到一定阈值时（Hystrix中的默认值为5秒内的20次故障），电路打开，不进行通话。在错误和开路的情况下，开发人员可以提供后备。
![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/35238150.jpg)
开放式电路会停止级联故障，并允许不必要的或失败的服务时间来愈合。回退可以是另一个Hystrix保护的调用，静态数据或一个正常的空值。回退可能被链接，所以第一个回退使得一些其他业务电话又回到静态数据。
# 创建 Eureka Consumer Ribbon Hystrix

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
	            <artifactId>spring-cloud-starter-eureka</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-hystrix</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-ribbon</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-actuator</artifactId>
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
   @EnableCircuitBreaker
   public class SpringCloudEurekaConsumerRibbonHystrixApplication {
   public static void main(String[] args) {
   SpringApplication.run(SpringCloudEurekaConsumerRibbonHystrixApplication.class, args);
   }
	
	    @Bean
	    @LoadBalanced//负载均衡
       public RestTemplate restTemplate() {
           return new RestTemplate();
       }
   }
3. 修改application配置文件，添加配置

   	spring.application.name=eureka-consumer-ribbon-hystrix
   	server.port=8085
   	eureka.client.serviceUrl.defaultZone=http://eureka-server.jetbrains.org.cn/eureka/4. 启动效果 

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/1264846.jpg)
5. eureka-consumer-ribbon-hystrix 调用 spring-cloud-eureka-client 中的接口

   	@Service(value = "consumerService")
   	public class ConsumerService {
   	    @Autowired
   	    private RestTemplate restTemplate;
   	
   	    @HystrixCommand(fallbackMethod = "fallback") //调用eureka-client提供的服务，如果出现问题则调用fallback方法
   	    public String consumer() {
   	        return restTemplate.getForObject("http://eureka-client/dc", String.class);
		    }
		
		    public String fallback() {
		        return "fallback";
		    }
		}
6. 请求ip:8085/consumer(及`eureka-consumer-ribbon-hystrix接口`)观察`eureka-client中dc接口日志`输出，两个eureka-client，dc接口日志如果都有输出及实现了负载均衡。`关闭`其中一个eureka-client，观察到返回值变成`fallback`,证明如果eureka-client出现问题的时候，调用方会自动执行fallback方法

# 思考

如果我想要观察接口失败情况，如何解决？引入下期的Dashboard


# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-eureka-consumer-ribbon-hystrix
         
   2. https://www.jianshu.com/p/220663a93198
    
   3. https://springcloud.cc/spring-cloud-dalston.html#_circuit_breaker_hystrix_clients
