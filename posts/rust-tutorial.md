---
title: 快速上手Rust, 变量声明，函数定义，错误处理，条件语句，循环，数组，结构体
date: 2025-04-13
category: Note
tags: 
    - Rust
description: 不要被 Rust 的复杂特性吓退，用最小的知识快速上手 Tauri，Tauri 是基于 Rust 的跨平台桌面应用框架，使用 Tauri 可以快速开发跨平台的桌面应用，相对于 Electron 来说，Tauri 更小巧，更安全，更快速。
draft: false
outline: [2,3]
# sticky: true
done: true
---

# Rust 基础

:book: 本文档是 Rust 基础教程，适合初学者快速上手。
[Rust 语言圣经（中文）](https://course.rs/about-book.html)

## 变量声明

```rust
let x = 1;
let y = 2;
```

## 函数定义

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y
}


## 错误处理

```rust
fn divide(x: i32, y: i32) -> Result<i32, String> {
    if y == 0 {
        Err("除数不能为0".to_string())
    } else {
        Ok(x / y)   
    }
}
```

## 条件语句

```rust
if x > 0 {
    println!("x 大于0");
} else {
    println!("x 小于等于0");
}
```

## 循环

```rust
for i in 0..10 {
    println!("i = {}", i);
}
```

## 数组

```rust
let arr = [1, 2, 3, 4, 5];
```

## 结构体
...
