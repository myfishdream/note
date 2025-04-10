---
title: GitHub都有哪些功能，GitHub Desktop功能与git区别
date: 2025-04-10 10:30
category: Note
tags:
    - Github
    - Git
description: 功能介绍
outline: [2,3]
---

# GitHub + Git整理

访问Github辅助工具：<a href="https://wwyk.lanzoue.com/b00y9vcm7c" target="_blank">dev sidecar 直供下载</a>

```
密码：2ljp
```

## GitHub仓库

### 历史起源

[Git与GIthub的故事](https://blog.brachiosoft.com/en/posts/git)

### 汉化

使用 **篡改猴** + **Github 汉化插件** [链接直达github-chinese](https://github.com/maboloshi/github-chinese)

> [!important]
>
> 此插件主要针对菜单，按钮功能汉化，无法对README文件内的英文进行汉化，可以借助其他插件，比如 <u>沉浸式翻译</u>

### 快捷键

`.` 网页版VsCode 

`/` 快速打开Github搜索框

`T` 快速定位到文件搜索栏

`L` 在代码中可以快速定位到行号

`.` 网页版VsCode 

`/` 快速打开Github搜索框

`T` 快速定位到文件搜索栏

`L` 在代码中可以快速定位到行号

选中行功能：

- Copy line 复制这一行
- Copy permalink 复制永久链接（可以通过分享链接，与其他人分享代码）

- View git blame 查看文件提交历史（每行代码的提交者）

...

在网页版VsCode 中如果想对代码进行调试，Github提供了一个codespace的运行环境，点击`运行/调试`按钮，点击`继续工作`，点击`Create New Codespace`，根据需求从Github申请一个远程的运行环境，点击`Run`，然后就可以在网页版Vscode中调试修改代码了

> [!important]
>
> Github Codespace 有一定的免费使用额度
>
> 在账号`Settings`，在`Billing and plans`点击`Plans and usage`，往下找到**codespaces**的使用额度，每个账号每个月提供120小时的免费使用额度，超过则需要付费

### 搜索功能

#### search

搜索你感兴趣的项目，可以搜索项目，代码，讨论等...

或者使用**高级搜索**，在Github搜索框中输入 `saved:`点击`Manage saved searches`即可创建搜索预设

[点击跳转search](https://github.com/search)

#### explore

[点击跳转explore](https://github.com/explore)热门仓库以及兴趣推荐等...

#### stars

查看所有你点击过stars的项目[点击跳转stars](https://github.com/stars)

### Issue

用于与项目作者进行讨论

可以点击`New issue`发起一个讨论，比如提出你在项目中遇到的bug，帮助对项目进行完善或者对项目新功能的期待，也可以参与讨论或者帮助其他人解决问题

**Issue分为两种**：

- **open** 指的是还没有解决的bug，或者还在讨论的问题
- **closed** 指的是已经解决的bug，或者已经结束的讨论

> [!tip]
>
> 在使用和学习开源项目中，不妨在搜索框 ↑  中搜一搜，因为有些问题别人可能也遇到了，并且在Issue中已经有人给出了解决方案

### Releases

项目的发行安装包，根据实际需求下载对应安装包，在CMD窗口输入`wmic cpu get caption`查看自己CPU架构

### 开源协议

> 图片http://ruanyifeng.com/blog/Cc-By-3.0/2011.5.2

![开源协议图解]()

**GPL**：其他人修改完代码的项目也必须保持开源（衍生作品也必须开源）

争议：具有传染性，意味着如果一个项目使用了部分GPL代码，则整个项目都必须遵循GPL协议，而且必须保持开源

**LGPL**：宽松版的GPL协议，新增部分的代码不必要使用原版协议，这样不怕GPL协议传染整个项目

**Apache**：需要为每个修改后的文件放置版权说明

**MIT/BSD**：只需要在项目中保留一份协议的副本 ，就可以几乎随意使用开源代码

**BSD**：不可使用原作者的名字对项目进行促销推广

### Gist

一般用来分享单个代码文件，或者是小的代码片段

#### 分享方式

**网页嵌入**

```js
<script src="https://gist.github.com/yumengjh/971e97c8855a5bb8e7ba2756f3985dfc.js"></script>
```

**原地址页面**：

https://gist.github.com/yumengjh/971e97c8855a5bb8e7ba2756f3985dfc

**克隆**

...

### pull reauest

意思是 **拉取请求**（合并请求）

将更改从一个分支合并进另外一个分支的提案，通常来说，项目的贡献者在自己的分支上进行代码修改，然后他会创建一个pull request，也就是把自己的分支合并进主干分支的提案

pull request**会比较两个分支之间的代码差异**

然后仓库的管理员会来审核这个代码的改动，这个过程叫做**Code review**也就是代码审核

在代码审核过程中，管理员可以提出自己的修改意见，当管理员确认代码改动是OK的以后，他会同意合并，这样特性分支的代码就会合并进主干分支，功能开发也就完成

#### 创建pull request

点击`pull request`选项，再点击`New pull request`选项

然后选择合并方向

对修改确认无误后，点击`Create pull request`，写一个标题，填写描述，完成后点击`Create pull request`

管理员可以点击`Files changed`开始审核代码 

审核时，管理员可以比较代码的不同，他可以在某一行上点击加号留下评论，最终他会给一个代码审核的意见

最后，管理员认为代码OK，可以合并的时候，就可以点击`merge pull request`

### WiKi

点击头部的wiki标签栏即可进入

用于存放项目的详细文档，指南，API文档，设计文档。适合放置**较大，结构化**的文档内容

Wiki也是一个独立的Git仓库，可以独立克隆和推送

### Insights

用于帮助项目维护者和贡献者分析和理解他们代码库的状态和活动。

### Pulse

Pulse是一个快速查看项目近期互动的好方法，可以让你了解项目的动态。

pulse提供了项目的简要活动概要，包括：

已合并的拉取请求（Merged Pull Request）

开启的拉取请求（open Pull request）

关闭的问题 （Close issues）

新开启的问题（New Issues）

### Contributors

这个部分展示了所有的贡献者的详细信息，包括每个贡献者的提交信息，添加和删除的代码行数等，它帮助识别主要贡献者以及他们对项目的贡献量

### Traffic

Traffic insights提供了有关项目访问量的详细信息

### Dependabot

Dependabot是一个GIthub自动化的功能，可以**定时检查依赖项有无更新**，如果存在依赖的库有版本更新，那就自动创建**pull request** 帮助更新到最新版本

```yaml
version: 2
updates:
  - package-ecosystem: "npm" # See documentation for possible values
    directory: "/" # Location of package manifests
    schedule:
      interval: "weekly"

```

`package-ecosystem`指的是**包管理**工作名字

`directory`指的是项目依赖文件的**目录**

`interval`**扫描间隔** - weekly指的是每周扫描一次

Dependabot更多功能：[点击跳转](https://docs.github.com)，进入后搜索 **dependabot.yml** 即可深度学习Dependabot的配置

### Project

Github Project就是项目看板，是一种**可视化管理工具**，用于组织和跟踪项目的进度任务

- **Todo** 是代办事项
- **In Progress** 是进行中事项
- **Done** 是完成事项

点击卡片左下角即可创建事项

### current iteration

current iteration 指的是当前迭代的工单状态

迭代 是敏捷开发里面的一个专业术语，一般两个星期是一个迭代，每个迭代上线一批功能，然后经过QA测试，然后推送上线，也可以自己定义迭代的时间周期等等的，在右上角的设置里面调节

### Discussion

围绕项目的论坛，一般discussion是比较大的项目启用的功能，小项目用Issue即可

### Github Desktop

[点击跳转GithubDesktop](https://desktop.github.com/download/)

[**通过动画学习Git**](https://pcottle.github.io/learnGitBranching/)

[learnGitBranching项目](https://github.com/pcottle/learnGitBranching)

#### 部分提交

在Github Desktop代码区域点击行号可以进行指定行的提交

#### 放弃更改

右键文件，选择`Discard changes`即可放弃更改，指的是放弃这个文件在本地目录(工作区)的修改

还可以右键 `1 changed file`第一个是**放弃所有更改**，第二个是**保存所有更改**

把这个文件(**工作区**)同步成本地分支(**本地仓库**)的样子

> [!note]
>
> 放弃的文件会添加到**回收站**内，文件可在**电脑本地回收站**再次找回

#### 保存更改

```bash
git stash // git命令
```

如果工作目录中有**未保存的代码**，是**无法切换分支**的，可以选择**保存更改**代码再切换分支

保存更改后此时本地文件已经**没有保存的更改代码**了

点击`Stashed Changes`查看保存的更改，`Restore`还原，`Discard`丢弃

> [!important]
>
> **局限性**：Desktop最多只能存储一次的改动，Git命令行则没有，它可以存储很多次的改动

但是如果强行切换分支，会有两个选择

第一个`Leave my changes on feature`就是存储更改代码

第二个`Bring my changes to main`将更改代码带向main分支

**场景**：如果你有开发了一半的代码，现在出现了一个临时紧急工作，需要切换分支进行处理。

对于还没有提交的改动我们可以进行一下处理:

| 操作方法 | git命令                                   | 修改                                       |
| -------- | ----------------------------------------- | ------------------------------------------ |
| commit   | git add. + git commit -m 'commit message' | 工作区文件提交本地分支                     |
| stash    | git stash                                 | 将改动保存起来                             |
| discard  | git reset --hard                          | 抛弃工作区与暂存区的更改                   |
| switch   | git switch ‘branch name’                  | 直接切换分支，你的本地改动会带到新分支上。 |

#### 撤回提交

```bash
git reset
```

点击`History`，右键之前版本选择`Reset to commit`即可

撤销提交后，文件改动保存在工作目录中

> [!important]
>
> 推送远端后不允许`Reset`，**只限于Desktop**，不允许一些高危操作
>
> **但是可以使用Git命令行进行操作**
>
> 右键仓库选择`Open in Command Prompt`打开命令提示符
>
> **查看历史提交记录**
>
> ```bash
> git log // 按Q键退出
> ```
>
> **mix**指的是撤销提交，但是保留我的本地文件更改
>
> ```bash
> git reset --mix 'ID'
> ```
>
> 当通过Git撤销的提交存在远程分支，本地是没有了，因为刚刚通过命令行撤回了，但是还存在于远程，如果在**GitHub Desktop**点击`pull`会把那次提交又拿回来了
>
> 所以继续使用**git命令行**操作，**把本地分支强行推送远程仓库**
>
> ```bash
> git push -f
> ```
>
> `-f`指的是强制推送，不论远端分支是什么状态，就把**本地分支强制覆盖到远端**（高危操作）

#### 反向提交

```bash
git revert
```

在`History`页面右键版本选择`Revert changes in commit`生成了一个新的提交，最后推送即可

Revert 的意思是使用**反向操作**抵消上一次的更改

**反向操作**：比如之前是删除一行代码，那就是增加一行代码，反之，新增则是删除

> [!tip]
>
> 在多人协作开发中，我们应该使用**revert操作**，而不是使用**命令行reset操作**，因为推送到远端后，不允许reset后提交，只能拉回代码，但是可以使用命令行强制推送覆盖远端仓库

#### 更改提交

```bash
git commit --amend
```

右键版本选择`Amend commit...`  ，意思是修正更改，点击后即可重新编辑**提交信息**或者**代码**

完成后点击`Amend last commit`，**注意：并没有产生新的提交，只是把上一次的提交修正一下**

**注意：只适用于最新的提交**

> [!important]
>
> 如果提交已经推送，再点击`Amend commit...`  ，会进行警告，提示我们这次修改完后，必须使用**force push**强制推送才能把修改推送到远端

| Git操作 | Git命令                                                      | 使用场景                                 | 注意事项                                                     |
| ------- | ------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ |
| discard | git restore '文件名' (单个文件)    git reset --hard (所有文件) | 工作区的修改还未commit                   | 舍弃掉工作区修改的文件                                       |
| reset   | git reset 'commit ID'                                        | 还原到某个commit状态，舍弃之后的commit   | 如果reset已经推送到远端的commit，会强制推送，集成分支禁止强制推送 |
| revert  | git revert 'commit ID'                                       | 使用一个新的提交抵消掉某一次commit的修改 |                                                              |
| amend   | git commit --amend                                           | 只能修改最新一次commit                   | 如果amend 已经推送到远端的commit，会强制推送，集成分支禁止强制推送 |

#### 标签

`Tag`意思把选中的版本标记为一个项目的重要事件

可以创建一个Tag作为软件的版本号

**操作**：右键历史版本选择`create tag`，写一个tag名称，比如`v1.3.5`，表示这一次提交就是项目的v1.3.5版本，之后可以使用版本号进行版本发布

#### 分支合并

之前使用的是**Github网站**进行`pull request`进行合并

也可以使用**GIthub Desktop**进行`merge`分支合并

```bash
git merge
```

首先切换到接受合并的分支

点击`Choose a branch to merge into ***`，选择一个分支合并进**当前分支**

##### Create a merge commit

```bash
git merge main
```

**Create a merge commit**：创建一个新的commit，合并到一起

...