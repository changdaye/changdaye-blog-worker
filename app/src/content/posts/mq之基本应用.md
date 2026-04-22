---
title: "MQ之基本应用"
subtitle: "\\\"MQ之基本应用 \\\""
description: "简介"
date: 2019-11-15
author: "Mr Chang"
tags:
  - MQ
cover: "/images/site/post-bg-e2e-ux.jpg"
featured: false
draft: false
---# 简介
消息队列 MQ 既可为分布式应用系统提供异步解耦和削峰填谷的能力，同时也具备互联网应用所需的海量消息堆积、高吞吐、可靠重试等特性。

# 应用场景

* 削峰填谷：诸如秒杀、抢红包、企业开门红等大型活动时皆会带来较高的流量脉冲，或因没做相应的保护而导致系统超负荷甚至崩溃，或因限制太过导致请求大量失败而影响用户体验，消息队列 MQ 可提供削峰填谷的服务来解决该问题。
* 异步解耦：交易系统作为淘宝/天猫主站最核心的系统，每笔交易订单数据的产生会引起几百个下游业务系统的关注，包括物流、购物车、积分、流计算分析等等，整体业务系统庞大而且复杂，消息队列 MQ 可实现异步通信和应用解耦，确保主站业务的连续性。
* 顺序收发：细数日常中需要保证顺序的应用场景非常多，比如证券交易过程时间优先原则，交易系统中的订单创建、支付、退款等流程，航班中的旅客登机消息处理等等。与先进先出（First In First Out，缩写 FIFO）原理类似，消息队列 MQ 提供的顺序消息即保证消息 FIFO。
* 分布式事务一致性：交易系统、支付红包等场景需要确保数据的最终一致性，大量引入消息队列 MQ 的分布式事务，既可以实现系统之间的解耦，又可以保证最终的数据一致性。
* 大数据分析：数据在“流动”中产生价值，传统数据分析大多是基于批量计算模型，而无法做到实时的数据分析，利用阿里云消息队列 MQ 与流式计算引擎相结合，可以很方便的实现将业务数据进行实时分析。
分布式缓存同步：天猫双 11 大促，各个分会场琳琅满目的商品需要实时感知价格变化，大量并发访问数据库导致会场页面响应时间长，集中式缓存因为带宽瓶颈限制商品变更的访问流量，通过消息队列 MQ 构建分布式缓存，实时通知商品数据的变化。


## 解耦
* MQ未参与系统，系统耦合
![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/MQ%E4%B9%8B%E8%A7%A3%E8%80%A6-%E6%9C%AA%E8%A7%A3%E8%80%A6%E5%9B%BE.png)

* MQ参与系统解耦
  ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/MQ%E8%A7%A3%E8%80%A6%E4%B9%8B%E5%8F%82%E4%B8%8E%E7%B3%BB%E7%BB%9F%E8%A7%A3%E8%80%A6.png)

## 异步
* MQ未参与系统，各系统之间同步调用
  ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/1.png)
* MQ参与系统，各系统之间异步调用
  ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/2.png)

## 消峰
* MQ未参与系统，用户高并发请求时
  ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20191115143048-WX20191115-142912@2x.png)
* MQ未参与系统，用户高并发请求时，消峰处理
  ![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20191115143649-WX20191115-143636@2x.png)

# 系统引入MQ带来的缺点

使用第二张图说明

* 系统可用性降低，如果系统A给MQ发送消息时MQ故障，无法接受到消息，则系统BCD无法处理请求
* 系统复杂度提高，本来只需要维护系统ABCD即可，现在还需要维护MQ，且增加学习成本
* 系统一致性问题复杂，系统A发送3条消息给MQ，但是其中MQ故障丢了1条消息，则系统BCD的数据会跟系统A对应不上


# Kafka、ActiveMQ、RabbitMQ、RocketMQ 有什么优缺点？

![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/20191115152454-WX20191115-152443@2x.png)
