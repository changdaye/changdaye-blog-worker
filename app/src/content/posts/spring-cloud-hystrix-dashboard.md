---
title: "spring-cloud-hystrix-dashboard"
subtitle: "\\\"Hystrix指标数据的可视化面板\\\""
description: "断路器：Hystrix仪表板"
date: 2018-04-03
author: "Mr Chang"
tags:
  - spring cloud
  - spring-cloud-hystrix-dashboard
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 断路器：Hystrix仪表板

Hystrix的主要优点之一是它收集关于每个HystrixCommand的一套指标。Hystrix仪表板以有效的方式显示每个断路器的运行状况。
![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/31513582.jpg)
	
# 创建  Hystrix Dashboard

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
	            <artifactId>spring-cloud-starter-hystrix</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.cloud</groupId>
	            <artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
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
	@EnableHystrixDashboard
	public class SpringCloudHystrixDashboardApplication {
	
	    public static void main(String[] args) {
	        SpringApplication.run(SpringCloudHystrixDashboardApplication.class, args);
	    }
	}

3. 修改application配置文件，添加配置

   spring.application.name=hystrix-dashboard server.port=8087

4. 启动后访问地址 http://ip:8087/hystrix

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/67920095.jpg)

5. 配置

   第一行参数输入 http://ip:8086/hystrix.stream,参考项目spring-cloud-eureka-consumer-ribbon-hystrix-dashboard

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-3-29/62001912.jpg)

# 思考

hystrix-dashboard 监控项目是一个一个配置url的，相对比较麻烦，那么有没有更好的组件呢，下期我们介绍spring-cloud-turbine

# 参考资料
   1. https://github.com/changdaye/spring-cloud-study/tree/master/spring-cloud-hystrix-dashboard
            
   2. https://www.jianshu.com/p/680584683ec2
       
   3. https://springcloud.cc/spring-cloud-dalston.html#_circuit_breaker_hystrix_dashboard
