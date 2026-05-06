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
