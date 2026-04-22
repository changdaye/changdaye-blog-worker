---
title: "Kubernetes 入门"
subtitle: "\\\"Kubernetes 入门 \\\""
description: "Kubernetes 是什么"
date: 2018-09-13
author: "Mr Chang"
tags:
  - Kubernetes
  - docker
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# Kubernetes 是什么

1. Kubernetes（以下简称k8s）是用于自动部署、扩展和管理容器化应用程序的开源系统。Google设计并捐赠给Cloud Native Computing Foundation来使用的。 它旨在提供“跨主机集群的自动部署、扩展以及运行应用程序容器的平台”。 它支持一系列容器工具, 包括Docker等
2. Kubernetes 不局限于任何一种语言，没有限定任何边编程接口，所以不论是用Java、Go、C++还是python编写的服务，都可以毫无困难的使用k8s。
3. k8s是一个完备的分布式系统支撑平台。

# 为什么用k8s

1. IT从来都是由新技术驱动的行业
2. 使用k8s可以直接轻装上阵的开发复系统，减少运维人员成本
3. k8s全面拥抱微服务
4. 可以随时随地迁移到公有云、私有云
5. k8s具有超强的横向扩容能力

# k8s基本概念和术语

1. Master ：集群控制节点
	* kube-apiserver ：提供http rest 接口的进程，可以对所有资源进行增删改查
	* kube-controller-manager ：k8s里所有资源对象的自动化控制中心
	* kube-scheduler ：负责资源调度（Pod 调度）的进程
	* etcd server ： 保存资源对象的，可以理解为数据库

2. Node ： 除了master之外的，集群中的其他节点，也叫做worker节点。
	* kubelet：负责pod对应的容器的创建启动等任务，同时与maser节点密切协作，实现集群管理的基本功能
	* kube-proxy：实现k8s service 的通信与负载均衡机制的重要组件
	* docker engine ： docker 引擎，负责本机的容器创建和管理工作
3. Pod ： k8s 集群中的最小单位，容器的集合
4. Label(标签):更好的关系资源对象，使用自定义label标签key=value
5. Replication Controller（RC）：使用rc定义一个期望的场景，使pod的副本数量时刻都保持这个期望值，如rc设置副本数量是3，则pod时刻保持是3个
6. Deployment：RC的升级版
7. Horizontal Pod Autoscaler（HPA）：实现pod的横向自动扩容
8. Service：服务，对内或者对外提供服务
9. Volume（存储卷）：pod中能够被多个容器访问的共享目录
10. Namespace（命名空间）：常用于不同项目做资源隔离
11. Annotation（注解）：使用方式与Label类似
