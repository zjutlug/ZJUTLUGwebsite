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

![by 司徒和丞相](/img/post/01_introduce_linux/desktop-beauty-01.webp)
![by Fridayssheep](/img/post/01_introduce_linux/desktop-beauty-02.webp)
![by Red](/img/post/01_introduce_linux/desktop-beauty-03.webp)
![by 钠的水溶液](/img/post/01_introduce_linux/desktop-beauty-04.webp)
![by 楠5210](/img/post/01_introduce_linux/desktop-beauty-05.webp)
![by Fridayssheep](/img/post/01_introduce_linux/desktop-beauty-06.webp)
![by Fridayssheep](/img/post/01_introduce_linux/desktop-beauty-07.webp)

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

这节课我们推荐使用 WSL，也就是 Windows Subsystem for Linux。它可以让我们在 Windows 里直接运行一个 Linux 环境，不需要单独安装双系统，也不需要先学虚拟机。

下面这些命令都在 **PowerShell** 或 **Windows 终端** 里执行。

### 安装 WSL

第一次安装可以直接执行：

```powershell
wsl --install
```

这个命令会安装 WSL，并默认安装一个 Linux 发行版。

如果尚未安装目标发行版，可以在安装时直接指定：

```powershell
wsl --install -d <发行版名称>
# 例如安装 Debian：
wsl --install -d Debian
```

如果不知道有哪些发行版可以安装，可以先查看列表：

```powershell
wsl --list --online
```

常见选择有 Ubuntu、Debian、openSUSE 等。本文后面会以 Debian / Ubuntu 系的命令为主。

### 启动和进入 WSL

安装完成后，可以直接从开始菜单打开对应的 Linux 发行版，也可以在 PowerShell 里输入：

```powershell
wsl
```

如果想直接进入用户主目录，可以使用：

```powershell
wsl ~
```

如果电脑里安装了多个 Linux 发行版，可以指定进入其中一个：

```powershell
wsl -d Debian
```

刚进入 Linux 时，终端里看到的路径通常是 Linux 自己的目录。Windows 的磁盘会挂载在 `/mnt` 下面，例如：

```bash
/mnt/c/Users/你的用户名
```

不过开服、写代码、安装依赖时，建议优先把文件放在 Linux 自己的家目录里，例如：

```bash
cd ~
mkdir mc-server
cd mc-server
```

这样文件读写速度和权限行为都更接近真正的 Linux。

### 常用 WSL 命令

这些命令在 PowerShell 中执行，用来管理 WSL 本身：

| 命令 | 作用 |
| --- | --- |
| `wsl` | 进入默认 Linux 发行版 |
| `wsl ~` | 进入默认发行版的用户主目录 |
| `wsl -d Debian` | 进入指定发行版 |
| `wsl --list --online` | 查看可以安装的发行版 |
| `wsl --list --verbose` | 查看已经安装的发行版、运行状态和 WSL 版本 |
| `wsl --status` | 查看 WSL 的整体状态 |
| `wsl --version` | 查看 WSL 组件版本 |
| `wsl --update` | 更新 WSL |
| `wsl --set-default Debian` | 设置默认进入的发行版 |
| `wsl --set-default-version 2` | 设置以后新安装的发行版默认使用 WSL 2 |
| `wsl --set-version Debian 2` | 把指定发行版切换到 WSL 2 |
| `wsl --shutdown` | 关闭所有 WSL 发行版和 WSL 虚拟机 |
| `wsl --terminate Debian` | 关闭指定发行版 |
| `wsl --help` | 查看帮助 |

如果系统里装了多个发行版，可以先看清名字：

```powershell
wsl -l -v
```

输出里 `VERSION` 为 `2` 时，说明这个发行版正在使用 WSL 2。本文默认使用 WSL 2。

还有一个危险命令需要认识：

```powershell
wsl --unregister Debian
```

它会删除对应的发行版，包括里面的文件和配置。除非明确知道自己在做什么，否则不要执行。

### WSL 的网络怎么理解

WSL 里的程序和 Windows 里的程序虽然在同一台电脑上，但网络上并不完全等同于同一个系统。最常见的情况可以分成三类。

第一类：Windows 访问 WSL 里的服务。

如果你在 WSL 里启动了一个服务，例如 Minecraft 服务端、网页开发服务器、Node.js 服务等，Windows 这边通常可以直接用 `localhost` 访问：

```text
localhost:25565
127.0.0.1:25565
```

如果是网页服务，也可以在 Windows 浏览器里打开：

```text
http://localhost:3000
```

第二类：WSL 访问 Windows 里的服务。

默认 NAT 网络模式下，WSL 访问 Windows 里的服务时，有时不能直接使用 `localhost`。可以先在 WSL 里查看 Windows 主机在 WSL 看来的 IP：

```bash
ip route show | grep -i default
```

输出里 `default via` 后面的地址通常就是 Windows 主机地址。例如看到：

```text
default via 172.30.96.1 dev eth0
```

那么在 WSL 里访问 Windows 上的 `3000` 端口，可以尝试：

```bash
curl http://172.30.96.1:3000
```

第三类：局域网里的其他设备访问 WSL 里的服务。

这一步和“自己电脑访问自己”不一样。如果你希望同一局域网里的其他电脑连接到 WSL 里的 Minecraft 服务端，需要同时满足：

- 服务端程序监听正确的端口，例如 Minecraft 默认是 `25565`
- 程序不要只监听 `127.0.0.1`
- Windows 防火墙允许这个端口进入
- WSL 网络模式允许局域网访问

对于 Minecraft 服务端，一般保持 `server.properties` 里的 `server-ip=` 为空即可，不要手动填 `127.0.0.1`。

### 推荐的网络配置：mirrored 模式

如果你使用的是 Windows 11 22H2 或更新版本，可以尝试 WSL 的 mirrored 网络模式。它会让 WSL 更接近直接使用 Windows 的网络，局域网访问、VPN、IPv6 的兼容性通常更好。

在开始菜单找到“WSL Settings”，打开后在“网络”选项卡内修改“网络模式”为`Mirrored`。启用后需要重启 WSL：

```powershell
wsl --shutdown
```

局域网里的其他人连接时，通常使用你这台 Windows 电脑的局域网 IP，而不是 WSL 里面的 IP。

Windows 的局域网 IP 可以在 PowerShell 里查看：

```powershell
ipconfig
```

找到正在使用的网卡，例如 WLAN 或以太网，查看其中的 `IPv4 地址`。如果它是：

```text
192.168.1.23
```

那么同一局域网里的其他设备可以尝试连接：

```text
192.168.1.23:25565
```

如果仍然连不上，优先检查 Windows 防火墙。例如，Minecraft Java 服务端通常需要允许 Java 或 `25565` 端口通过防火墙。

可以在“Windows 安全中心 -> 防火墙和网络保护 -> 允许应用通过防火墙”中放行 Java。也可以在管理员 PowerShell 里添加端口规则：

```powershell
New-NetFirewallRule -DisplayName "Minecraft Server 25565" -Direction Inbound -Protocol TCP -LocalPort 25565 -Action Allow
```

如果使用 mirrored 模式后局域网仍然无法访问，可能还需要允许 WSL 的 Hyper-V 防火墙入站连接。可以在管理员 PowerShell 里只放行 Minecraft 的 `25565` 端口：

```powershell
New-NetFirewallHyperVRule -Name "WSL-Minecraft-25565" -DisplayName "WSL Minecraft 25565" -Direction Inbound -VMCreatorId "{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}" -Protocol TCP -LocalPorts 25565
```

### 默认 NAT 模式下的端口转发

如果你的系统不支持 mirrored 模式，WSL 2 默认使用 NAT 网络。Windows 本机访问 WSL 服务通常仍然可以使用 `localhost`，但局域网里的其他设备想访问 WSL 服务时，可能需要端口转发。

先在 PowerShell 中查看 WSL 的 IP：

```powershell
wsl hostname -I
```

假设输出是：

```text
172.30.98.229
```

可以在管理员 PowerShell 中添加端口转发，把 Windows 的 `25565` 端口转发到 WSL 的 `25565` 端口：

```powershell
netsh interface portproxy add v4tov4 listenport=25565 listenaddress=0.0.0.0 connectport=25565 connectaddress=172.30.98.229
```

同时放行 Windows 防火墙：

```powershell
New-NetFirewallRule -DisplayName "Minecraft Server 25565" -Direction Inbound -Protocol TCP -LocalPort 25565 -Action Allow
```

需要注意的是，WSL 的 IP 可能会在重启后变化。如果端口转发突然失效，可以重新执行：

```powershell
wsl hostname -I
```

然后删除旧规则并添加新规则：

```powershell
netsh interface portproxy delete v4tov4 listenport=25565 listenaddress=0.0.0.0
netsh interface portproxy add v4tov4 listenport=25565 listenaddress=0.0.0.0 connectport=25565 connectaddress=<新的 WSL IP>
```

如果只是自己在同一台电脑上测试服务端，不需要配置局域网端口转发，优先使用 `localhost` 就可以了。

## 认识终端

终端不是黑客专属工具，它只是另一种操作电脑的方式。

图形界面是“点文件夹、点按钮”，终端是“输入命令，让系统做事”。

几个最常用的命令：

| 命令 | 作用 | 示例 |
| --- | --- | --- |
| `pwd` | 显示当前所在目录 | `pwd` |
| `ls` | 查看当前目录下的文件 | `ls`、`ls -l` |
| `cd` | 切换目录 | `cd mc-server`、`cd ..` |
| `mkdir` | 创建文件夹 | `mkdir mc-server` |
| `cp` | 复制文件或文件夹 | `cp a.txt b.txt` |
| `mv` | 移动或重命名文件 | `mv old.txt new.txt` |
| `rm` | 删除文件或文件夹 | `rm test.txt` |
| `sudo` | 以管理员权限执行命令 | `sudo apt update` |

其中一些常用选项：

```bash
ls -l        # 以详细列表形式显示文件
ls -a        # 显示隐藏文件
mkdir -p a/b # 创建多级目录，如果目录已存在也不会报错
cp -r dir1 dir2 # 复制文件夹
rm -r dir    # 删除文件夹
```

警告：`rm` 命令非常危险，尤其是 `rm -rf`，它会强制删除指定的文件或目录，且不会提示确认。使用前请务必确认路径和文件名，避免误删重要数据。

再次警告：WSL2 中由于Windows的所有驱动器都通过9P协议将Windows的文件系统驱动挂载在WSL `/mnt` 目录下，使用 `sudo rm -rf /` 命令会删除整个 Windows 系统的文件，导致数据丢失和系统崩溃。请务必小心使用 `rm -rf` 命令

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

Linux 里经常会见到 `.tar.gz` 这种压缩包。它可以理解为两步合在一起：

- `.tar`：把一堆文件打包成一个文件
- `.gz`：再用 gzip 把这个包压缩变小

所以 `.tar.gz` 在部分桌面环境中被翻译为“归档压缩包”

解压 `.tar.gz` 文件一般使用：

```bash
tar -xzvf 文件名.tar.gz
```

其中几个参数的含义是：

- `x`：extract，解压
- `z`：表示这个文件经过 gzip 压缩，适用于 `.tar.gz`
- `v`：显示解压过程中的文件名
- `f`：后面跟着要处理的文件名

例如：

```bash
tar -xzvf bellsoft-jre25.0.3+11-linux-amd64-full.tar.gz
```

默认情况下，文件会被解压到当前目录。解压前可以先用 `pwd` 确认自己在哪个目录：

```bash
pwd
ls
```

如果想把压缩包解压到指定目录，可以使用 `-C`：

```bash
mkdir -p ~/opt/java
tar -xzvf 文件名.tar.gz -C ~/opt/java
```

常见压缩格式可以这样处理：

```bash
tar -xzvf 文件名.tar.gz    # 解压 .tar.gz
tar -xJvf 文件名.tar.xz    # 解压 .tar.xz
unzip 文件名.zip           # 解压 .zip
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
tar -xzvf bellsoft-jre25.0.3+11-linux-amd64-full.tar.gz
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
