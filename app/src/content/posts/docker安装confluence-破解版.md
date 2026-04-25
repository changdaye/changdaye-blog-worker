---
title: "Docker安装Confluence(破解版)"
subtitle: "\\\"Docker安装Confluence(破解版) \\\""
description: "说明"
date: 2018-09-03
author: "Mr Chang"
tags:
  - Docker
  - Confluence
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 说明

confluence是一个专业的企业知识管理与协同软件，可以用于构建企业wiki。通过它可以实现团队成员之间的协作和知识共享。现在大多数公司都会部署一套confluence，用作内部wiki。现在confluence已收费，那么下面将介绍下Docker安装破解confluence的操作记录。

# 安装Confluence


`docker run -d --name confluence -p 8090:8090  --user root:root  cptactionhank/atlassian-confluence:latest`

1. 访问http://ip:8090/ 就可以看到Confluence的初始化和配置页面。

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/71584439.jpg)

2. 选择中文

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/75061040.jpg)

3. 选择产品安装并点击下一步，继续安装。

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/98211432.jpg)

4. 准备破解

   ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/18690107.jpg)
	
# 破解confluence


    下载破解confluence文件：
    
    atlassian-universal-plugin-manager-plugin-2.22.jar
    
    atlassian-extras-decoder-v2-3.2.jar
    
    
    `http://cdn-blog.oss-cn-beijing.aliyuncs.com/k2p-frp/atlassian-extras-decoder-v2-3.2.jar`
    
    `http://cdn-blog.oss-cn-beijing.aliyuncs.com/k2p-frp/atlassian-universal-plugin-manager-plugin-2.22.jar`


1. 进入confluence容器命令：

	`docker exec -it confluence /bin/sh`

2. 用下载的文件替换atlassian-extras-decoder-v2-3.x.jar/atlassian-universal-plugin-manager-plugin-2.22.x.jar文件（该文件下载到/opt下，替换前必须做之前的文件备份，方便回退）

	* 备份要替换的文件
		`mv /opt/atlassian/confluence/confluence/WEB-INF/lib/atlassian-extras-decoder-v2-3.3.0.jar   /mnt/`
		
		`mv /opt/atlassian/confluence/confluence/WEB-INF/atlassian-bundled-plugins/atlassian-universal-plugin-manager-plugin-2.22.5.jar /mnt`
		
3. 备份好文件后，退出confluence容器。拷贝下载的文件到confluence容器中。

    * 将下载的破解文件替换对应的jar
   		`docker cp atlassian-extras-decoder-v2-3.2.jar confluence:/opt/atlassian/confluence/confluence/WEB-INF/lib/`
   		
		`docker cp atlassian-universal-plugin-manager-plugin-2.22.jar  confluence:/opt/atlassian/confluence/confluence/WEB-INF/atlassian-bundled-plugins/`
		
4. 重新启动confluence容器。

   然后继续访问http://ip:8090，接着注册confluence的key

![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/91336780.jpg)
  
  
 5. 如图

![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/18-9-3/65303965.jpg)
  
 6. 设置mysql隔离级别  
  `SET GLOBAL tx_isolation='READ-COMMITTED';`

  
 # 总结
 
 后面的东西根据自己需求研究就好了。
