---
title: "发短信"
subtitle: "\\\"Twilio发送短信\\\""
description: "简介"
date: 2018-05-28
author: "Mr Chang"
tags:
  - Twilio
  - 发短信
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 简介

Twilio 为将来的商业沟通提供强大支持，并使开发人员能够将语音、VoIP 和消息传送嵌入到应用程序中。 它们对基于云的全球环境中所需的所有基础结构进行虚拟化，并通过 Twilio 通信 API 平台将其公开。 可轻松构建和扩展应用程序。 享受现用现付定价所带来的灵活性，并从云可靠性中受益。

利用 Twilio 语音，应用程序可以发起和接收电话呼叫。 Twilio SMS 使应用程序能够发送和接收文本消息。 利用 Twilio 客户端，可以从任何手机、平板电脑或浏览器发起 VoIP 呼叫并支持 WebRTC。


# 账号注册

关于账号注册可以参考这篇文章 ： http://uuxn.com/twilio-toll-free-sms


# 准备

使用前需要登陆官网获取三个参数

* accountSid
* authToken
* fromPhoneNumber

# 使用

1. 创建maven工程，添加依赖。

		<dependency>
			<groupId>com.twilio.sdk</groupId>
			<artifactId>twilio</artifactId>
			<version>7.17.0</version>
		</dependency>
	
2. 编写代码

		@RunWith(SpringRunner.class)
		@SpringBootTest
		public class DemoApplicationTests {
			private static final String accountSid = "ACxxxx"; // Your Account SID from www.twilio.com/user/account
			private static final String authToken = "xxxx"; // Your Auth Token from www.twilio.com/user/account
		
			@Test
			public void contextLoads() {
				Twilio.init(accountSid, authToken);
		
				Message message = Message.creator(
						new PhoneNumber("+xxx"),  // To number ,Phone number with area code
						new PhoneNumber("+xxx"),  // From number
						" A book is the same today as it always was and it will never change."                   // SMS body
				).create();
		
				if (! StringUtils.isEmpty(message.getSid())){
					System.out.println(message.getSid());
		
				}
	
			}
			
			
			@Test
            public void sendCall() throws URISyntaxException {
            	Twilio.init(accountSid, authToken);
            
            	Call call = Call.creator(
            			new PhoneNumber("+xxxx"),  // To number
            			new PhoneNumber("+xxxx"),  // From number
            			// Read TwiML at this URL when a call connects (hold music)
            			new URI("http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient")
            	).create();
            
            	if (! StringUtils.isEmpty(call.getSid())){
            		System.out.println(call.getSid());
            
            	}
            
            }
		}
		
3. 结果

	手机可以正常收到短信，使用的时候发送频率控制在1s一条
	
	
# 参考

https://www.twilio.com/docs/sms/quickstart/java

https://github.com/twilio/twilio-java
