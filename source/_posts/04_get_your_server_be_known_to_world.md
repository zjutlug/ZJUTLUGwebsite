---
title: 第四课 让世界看见你的服务器：frp 内网穿透
date: 2026-05-31 11:11:26
tags: [活动,课程宣讲]
cover: /img/defaultcover.webp
---
# 从入门到入土的Linux架设MC服的第四课：让世界看见你的服务器

在前面的课程中，我们已经完成了 Linux 入门、用户和权限、SSH、IP 和端口、防火墙，以及 Minecraft 服务端本身的架设。

到了这一步，你大概率已经能在自己的电脑、云服务器、虚拟机、NAS 或 WSL 里把 Minecraft 服务端跑起来了。

我们默认你已经能够做到：

- 在 Linux 中进入终端并执行命令
- 使用 SSH 登录一台 Linux 服务器
- 知道什么是 IP、端口、TCP
- 知道 `25565/tcp` 是 Minecraft Java 版默认端口
- 能用 `ss -tulnp` 查看端口监听
- 能用 `ufw` 或云服务器安全组放行端口
- 已经有一个可以正常启动的 Minecraft 服务端
- 大致了解 `systemctl` 或 Docker Compose 的作用

这一节课我们要解决的问题就是：**如何让外网玩家连接到一台内网里的 Minecraft 服务端**。

我们会使用 [frp](https://gofrp.org/zh-cn/docs/) 完成内网穿透，让玩家通过一台有公网 IP 的服务器访问你内网里的 MC 服务端。


## 今天我们要做什么

假设现在有这样一个场景：

- Minecraft 服务端运行在你的宿舍电脑、家里电脑、NAS、旧笔记本或 WSL 里
- 你自己可以通过 `localhost:25565` 连接
- 同一个局域网里的人可能可以通过 `192.168.x.x:25565` 连接
- 但外网玩家无法直接连接

我们今天要把连接路径变成这样：

```text
玩家客户端
   |
   v
公网服务器
   |
   v
内网机器
   |
   v
Minecraft 服务端
```

也就是让一台公网服务器作为入口，把玩家的连接转发到内网里的 Minecraft 服务端。

## 内网？外网？

第二节课已经讲过 IP、端口、防火墙和公网 / 内网的区别

### 三种常见连接地址

| 地址 | 通常谁能连接 | 说明 |
| --- | --- | --- |
| `localhost:25565` | 本机 | 只说明服务端在本机可访问 |
| `192.168.x.x:25565` | 同一局域网 | 校园网、宿舍网不一定互通 |
| `公网IP:25565` | 互联网玩家 | 前提是你有真正的公网入口 |

很多时候，“我能连上”只代表 `localhost` 能连，并不代表外网玩家能连。

### 确认监听链接

在运行 Minecraft 服务端的机器上执行：

```bash
ss -tulnp | grep 25565
```

如果看到类似：

```text
tcp LISTEN 0 4096 0.0.0.0:25565 0.0.0.0:* users:(("java",pid=1234,fd=123))
```

说明有程序正在监听 `25565/tcp`。

这里要注意监听地址：

| 监听地址 | 含义 |
| --- | --- |
| `127.0.0.1:25565` | 只允许本机访问 |
| `0.0.0.0:25565` | 监听所有 IPv4 网卡 |
| `[::]:25565` | 监听 IPv6 地址 |

如果 Minecraft 服务端只监听 `127.0.0.1`，那么其他机器通常无法直接访问它。

对于 Minecraft Java 版服务端，`server.properties` 里的这一项通常保持为空来确保其监听来自任意地址的流量：

```properties
server-ip=
```

### 测试端口连通性

如果要从另一台机器测试某个 TCP 端口是否可以连接，可以使用：

```bash
nc -vz 目标IP 25565
```

如果没有 `nc`，Debian / Ubuntu 可以安装：

```bash
sudo apt update
sudo apt install netcat-openbsd
```

`ping` 只能说明 ICMP 包是否可达，不能证明 Minecraft 的 `25565/tcp` 是通的。开服排障时，端口测试比单纯 `ping` 更有意义。

### 沟槽的NAT技术

IPv4 公网地址总量本来就有限，而我国的家庭宽带、校园网、宿舍网、移动网络用户数量又非常多，真正能直接分到每一台设备手里的公网 IPv4 其实不够用。为了让更多人能上网，运营商通常会把大量用户放在同一个或少量公网地址后面，通过 NAT 来共享出口。

如果你家的路由器有真正的公网 IP，路由器端口转发可能就够了。但在很多校园网、宿舍网、家宽环境里，设备往往处在 NAT 或运营商级 NAT 后面。即使你能登录自己的路由器，也只能配置自己这一层路由器，无法配置学校或运营商那一层网络，这时外网玩家主动连接你的内网机器通常是失败的。

所以我们需要换一个方向：**让内网机器主动连接公网服务器，再由公网服务器把玩家流量转回来**。

这就是 frp 要做的事。

## frp 是什么

[frp](https://gofrp.org/zh-cn/docs/) 是一个专注于内网穿透的反向代理工具。

它由两个主要程序组成：

| 程序 | 全称 | 运行位置 | 作用 |
| --- | --- | --- | --- |
| `frps` | frp server | 公网服务器 | 等待 frpc 连接，提供公网入口 |
| `frpc` | frp client | 内网机器 | 主动连接 frps，把本地服务暴露出去 |

一般来说我们的网络架构是：

{% mermaid %}
graph LR
    Player["玩家客户端"]
    Public["公网服务器<br/>frps"]
    Client["内网机器<br/>frpc"]
    MC["Minecraft 服务端<br/>127.0.0.1:25565"]

    Player -->|"公网服务器IP:25565"| Public
    Public -->|"frp 隧道"| Client
    Client -->|"127.0.0.1:25565"| MC

    style Player fill:#E8F3FF,stroke:#2E5C8A,stroke-width:2px,color:#000
    style Public fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style Client fill:#E8F3FF,stroke:#2E5C8A,stroke-width:2px,color:#000
    style MC fill:#D8F5D0,stroke:#3C7A32,stroke-width:2px,color:#000
{% endmermaid %}

玩家连接的是：

```text
公网服务器IP:25565
```

但真正运行 Minecraft 服务端的机器可以在宿舍、家里、实验室、NAS 或 WSL 里。

### frp的作用

frp 能解决的是：

- 内网机器没有公网 IP
- 路由器无法做有效端口转发
- 校园网或运营商 NAT 导致外网无法主动访问内网机器
- 想临时把本地服务暴露给朋友测试


## 准备一台公网服务器

使用 frp 的前提是：你需要一台外网玩家能访问到的公网服务器。

这台服务器可以是：

- 阿里云、腾讯云、华为云等云服务器
- 一台有公网 IP 的 VPS
- 一台你自己能控制防火墙和端口的公网 Linux 服务器
- ……

它不一定要运行 Minecraft 服务端本体，但它需要负责转发玩家连接。

### 服务器配置怎么选

对于作为frp穿透的服务器，选择依据通常是：

- 带宽
- 流量
- 线路质量
- 服务器所在地和玩家所在地的距离

frp 转发 Minecraft 流量时，玩家的数据会经过公网服务器中转：

```text
玩家 -> 公网服务器 -> 内网机器 -> 公网服务器 -> 玩家
```

## 下载 frp

frp 的官方文档在这里：

```text
https://gofrp.org/zh-cn/docs/
```

frp 的 Release 通常会提供不同系统和架构的压缩包。Linux x86_64 服务器一般选择类似这样的文件：

```text
frp_x.x.x_linux_amd64.tar.gz
```

其中 `x.x.x` 是版本号。

下载后解压：

```bash
tar -xzf frp_x.x.x_linux_amd64.tar.gz
cd frp_x.x.x_linux_amd64
```

进入目录后通常能看到这些文件：

```text
frpc
frpc.toml
frps
frps.toml
LICENSE
```

几个关键文件的作用如下：

| 文件 | 作用 |
| --- | --- |
| `frps` | frp 服务端程序，运行在公网服务器上 |
| `frps.toml` | frp 服务端配置文件 |
| `frpc` | frp 客户端程序，运行在内网机器上 |
| `frpc.toml` | frp 客户端配置文件 |

这一节课我们使用 TOML 格式配置文件。

较新的 frp 已经更推荐 TOML、YAML 或 JSON 格式；INI配置的格式随时可能被抛弃，不建议继续使用

## 配置frp

为了后面使用 systemd 管理，我们建议把 frp 放到固定目录：

```text
/opt/frp/
```

在公网服务器上：

```text
/opt/frp/frps
/opt/frp/frps.toml
```

在内网机器上：

```text
/opt/frp/frpc
/opt/frp/frpc.toml
```

如果你只是临时练习，也可以先在自己的 home 目录里运行。等确认配置没有问题后，再整理到 `/opt/frp`，本文后续假设 frp 放在 `/opt/frp`。

### 配置公网服务器 frps

先在公网服务器上配置 `frps`。

`frps` 的任务是：

- 监听一个控制端口，等待内网机器上的 `frpc` 连接
- 提供一个远程端口，让玩家连接
- 把玩家连接通过 frp 隧道转发给内网机器

#### frps 最小配置

编辑公网服务器上的配置文件：

```bash
sudo vim /opt/frp/frps.toml
```

写入：

```toml
bindPort = 7000
auth.token = "换成一个足够长的随机字符串"
```

这就是一个最小可用的 `frps.toml`。

几个配置项的含义：

| 配置 | 作用 |
| --- | --- |
| `bindPort` | frpc 连接 frps 使用的控制端口 |
| `auth.token` | frps 和 frpc 之间的认证密钥 |

为确保安全，`auth.token` 不要写成 `123456`、`password`、`minecraft` 这种容易猜到的值。

#### 验证 frps 配置文件

frp 支持检查配置文件：

```bash
cd /opt/frp
./frps verify -c frps.toml
```

如果配置文件语法没有问题，再启动程序。

#### 启动 frps

```bash
cd /opt/frp
./frps -c frps.toml
```

如果没有报错，说明 `frps` 基本可以工作。确认正常后，可以按 `Ctrl + C` 停止它，我们后面交给 systemd 管理。

#### 放行公网服务器端口

公网服务器至少需要放行两个端口：

| 端口 | 用途 |
| --- | --- |
| `7000/tcp` | frpc 连接 frps 的控制端口 |
| `25565/tcp` | 玩家连接 Minecraft 的端口 |

如果使用 `ufw`：

```bash
sudo ufw allow 7000/tcp
sudo ufw allow 25565/tcp
sudo ufw status numbered
```

如果这是云服务器，还要去云厂商控制台检查安全组。

#### 检查端口监听

在公网服务器上可以查看 `frps` 是否正在监听：

```bash
ss -tulnp | grep 7000
```

当后面 `frpc` 成功连接并创建 `25565` 端口映射后，也可以看：

```bash
ss -tulnp | grep 25565
```

如果 `25565` 没有监听，玩家自然连不上。

#### 使用 systemd 管理 frps

前台运行适合测试，但不适合长期使用。

如果 SSH 断开，前台运行的程序可能就结束了。真正长期运行时，建议使用 systemd 管理 `frps`。

systemd 可以帮我们做到：

- 开机自动启动
- 程序异常退出后自动重启
- 使用 `systemctl` 统一管理
- 使用 `journalctl` 查看日志

#### 编写 frps.service

创建 systemd 服务文件：

```bash
sudo vim /etc/systemd/system/frps.service
```

写入：

```ini
[Unit]
Description=frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type=simple
WorkingDirectory=/opt/frp
ExecStart=/opt/frp/frps -c /opt/frp/frps.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

| 配置 | 作用 |
| --- | --- |
| `After=network-online.target` | 尽量等网络可用后再启动 |
| `User=frp` | 使用 `frp` 用户运行 |
| `WorkingDirectory=/opt/frp` | 工作目录 |
| `ExecStart=...` | 启动 frps 的命令 |
| `Restart=on-failure` | 异常退出时自动重启 |
| `WantedBy=multi-user.target` | 允许开机启动 |

#### 启动 frps 服务

每次新增或修改 systemd 服务文件后，都需要重新加载：

```bash
sudo systemctl daemon-reload
```

启动并设置开机自启：

```bash
sudo systemctl enable --now frps
```

查看状态：

```bash
sudo systemctl status frps
```

如果看到 `active (running)`，说明服务正在运行。

#### 查看 frps 日志

使用：

```bash
journalctl -u frps -f
```

其中：

- `-u frps`：只看 `frps` 这个服务
- `-f`：持续跟随输出新日志

#### 重启和停止 frps

修改 `frps.toml` 后，需要重启服务：

```bash
sudo systemctl restart frps
```

停止服务：

```bash
sudo systemctl stop frps
```

取消开机自启：

```bash
sudo systemctl disable frps
```

### 配置内网机器 frpc

公网服务器上的 `frps` 准备好后，接下来配置内网机器上的 `frpc`。

`frpc` 的任务是：

- 主动连接公网服务器上的 `frps`
- 告诉 `frps`：请把公网服务器的某个端口转发给我
- 把收到的连接转发到本机的 Minecraft 服务端

此处假设你的 Minecraft 服务端在内网机器本机运行，端口是 `25565`。

#### frpc 最小配置

编辑内网机器上的配置文件：

```bash
sudo vim /opt/frp/frpc.toml
```

写入：

```toml
serverAddr = "你的公网服务器IP"
serverPort = 7000
auth.token = "和 frps 相同的 token"

[[proxies]]
name = "minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565
```

| 配置 | 应该填写什么 |
| --- | --- |
| `serverAddr` | 公网服务器 IP 或域名 |
| `serverPort` | 公网服务器 `frps.toml` 里的 `bindPort` |
| `auth.token` | 和 `frps.toml` 完全相同的 token |
| `localIP` | MC 服务端在内网机器上的地址 |
| `localPort` | MC 服务端本地端口 |
| `remotePort` | 玩家连接公网服务器时使用的端口 |


如果 Minecraft 服务端和 `frpc` 在同一台机器上，通常填：

```toml
localIP = "127.0.0.1"
```

如果 Minecraft 服务端在同一局域网里的另一台机器上，比如：

```text
192.168.1.23:25565
```

那么可以写：

```toml
localIP = "192.168.1.23"
localPort = 25565
```

#### 验证 frpc 配置文件

同样可以先检查配置文件：

```bash
cd /opt/frp
./frpc verify -c frpc.toml
```

#### 启动 frpc


```bash
cd /opt/frp
./frpc -c frpc.toml
```

如果连接成功，通常能在 `frpc` 日志里看到代理启动成功的信息。同时在公网服务器的 `frps` 日志里，也应该能看到客户端连接和代理注册的信息。此时让玩家尝试连接：

```text
公网服务器IP:25565
```

如果能进服，说明 frp 的基本链路已经跑通。确认无误后，可以按 `Ctrl + C` 停止前台运行，改用 systemd 管理。

#### 使用 systemd 管理 frpc

创建服务文件：

```bash
sudo vim /etc/systemd/system/frpc.service
```

写入：

```ini
[Unit]
Description=frp client
After = network.target syslog.target
Wants = network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/frp
ExecStart=/opt/frp/frpc -c /opt/frp/frpc.toml
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

#### 启动 frpc 服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now frpc
sudo systemctl status frpc
```

查看日志：

```bash
journalctl -u frpc -f
```

修改 `frpc.toml` 后重启：

```bash
sudo systemctl restart frpc
```

#### 暴露多个服务端

如果你想暴露多个 Minecraft 服务端，可以使用不同的本地端口和远程端口。

例如内网机器上有两个服务端：

| 服务端 | 本地端口 |
| --- | --- |
| 生存服 | `25565` |
| 创造服 | `25566` |

可以在 `frpc.toml` 里写两个代理：

```toml
serverAddr = "你的公网服务器IP"
serverPort = 7000
auth.token = "和 frps 相同的 token"

[[proxies]]
name = "minecraft-survival"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565

[[proxies]]
name = "minecraft-creative"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25566
remotePort = 25566
```

玩家分别连接：

```text
公网服务器IP:25565
公网服务器IP:25566
```

注意：每个 `remotePort` 在同一台公网服务器上只能被一个代理占用。

如果两个代理都想使用 `remotePort = 25565`，后启动的通常会失败。

## 使用域名连接服务器

如果你有域名，可以给公网服务器 IP 添加一条 DNS 记录。

例如：

```text
mc.example.com -> 公网服务器IP
```

玩家就可以连接：

```text
mc.example.com:25565
```

这只是把 IP 换成域名，端口和 frp 配置本身没有变化。

如果你使用的不是默认端口，例如：

```toml
remotePort = 25566
```

玩家通常需要连接：

```text
mc.example.com:25566
```

## 安全注意事项

frp 能把内网服务暴露到公网，这很方便，也意味着你需要对安全负责。

### token 不要太简单

不要这样写：

```toml
auth.token = "123456"
```

也不要把 token 直接发到群里。

如果你需要让别人帮你排查配置，可以把 token 打码：

```toml
auth.token = "********"
```

### 只开放必要端口

公网服务器至少会涉及：

```text
22/tcp
7000/tcp
25565/tcp
```

其中：

- `22/tcp`：SSH 登录服务器
- `7000/tcp`：frpc 连接 frps
- `25565/tcp`：玩家连接 Minecraft

如果 SSH 改了端口，以实际端口为准。

不要为了省事直接开放所有端口。
