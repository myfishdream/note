---
title: 单独给几个字体定制一个字体WOFF文件,而不需要使用整个文件
date: 2025-04-13
category: Note
tags:
    - Tool
description: 使用Python库fonttools完成转换，生成的文件仅有几Kb,与原文件的8M对比...
outline: [2,4]
---

# 使用定制字体WOFF文件

安装**Python**

https://www.python.org/

安装**fonttools**

```sh
 pip install fonttools
```

创建一个`chars.txt`文件写入需要定制的文字

**使用命令**

```sh
pyftsubset 原字体.ttf --text-file=chars.txt --output-file=mini-font.woff 
```

> [!IMPORTANT]
>
> **首先得有一个完整的字体文件才行**

**Google Fonts**官网：[https://fonts.google.com](https://fonts.google.com/)
