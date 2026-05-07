---
title: 第一课 Linux极速入门
date: 2026-05-06 11:11:26
tags: [活动,课程宣讲]
cover: /img/defaultcover.webp
---
# 从入门到入土的Linux架设MC服的第一课：Linux极速入门
![从入门到入土](/img/post/01_introduce_linux/01.webp)

## Linux 是什么

Linux 是一套免费使用和自由传播的类 Unix 操作系统，是一个基于 POSIX 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统。

Linux 能运行主要的 UNIX 工具软件、应用程序和网络协议。它支持 32 位和 64 位硬件。Linux 继承了 Unix 以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。

## 我们为什么需要 Linux 开服

开一个 MC 服务器，本质上是在做这些事：

- 找一台能长期运行的机器
- 安装 Java
- 运行服务端 jar
- 修改配置文件
- 管理插件、白名单和玩家权限
- 备份存档
- 让外网玩家连进来

这些事情，在 Windows 上本地试服、朋友小范围联机很方便，但如果目标变成长期运行、远程维护、自动备份、云服务器部署，Linux 的优势会更明显。

## Linux or Windows？

目前 Linux 更多的是应用于服务器上，而桌面操作系统更多使用的是 Windows。主要区别如下

| 场景 | Windows | Linux |
| --- | --- | --- |
| 本地试服 | 上手快，适合第一次跑起来 | 也能做，但需要终端基础 |
| 长期挂机 | 可以，但更依赖图形界面和人工维护 | 轻量，适合长期运行 |
| 远程管理 | 常用远程桌面，需要RDP或显示器值守 | 常用 SSH，一条命令连上 |
| 自动备份 | 能做，但配置分散 | 脚本和定时任务很自然 |
| 云服务器/开发板/NAS | 不太常见 | 非常常见 |

相同配置E-2276M虚拟机分配2c2t2GB下同时安装clash对局域网提供代理服务的资源占用情况：

Windows
![windows资源占用](/img/post/01_introduce_linux/04.webp)
Linux
![linux资源占用](/img/post/01_introduce_linux/05.webp)

## Linux 的发行版

{% mermaid %}
graph LR
    Linux["Linux<br/>内核"]

    Linux --> Debian["Debian<br/>家族"]
    Linux --> Fedora["Fedora<br/>家族"]
    Linux --> SUSE["SUSE<br/>家族"]
    Linux --> Other["其他"]
    Linux --> CN["国产"]

    Debian --> Ubuntu["Ubuntu"]
    Debian --> Mint["Linux Mint"]

    Fedora --> RHEL["RHEL"]
    Fedora --> CentOS["CentOS"]

    SUSE --> openSUSE["openSUSE"]

    Other --> Arch["Arch Linux"]


    CN --> RedFlag["红旗 Linux"]
    CN --> UnionTech["UOS/Deepin"]

    style Linux fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff,font-size:14px
    style Debian fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style Fedora fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style SUSE fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style Other fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style CN fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
{% endmermaid %}
**btw，I use ~~Arch~~ ~~Debian~~ Debian Sid**
![archisbest](/img/post/01_introduce_linux/02.webp)
![debian](/img/post/01_introduce_linux/03.jpg)

## Linux 有什么好玩的

### 桌面美化

Linux 不只是服务器上的黑框，也可以被折腾成很有个人风格的桌面环境。窗口管理器、状态栏、终端、字体、主题、壁纸都可以自己换，甚至可以把整个操作习惯改成自己喜欢的样子。

![Linux 桌面美化截图 1](/img/post/01_introduce_linux/desktop-beauty-01.webp)
![Linux 桌面美化截图 2](/img/post/01_introduce_linux/desktop-beauty-02.webp)
![Linux 桌面美化截图 3](/img/post/01_introduce_linux/desktop-beauty-03.webp)
![Linux 桌面美化截图 4](/img/post/01_introduce_linux/desktop-beauty-04.webp)
![Linux 桌面美化截图 5](/img/post/01_introduce_linux/desktop-beauty-05.webp)
![Linux 桌面美化截图 6](/img/post/01_introduce_linux/desktop-beauty-06.webp)
![Linux 桌面美化截图 7](/img/post/01_introduce_linux/desktop-beauty-07.webp)

### 自托管服务
博客、网盘、NAS、MC 服务器。

学会 Linux 之后，很多服务都可以自己部署在服务器、NAS、开发板或者旧电脑上。它不一定是给别人看的大项目，也可以只是一个自己用起来顺手的小工具。

![旧Macbook Air](/img/post/01_introduce_linux/self-hosted-01.webp)
![docker服务](/img/post/01_introduce_linux/self-hosted-03.webp)
![homeassistant](/img/post/01_introduce_linux/self-hosted-04.webp)
![homeassistant2](/img/post/01_introduce_linux/self-hosted-05.webp)
![openlist网盘](/img/post/01_introduce_linux/self-hosted-06.webp)
![Jellyfin影视库](/img/post/01_introduce_linux/self-hosted-07.webp)
![自建音乐库](/img/post/01_introduce_linux/self-hosted-08.webp)
![使用矿渣斐讯N1部署的OneKVM](/img/post/01_introduce_linux/self-hosted-02.webp)
![使用玩客云部署的OneKVM](/img/post/01_introduce_linux/self-hosted-09.webp)
![垃圾佬窝](/img/post/01_introduce_linux/self-hosted-10.webp)
![垃圾佬整齐的窝](/img/post/01_introduce_linux/self-hosted-11.webp)

## 今天我们要做什么


- 进入一个 Linux 环境
- 认识终端
- 学会几个最常用的命令
- 知道文件和目录怎么走
- 学会下载、解压文件
- 准备好 Java

这一节课结束时，大家至少要能在终端里看到：

```bash
java -version
```

只要这一步完成，后面就可以开始跑 Minecraft 服务端了。

## 进入 Linux 环境

这节课我们推荐使用 WSL
```powershell
wsl --install
```
如果尚未安装目标发行版，可以在安装时直接指定：
```powershell
wsl --install -d <发行版名称>
# 例如安装 Debian：
wsl --install -d Debian
```
## 认识终端

终端不是黑客专属工具，它只是另一种操作电脑的方式。

图形界面是“点文件夹、点按钮”，终端是“输入命令，让系统做事”。

几个最常用的命令：

```bash
pwd
ls
cd
mkdir
cp
mv
rm
```

比如为了后面开服，我们可以先创建一个专门的目录：

```bash
mkdir mc-server
cd mc-server
pwd
```

## 下载和解压

```bash
wget 链接
curl -O 链接
```

Linux 里也经常见到 `.tar.gz` 这种压缩包，可以这样解压：

```bash
tar -xzvf 文件名.tar.gz
```
## 准备 Java

### 使用系统 OpenJDK

如果只是为了先让终端能运行 Java，可以直接安装 OpenJDK：

```bash
sudo apt update
sudo apt install openjdk-21-jre
java -version
```

如果终端能输出 Java 版本号，说明系统 Java 已经准备好了。

### 下载 Liberica Full JRE

Liberica Full JRE拥有更完善的JAVA特性支持（包括JAVAFX），也可以去 BellSoft 官网下载 Liberica Full JRE 的 `.tar.gz` 压缩包。

先新建一个专门存放 Java 的目录：

```bash
mkdir -p ~/opt/java
cd ~/opt/java
```

以 Java 25 LTS 为例，下载 Linux x86_64 的 Liberica Full JRE：

```bash
wget https://download.bell-sw.com/java/25.0.3+11/bellsoft-jre25.0.3+11-linux-amd64-full.tar.gz
```

解压：

```bash
tar -zxvf bellsoft-jre25.0.3+11-linux-amd64-full.tar.gz
ls
```


### 指定 Java 

Liberica可以与opnejar共存，我们可以通过指定环境变量来确定想要使用的java版本：

```bash
#!/bin/bash

JAVA="$HOME/opt/java/jre-25.0.3-full/bin/java"

"$JAVA" -Xmx4G -Xms4G -jar server.jar nogui
```

```bash
java -version
```

