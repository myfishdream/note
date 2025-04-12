---
title: GitHub都有哪些功能，GitHub Desktop功能与git区别
date: 2025-04-10
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

### 贡献者流程

一般先点击Issue参加讨论，可以把你的想法通过Issue和开发者进行交流

可以提一个Issue，填写标题和描述，描述你的大体的实现思路，实现完成后会提交pull request，请问维护者，大家觉得怎么样，**提交Issue**

如果开发者看到了一个Issue并且觉得不错，会回答你：期待你PR

**贡献**:

#### **第一步：**

先fork复刻项目，把项目复制一份到自己的名下

#### **第二步：**

在`Code`按钮，找到HTTPS复制，回到Desktop，找到`Clone repository...`输入即可

或者使用`git clone URL`

#### **第三步：**

创建分支，在分支上进行功能开发，而不是直接使用main分支

开发完功能后，提交一下，提交信息：实现xxx功能

#### **第四步：**

点击`Publish branch`推送远端

#### **第五步：**

同步一下母项目的代码，防止提交PR的时候不会产生冲突

回到GIthub仓库，点击`Sync fork`，从母项目往子项目同步代码

#### **第六步：**

把子项目的main分支合并到feature分支

因为子项目feature分支是个人分支，可以减少一次merge记录，选择Rebase，出现冲突按照需求解决即可

#### **第七步：**

点击`Force push origin`强制推送

通过了rebase方法同步了母项目代码，防止提交PR的时候不会产生冲突

#### **第八步：**

创建PR

当项目管理者认为代码可以的时候，点击`Merge pull request`

当图标变成**紫色Merged**

完成了对开源代码的贡献

仓库的Contributors就会出现贡献者的名字

贡献者可以回到本地将开发分支删除，保留main分支随时关注母项目的改动，有改动点击`sync fork`同步代码

如果还想进行功能开发，再在Desktop创建分支进行开发就行了

### Github大文件

在Github中单个文件的大小是被严格限制的，如果单个文件大于50M，push的时候回触发警告，如果大于100M会直接拒绝

**Git LFS (Git Large File System )** ->大文件系统

LFS使用一个单独的文件存储服务器专门存储大文件，我们仓库只存了一个大文件的引用

**安装LFS**

```bash
git lfs install 
```

**指定哪些文件需要由LFS管理**

```bash
git lfs track '文件类型'
```

`*.mp4`表示我系统的所有MP4文件都由大文件系统管理

当一个文件大于100M无法推送，得使用LFS就可以推送

> [!IMPORTANT]
>
> 存储空间并不是完全免费的，进人右上角个人账号，点击Setting，找到Biling and plans，有一个plans and usage，往下找，有一个**Git LFS Data**

### Github Action

#### Action脚本

Github 的自动化流水线

可以编写一个action脚本，制定Github完成一系列的自动化操作，最场景的用法就是CI/CD

CI/CD的意思是Continuous lntegration / Continuous Delivery，持续集成 持续交付

比如我们希望每提交一次代码的时候，程序能自动完成单元测试，代码编译，程序构建，推送到服务器并且完成部署，这整一套的自动化过程就是CI/CD

#### Action 市场

由于很多操作在很多项目里面是类似的，完全可以共享

所有允许开发者将每个操作写成独立的脚本文件存放到代码仓库里面

存放官方写好的Action https://github.com/actions

https://github.com/marketplace Github市场，其中也有Action选项卡，可以搜索需要的

每个Action 都是一套自动化的流程，都有相应的代码

#### 引用

引用别人的Action，使用	**uses: 作者名称/Action的名称@版本号**

```yaml
uses: sayyid5416/pyinstaller@v1
```

#### 术语

##### workflow

**workflow**（工作流程）：每个workflow对应一个文件，存放在仓库的.github/workflow目录

##### job

**job**（任务）：一个workflow由一个或者多个jobs构成，含义就是一次工作流程，需要完成的多个任务

##### step

**step**（步骤）：每个job由多个step构成，一步一步的完成

可以看到，workflow是有层级关系，第一层是workflow，第二层是job，第三次是step

**为什么要定义出job和step两个层级？区别？**

不同的job默认是**并行运行**，这样可以提高效率。并且每个job运行在独立的**虚拟环境**中，也就是每个job其实都是运行GitHub的不同的服务器里，这样可以避免job之间的相互干扰。

而step是**顺序执行**，而且同一个job之间各个的step是按照从上到下的顺序在同一个虚拟环境里面顺序执行的

##### event

**event**（事件）：也就是触发器，action通常需要某种事件进行触发，这里的事件可以是提交代码，创建分支，提交PR，某个时间点定时等等...

##### runs-on

runs-on:	ubuntu-lastest 申请一个虚拟环境

##### uses

uses:	actions/checkout@v4  检出代码，也就是把项目的代码检出到那个虚拟机里面

#### 计费

对于公共仓库action完全免费

对于私有仓库每个账号都有一定的免费时长，每个月2000分钟，最多只能上传存储500M的内容

**在个人设置可以查看使用额度**

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

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.67xndvadov.webp)

##### Squash and merge

```bash
git merge --squash main
```

**Squash and merge**：把commit3,4,5压缩成一个提交合并进feature分支

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.2yyjh7on6k.webp)

##### Rebase

```bash
git rebase main
```

**Rebase**（变基 - 更改地基）：把main分支合并进了feature分支，把feature分支变基到了main分支

变基：我自己的根基不存在了，把自己的分支变更到了main分支上，并且生成一个新的提交

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.6pnp2gdx5m.webp)

> [!IMPORTANT]
>
> 在Desktop使用**变基**，**提示**必须强制推送到GIthub网站`Git push -f`

| 操作     | rebase                     | merge                                          | squash merge                   |
| -------- | -------------------------- | ---------------------------------------------- | ------------------------------ |
| 特点     | 只有线性提交记录           | 会出现所有提交记录，包括merge                  | 只出现一条merge记录            |
| 优点     | 减少一次merge记录          | 保证分支可溯源                                 | 历史记录更加清爽干净           |
| 缺点     | 必须使用强送               | 多一次merge记录                                | 历史记录被合并到一起了         |
| 应用场景 | 在私有分支上可以使用rebase | 多人协作分支必须merge，向主干分支合并必须merge | 多人协作分支，需要保持记录清爽 |

 Github网页中`pull request`也有一样选项

#### 优选提交

**cherry pick**指的是优选提交或者拣选调教

比如说只想把commit3，commit3合并到main分支，保留commit5分支在feature分支

##### 使用命令行操作

切换到接受合并的分支

```bash
git switch main
```

选择c3，c4两个commit

```bash
git cherry-pick c3 c4
```

![image-20250128214954084](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744111150_0.png)

##### 使用Desktop操作

按住`shift`键同时选择多个commit，右键选择`Cherry-pick...`，指的是拣选选中的提交

选择要合并的分支，最后点击`Cherry-pick commit to main`即可

> [!important]  小记
>
> 在Desktop中`Cherry-pick`时，要将分支切换到输出commit的分支，然后再选择若干个commit，命令行则反之

#### 合并冲突

如果两个分支同时修改了同一个文件的同一行代码，合并的时候就会出现conflict（冲突）只能手动修改文件来解决冲突

**Abort merge**：取消这次的merge，两个分支各自还原回去

**Continue merge**：需要先手动解决冲突，即编辑文件，修改成理想状

进入VSCode手动修改代码后回到Desktop即可点击`Continue merge`

#### 拉取冲突

**场景**：你的同事，她已经写完代码并且推送到远程仓库，但是你本地不知道，你修改了同一个文件的同一行，此时你还没有提交

点击`pull origin`，提示冲突，如果拉取更新会将本地代码覆盖，

点击`Stash changes and continue`，存储更改并继续，此时进入文件修改冲突，

回到Desktop✔表示已经解决了，即可commit提交了再push了

#### 文件冲突

**场景**：两个分支同时改动了同一个文件的名字

选中所有文件右键`Discard 3 selected changes`全部撤销更改

打开目录调整为理想状态回到Desktop

点击`View conflicts`，最后再提交上去即可

## git命令行

### 安装Git

检查是否安装

```bash
git --version
```

### 克隆

```bash
git clone url
```

### 状态

查看目前的状态，目前分支，是否与远端分支同步，以及文件修改，暂存区...

```bash
git status
```

### 添加暂存区

使用**Git add .** 会把所有修改的文件添加到暂存区

```bash
git add 'filename'
```

### 取出暂存区

```bash
git restore --staged 'filename'
```

### 提交

```bash
git commit -m 'msg'
```

### 暂存+提交

```bash
git commit -am 'mag'
```

> [!IMPORTANT]
>
> `-a`的意思是把所有的文件添加到暂存区，
>
> **注意**：只添加修改的文件，新增的文件还是得 `git add .`

### 推送

```bash
git push
```

当第一次推送的时候，会有登录提示，选择GIthub或者Token

**Token**：进入GIthub点击Setting，下拉找到Developer settings，有一个Personal access tokens

打开，点击Token(classic)，点击Generate new Token

选择一个过期时间，勾选全部功能，最后选择Generate token 

生成了一个Github token，复制，填写到登录Token处即可完成绑定

### 拉取

```bash
git pull
```

::: tip 建议

建议使用`git pull --rebase`，这个命令可以在拉取更新的时候产生线性提交记录

:::

**场景：**

当写完代码push到远端，被决绝了，原因是团队中其他同事也使用了相同的分支

两人都是从A提交开始写代码，两人同时在写代码，但是同事先把代码提交到远端

当你推送的时候，就会拒绝

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.wiqt75qmm.webp)

所以，在实践中，推荐每个人都使用一个独立的分支开发代码，避免此类问题

但是，当两个人需要共同解决同一个分支上的问题时，此时，执行git pull 命令即可

先把远端的最新提交拉取到本地

`git pull` = `git fetch` + `git merge`

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.4cl2lao2f7.webp)

因为你的提交和你同事的提交有共同的祖先，Git会merge两个分支的提交，并且创建一个额外的merge提交

经常这么干会累计很多无用信息，把搜索commit变得麻烦，

我们的目的仅仅是：**把自己的提交挂在你同事提交之后**，即可保持历史数据线性的干净

可以使用`git pull --rebase`命令，完成操作

**此命令会暂时把你的提交放到一边，然后拉取远端仓库的提交，再把你的提交挂在后面，即可保持提交线性的干净**

![image-20250207220422773](https://raw.githubusercontent.com/fish81/typora-uploads-images/main/image/1744111213_0.gif)

可以修改Git 设置，让Git pull的时候默认使用rebase的方式

```bash
git config pull.rebase true
```

同时**Desktop**也会变化

### 删除

当删除了一个文件，使用

```bash
git rm 'filename'
```

告诉git 这个文件以后不需要管理了,文件夹内也会删除

### 重命名

```bash
git mv 'Oldfilename' 'Newfilename'
```

### 移动

```bash
git mv 'filename' 'file'	// 文件名称+文件夹路径
```

### 提交历史

```bash
git log
```

### 重置状态

```bash
git reset --mixed 'ID'
```

文件修改保留在工作区，之后需要使用强制推送`git push -f`

### 丢弃更改

把指定的文件放弃更改

```bash
git restore 'filename'
```

### 提交详细信息

```bash
git show 'ID'
```

### 反向操作

会生成一个反向操作**抵消**那一次的的更改

```bash
git revert 'ID'
```

填写完提交信息，点击Esc，输入一个冒号，一个wq!，回车

### 修改提交

使用git amend修改提交

当代码提交后，突然后悔了，或者改错了，直接在代码中修正，

现在需要把修改加到上一次提交中，首先`git add .`

修改上一次的提交记录，git commit --amend

还可以修改上一次的提交信息，点击Esc，冒号，wq!，回车

完成了使用amend操作把上一次添加修改了

> [!NOTE]
>
> **amend**只能对最后一次提交失效
>
> 如果还没有推送，使用`git push`就行，如果推送了，使用`git push -f`，强制推送

### 后悔药

| 操作    | 命令                                                         | 场景                                 | 注意事项                                                     |
| ------- | ------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------ |
| discard | git restore 'filename' 单个文件<br />git reset --hard 所有文件 | 工作区的修改还没有提交               | 舍弃掉工作区修改的文件                                       |
| reset   | git reset 'ID'                                               | 还原到某个提交的状态，舍弃之后的提交 | 如果reset已经推送的提交，会造成强制推送，集成分支禁止强制推送 |
| revert  | git revert 'ID'                                              | 使用一个新的提交抵消到某一次的提交   | 在集成分支推荐使用此命令                                     |
| amend   | git commit --amend                                           | 只能修改最新一次的提交               | 如果amend已经push的提交，会造成强制推送...                   |

### 分支

`git branch`  查看所有的本地分支

`git branch -a` 查看所有分支（包括远端的分支）

> [!NOTE]
>
> 前面是remotes的是远端分支

#### 创建分支

`git checkout -b  分支名称`   创建分支（**基于本地当前分支创建的**）

`git push --set-upstream origin feature2`把本地的feature2分支在远端也叫feature2这个名字，将两端关联起来

#### 删除分支

`git branch -d 分支名称`

> [!IMPORTANT]
>
> 如果你的分支还没有合并，使用小写d是不能删除的，git会警告，要使用大写的D强制删除

`git push origin --delete 分支名称` 删除远程分支

#### 切换分支

`git switch 分支名称`

#### 检出远端分支

将远端的分支拉取到本地，先同步一下远端分支`git fetch` 

当在远端有一个分支，本地不会自动同步，需要使用git fetch 同步，本地才会显示

使用`git checkout 分支名称`  将指定分支检出本地，就是让本地当前的分支变成feature3分支(远程分支)，将feature3分支自动和远端的feature3分支关联起来了

#### 合并分支

先切换到接受合并的分支

`git swtich '切换分支名'`

`git merge 'main'`  指的是把main分支合并到当前分支

还可以合并远端的分支 `git merge origin/远端分支`

#### 比较分支

 `git log feature..main` 按照提交比较 ，比较main分支和feature分支之间的提交改动，显示的是main分支上有的，feature分支没有的，可以调换顺序

 `git diff feature..main` 按照文件比较 ，比较文件的不同

`git diff` 比较的是工作区和暂存区的差异

` git diff --staged`比较暂存区和本地分支的情况

`git diff HEAD`比较工作区和本地分支的情况

### 区概念

![image](https://jsd.cdn.zzko.cn/gh/fish81/picx-images-hosting@master/image.969xhget3u.webp)