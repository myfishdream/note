---
title: 文章
date: 2025-4-6
category: Life
tags:
    - 心理
description: 这是文章的描述信息
# draft: true
# layout: page
---

# 标题


# Mermaid 图表测试

## 流程图 (Flowchart)

```mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|条件为真| C[处理流程]
    B -->|条件为假| D[结束流程]
    C --> D
```

## 时序图 (Sequence Diagram)

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    participant 数据库
    
    用户->>系统: 登录请求
    系统->>数据库: 查询用户信息
    数据库-->>系统: 返回用户数据
    系统-->>用户: 登录成功
```

## 类图 (Class Diagram)

```mermaid
classDiagram
    class Animal {
        +String name
        +makeSound() void
    }
    class Dog {
        +fetch() void
    }
    class Cat {
        +scratch() void
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

## 状态图 (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> 待处理
    待处理 --> 处理中: 开始处理
    处理中 --> 已完成: 处理完成
    处理中 --> 失败: 处理异常
    失败 --> 待处理: 重试
    已完成 --> [*]
```

## 甘特图 (Gantt Chart)

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 规划阶段
    需求分析       :a1, 2024-01-01, 7d
    系统设计       :a2, after a1, 10d
    section 开发阶段
    编码实现       :a3, after a2, 15d
    单元测试       :a4, after a3, 5d
    section 发布阶段
    系统测试       :a5, after a4, 5d
    发布上线       :a6, after a5, 2d
```


## 思维导图 (Mindmap)

```mermaid
mindmap
    root((博客系统))
        前端展示
            首页
            文章页
            分类页
            标签页
        后台管理
            文章管理
            用户管理
            设置管理
        数据存储
            数据库
            缓存
            文件存储
```

## 关系图 (ER Diagram)

```mermaid
erDiagram
    用户 ||--o{ 文章 : 发布
    文章 ||--o{ 评论 : 包含
    用户 ||--o{ 评论 : 撰写
    文章 }o--|| 分类 : 属于
```

## 总结

以上是 Mermaid 图表的主要类型测试，VitePress 与 Mermaid 的集成非常方便，可以轻松创建各种图表。