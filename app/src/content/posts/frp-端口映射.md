---
title: "frp 端口映射"
subtitle: "\\\"frp 端口映射 \\\""
description: "简介"
date: 2019-06-13
author: "Mr Chang"
tags:
  - frp
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 简介

[frp](https://github.com/fatedier/frp) 是一个可用于内网穿透的高性能的反向代理应用，支持 tcp, udp 协议，为 http 和 https 应用协议提供了额外的能力，且尝试性支持了点对点穿透。

# 场景

1. 利用处于内网或防火墙后的机器，对外网环境提供 HTTP 或 HTTPS 服务。
2. 对于 HTTP, HTTPS 服务支持基于域名的虚拟主机，支持自定义域名绑定，使多个域名可以共用一个 80 端口。
3. 利用处于内网或防火墙后的机器，对外网环境提供 TCP 和 UDP 服务，例如在家里通过 SSH 访问处于公司内网环境内的主机

# 安装

1. 服务端

	* wget https://github.com/fatedier/frp/releases/download/v0.27.0/frp_0.27.0_linux_amd64.tar.gz
	
	* tar -zxvf frp_0.27.0_linux_amd64.tar.gz
	
	* cd frp_0.27.0_linux_amd64
	
	* rm -rf frps.ini
	
	* mv frps_full.ini frps.ini
	
	* vi frps.ini
	
	* 去除 subdomain_host 配置 或者写自己的根域名
	
	* 启动 ./frps -c ./frps.ini 
	
2. 客户端（mac为例）

	* wget https://github.com/fatedier/frp/releases/download/v0.27.0/frp_0.27.0_darwin_amd64.tar.gz
	
	* tar -zxvf frp_0.27.0_darwin_amd64.tar.gz
	
	* cd frp_0.27.0_darwin_amd64
	
	* vi frps.ini ，配置如下（http协议为例）
	
		![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190613164405.png)
	
	* 配置域名解析，记录值是 frp server 的ip
	
		![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190613164319.png)
	
	* 启动 ./frpc -c ./frpc.ini
	
# 验收

![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190613164720.png)

![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190613164602.png)

* 账号密码是 admin admin

![](/images/posts/raw.githubusercontent.com/changdaye/my-images/master/20190613164817.png)
