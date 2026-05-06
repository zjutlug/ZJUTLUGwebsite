---
title: 第一课 Linux极速入门
date: 2026-05-06 11:11:26
tags: [活动,课程宣讲]
cover: /img/defaultcover.webp
---
# 从入门到入土的Linux的第一课：Linux极速入门
![从入门到入土](/img/post/01_introduce_linux/01.webp)
## Linux 是什么
Linux 是一套免费使用和自由传播的类 Unix 操作系统，是一个基于 POSIX 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统。

Linux 能运行主要的 UNIX 工具软件、应用程序和网络协议。它支持 32 位和 64 位硬件。Linux 继承了 Unix 以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。

## Linux 的发行版

```mermaid
graph LR
    Linux["Linux<br/>内核"]
    
    Linux --> Debian["<b>Debian</b><br/>家族"]
    Linux --> Fedora["<b>Fedora</b><br/>家族"]
    Linux --> SUSE["<b>SUSE</b><br/>家族"]
    Linux --> Other["<b>其他</b>"]
    Linux --> CN["<b>国产</b>"]
    
    Debian --> Ubuntu["Ubuntu"]
    Debian --> Mint["Linux Mint"]
    
    Fedora --> RHEL["RHEL"]
    Fedora --> CentOS["CentOS"]
    
    SUSE --> openSUSE["openSUSE"]
    
    Other --> Arch["Arch Linux"]


    CN --> Kylin["红旗 Linux"]
    CN --> UnionTech["UOS/Deepin"]
    
    style Linux fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff,font-size:14px
    style Debian fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style Fedora fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style SUSE fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style Other fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
    style CN fill:#87CEEB,stroke:#2E5C8A,stroke-width:2px,color:#000
```
**btw，I use Arch**
