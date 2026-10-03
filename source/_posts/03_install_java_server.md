---
title: 第三课 安装Java版服务端
date: 2026-05-12 19:43:36
tags: [活动,课程宣讲]
cover: /img/post/03_install_java_server/cover.webp
---
# 从入门到入土的Linux架设MC服的第三课：安装Java版服务端

在前两课中，我们已经完成了 Linux 环境搭建、终端基础、下载和解压、Java 准备，以及用户和权限、SSH、IP 和端口、防火墙等基础知识。

这一节课我们将正式进入 Minecraft 服务端的安装和配置，把服务器跑起来。

## 前言

把 mc 服务器开起来非常简单，在我们正式开讲之前，我们先用下面的步骤来概括把服务器开起来的过程：

- 准备好设备：你大概需要一台设备来持续运行服务器

- 准备好 Java 环境：Minecraft 的不同版本要求不同的 Java 版本

- 准备好服务端：从网络上下载即可，是一个 `.jar` 文件

- 第一次启动，生成基础结构

- 同意 EULA 协议：编辑 `eula.txt` 文件，将 `eula=false` 修改为 `eula=true`

- 再次启动

这样一来，服务器就已经准备好了，随时可以进入。

当然，除了上面的基本流程，我们还会讲到第三方服务端的选择、配置文件、插件的安装和使用，以及部署 MCSM 面板等内容。让大家能够更好地管理和使用服务器。

## 认识服务端 

Mojang 提供了 Java 版服务端用于多人游戏，它在 JVM 中运行，所以与 Minecraft 相关的部分在 Windows 下和 Linux 下都是相似的。

在安装服务端之前，我们先认识一下 Minecraft 基于服务端的多人游戏与用单人游戏开放端口联机的区别。

- 不需要玩家在线：在单人游戏中，退出世界相当于关闭世界，也等同于关闭其他用户连接，系统也不再访问这个世界相关的文件。而在服务端联机中，只有关闭服务端时才会关闭世界，所以服务器中不需要有玩家在线。

 - 基于配置管理世界：服务端允许使用更多的配置文件来管理世界，包括 server.properties, ops, 黑名单和白名单等。
 
 - 权限管理：单人游戏中，玩家要么不允许作弊，要么是管理员（4级）。数据包和命令方块的运行权限是固定的（2级）。但在服务器中，可以自由设置某些玩家为管理员，也可以通过服务器配置文件来修改这些权限等级的默认值。

为了让大家先运行起一个服务端，我们先用 Minecraft Java版 26.1.2 原版服务端为例，并让大家用本地进入这个服务器。

## 下载服务端

Mojang 总是会在 [https://www.minecraft.net/zh-hans/download/server](https://www.minecraft.net/zh-hans/download/server) 提供最新的 Java 版服务端下载。

![server download](/img/post/03_install_java_server/server_download.webp)

在这里下载 Minecraft 26.1.2 版本的服务端，下载完成后会得到一个名为 `server.jar` 的文件。

然后在命令行中输入此命令就可以启动服务端了：

```bash
java -Xmx4G -Xms4G -jar server.jar nogui
```

如果你在第一课中安装了系统 OpenJDK，这里直接使用 `java` 命令即可。如果你安装的是 Liberica Full JRE 并且没有将其加入系统 PATH，则需要指定完整路径，例如：

```bash
$HOME/opt/java/jre-25.0.3-full/bin/java -Xmx4G -Xms4G -jar server.jar nogui
```

也可以像第一课那样在脚本里设置一个变量来简化命令：

```bash
JAVA="$HOME/opt/java/jre-25.0.3-full/bin/java"
"$JAVA" -Xmx4G -Xms4G -jar server.jar nogui
```

其中 `-Xmx4G` 和 `-Xms4G` 是设置 JVM 的最大和初始内存为 4GB，`nogui` 是告诉服务端不要启动图形界面。不过 Minecraft 的服务端经常需要使用不同的 Java 版本来运行，我们可能需要设置不同的环境变量来运行不同版本的服务端，例如 `JAVA_17`、`JAVA_20` 等。

常见的 Minecraft 版本与 Java 版本对应关系如下：

| Minecraft 版本 | 最低 Java 版本 |
| --- | --- |
| 1.17 - 1.17.1 | Java 16 |
| 1.18 - 1.20.4 | Java 17 |
| 1.20.5 - 1.21.3 | Java 21 |
| 1.21.4+ | Java 21（推荐 Java 25） |

`.jar` 文件的名字可以不是 `server.jar`，但要确保命令中的名字和实际文件名一致。

## 配置服务端

服务端启动后会生成一些文件和文件夹，首次启动时，服务器可能会由于缺失 `eula.txt` 和 `server.properties` 文件而无法正常运行。我们需要先同意 EULA 协议，编辑 `eula.txt` 文件，将其中的 `eula=false` 修改为 `eula=true`，然后保存文件。

`server.properties` 应该已经被服务端第一次运行创建，我们可以编辑这个文件来配置服务器的各种设置，例如服务器端口、游戏模式、难度等。修改完成后，保存文件并重新启动服务端，新的配置就会生效。

如果 `server.properties` 中指向的世界不存在，那么启动服务端时就会按照照 `server.properties` 中的设置来创建一个新的世界。如果想要修改创建存档的参数，需要在 `server.properties` 中修改，详细的介绍可以通过 wiki 了解。 [服务端配置文件格式](https://zh.minecraft.wiki/w/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F)

当同意 EULA 协议后，我们再次启动服务端，它就会自动创建一个新的世界（也可以上传一个世界，然后修改 `server.properties` 中的 `level-name` 来指定世界名称，这样不会创建新的世界）

等待一段时间后，服务端会输出一行

```text
[HH:MM:SS] [Server thread/INFO]: Done (time)! For help, type "help"
```

这表示服务端已经成功启动了，但其可能不是最后一行输出，因此当命令行不再输出新内容时，可以尝试在命令行中输入 `help` 来确认服务端是否已经完全启动。

这个服务端默认在本地的 25565 端口运行（端口通过 `server.properties` 配置）。所以我们现在启动 Minecraft Java 版 26.1.2，进入多人游戏界面，点击“直接连接”，输入 `localhost:25565` 或者 `127.0.0.1:25565` 就可以连接到我们刚才启动的服务端了。如果你在 WSL 上启动了服务器，想用 Windows 端的 Minecraft 连接，需要使用 WSL 的 IP 地址，而不是 `localhost`。这个地址可以通过下面的命令来获取：

```bash
hostname -I
```

![server running](/img/post/03_install_java_server/server_running.webp)

可以在命令行中看到有谁访问了服务器。

Mojang 提供的原版服务器功能比较基础，与单人游戏相比仅仅提供了下面的多人游戏专用的命令：

| 命令            | 描述                               | 需要的权限等级 |
| --------------- | ---------------------------------- | -------------- |
| /ban            | 将玩家加入封禁列表。               | 3              |
| /ban-ip         | 将IP地址加入封禁列表。             | 3              |
| /banlist        | 显示封禁列表。                     | 3              |
| /deop           | 撤销玩家的管理员权限。             | 3              |
| /op             | 授予玩家管理员权限。               | 3              |
| /pardon         | 解封玩家。                         | 3              |
| /pardon-ip      | 从封禁列表中解封指定IP。           | 3              |
| /perf           | 记录并保存性能分析数据（10秒内）。 | 4              |
| /save-all       | 保存服务器世界状态到硬盘。         | 4              |
| /save-off       | 关闭服务器自动保存。               | 4              |
| /save-on        | 开启服务器自动保存。               | 4              |
| /setidletimeout | 设置无操作玩家被踢出的延时。       | 3              |
| /transfer       | 将玩家转移到另一个服务器上。       | 3              |
| /whitelist      | 管理服务器白名单。                 | 3              |

这就是我们为什么要选择第三方服务端。

## 第三方服务端

原版服务端的游玩体验和原版单人游戏差不多，除了一些管理多人游戏的指令之外，并没有什么特别的功能。第三方服务端则提供了更多的功能和更好的性能优化，常见的第三方服务端有 Bukkit、Spigot、Paper、Sponge 等。

根据功能和性能的不同，这些服务端可以分为插件端、模组端和混合端三类：

### 插件端

插件端上可以添加第三方插件，这些插件类似仅修改服务端表现的mod，需要遵循网络协议，而玩家不需要添加这些东西。与原版端相比，插件就是更灵活和强大的数据包。

第三方服务端的主要路径是 Bukkit、Spigot、Paper，后一个是前一个的分支，也各自有一些分支，现在几乎所有的新版服务端都是基于 Paper 的分支开发的。这意味着基于 Bukkit API 开发的插件可以在绝大多数第三方服务端上运行。

不同的服务端有不同的特色和功能，具体选择可以参考下表（来自Cubic Wiki）：

| 版本          | 目的   | 服务端                       |
| ------------- | ------ | ---------------------------- |
| 1.8-1.12.2    | PVP    | PandaSpigot                  |
|               | 生存   | SportPaper                   |
| 1.12.2-1.16.5 | 性能   | Beast                        |
|               | 稳定   | Paper                        |
| 1.16.5-       | 生电   | Purpur(1.18-), Leaves(1.18+) |
|               | 高性能 | Purpur(1.19-), Leaf(1.19+)   |
|               | 其他   | Purpur                       |

这是大致的分类，下表详细列出了主流服务端的特点：

| 服务端              | 基于的服务端 | 主要特点与版本侧重                                  | 插件兼容性                                           | 备注                                                   |
| ------------------- | ------------ | --------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| **Paper**           | **Spigot**   | 高性能优化、异步处理、现代主流、社区最活跃          | 很多插件会以此核心为标准之一进行兼容                 | 高版本性能逐渐比不过其他的分支，而且丧失了很多原版特性 |
| **Purpur**          | **Paper**    | 高度可配置 + 额外游戏机制调整，现代主流             | 兼容 Paper 的全部插件                                | 只有部分MC版本的构建                                   |
| **Leaf**            | **Paper**    | 平衡性能、原版行为与稳定性，适合大型网络            | 支持 Paper 能使用的几乎所有插件                      | 国产插件                                               |
| **Leaves**          | **Paper**    | 修复被 Paper “破坏”的原版机制，保持更原版的行为     | 支持 Paper 能使用的几乎所有插件                      | 优化不如 Purpur 和 Leaf                                |
| **Folia**           | **Paper**    | 区块分组性能优化                                    | 完全破坏了 Bukkit 插件的兼容性，目前只支持很少的插件 | Folia 不适合新手，新手无论如何都不要考虑！             |
| **Luminol**         | **Folia**    | 基于 Folia 的性能优化，专注于高并发环境下的性能提升 | 兼容 Folia 的原生插件                                | 推荐使用这个而不是直接使用 Folia                       |
| **LightingLuminol** | **Luminol**  | 重点修复对 Bukkit API 的破坏，大幅提升旧插件兼容性  | 兼容 Luminol 的原生插件，兼容部分 Bukkit 插件        | 推荐使用这个而不是直接使用 Folia                       |

### 模组端

> 这里讨论的是可以安装模组但不可以安装插件的服务端，两个都可以使用的服务端见后面的混合端。

Minecraft 有三个主流的模组加载器，Forge、NeoForge 和 Fabric，模组端服务端就是基于这些模组加载器开发的服务端，玩家需要安装对应的模组加载器和模组才能连接到服务器。NeoForge 和 Legacy Fabric 分别是 Forge 和 Fabric 的分支。

这些模组加载器也提供了多人游戏服务端，可以直接在官网获取。

### 混合端

> 一般很少使用混合端，Mod 作者们绝大多数都不会受理与混合端相关的问题。

这里直接引用 Cubic Wiki 的表格：

#### Forge

| 名称           | 介绍                                                                                                                                                                                                             | 推荐与否       | 下载镜像 | 支持版本              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------- | --------------------- |
| Crucible       | Thermos 的分支，目前还在积极维护，完全兼容 Thermos                                                                                                                                                               | 推荐           | -        | 1.7.10                |
| CatServer      | (推荐，但我真不喜欢核心内置广告)。既可以加入 mod 又可以加入插件。缺点：部分插件不支持，部分 mod 不支持；mod 和插件在一起运行难免出现一些七七八八的 bug。                                                         | 推荐 1.12.2    | -        | 1.12.2/1.16.5/1.18.2/ |
| Mohist         | 兼容 Paper 的一些插件支持，兼容 mod 和插件；缺点：比较多插件不支持，部分 mod 不支持；mod 和插件在一起运行难免出现一些七七八八的 bug。                                                                            | 推荐高版本     | -        | 1.12.2/1.16.5/1.18+   |
| Arclight-Forge | -                                                                                                                                                                                                                | 推荐高版本     | -        | 1.12.2/1.16.5/1.18+   |
| Sponge         | 可加入 Sponge 插件，支持 mod，内置小部分优化，非 Sponge 服务端可安装 mod 获得同等效果。缺点：即使你用了很多办法也很难让 Bukkit 插件稳定运行；Sponge 插件特别少；启动速度特别慢。操作特别难，与前面的完全不相同。 | 不推荐新手使用 | -        | 1.7.10 - 最新         |

#### Fabric

| 名称            | 介绍                                                                 | 推荐与否 | 下载镜像 |
| --------------- | -------------------------------------------------------------------- | -------- | -------- |
| Taiyitist       | 并不是一款端，而是一个 mod 需要安装在 Fabric，安装后重启即可加载插件 | -        | -        |
| Arclight-Fabric | 出现时间比 Banner 晚，目前不太稳定                                   | -        | -        |
| Cardboard       | 支持的版本较多，支持 1.16.5-1.20.4                                   | -        | -        |

#### NeoForge

| 名称                | 介绍                                                                                                                                                                                                                                                                 | 下载镜像 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Arclight - NeoForge | 用 Mixin 实现的 Bukkit API 和 Neoforge 实现的混合端                                                                                                                                                                                                                  | -        |
| Youer               | 结合了 NeoForge 模组支持和 Paper API 兼容性，能无缝支持 Bukkit/Spigot/Paper 生态系统的插件，并且针对模组环境进行了性能和稳定性优化。其技术栈包含 NeoForge、Bukkit、CraftBukkit、Spigot、Paper、Purpur、Arclight Remapping 等组件，部分组件集成已完成，部分仍在进行中 | -        |
| Magma - Neo         | 用 Patch 实现的 Neoforge 和 Spigot API 的混合端                                                                                                                                                                                                                      | -        |


## 进一步配置服务端

选择好服务端后，去他们的官网下载对应版本的服务端，下载完成后按照之前的步骤启动服务端就可以了，不过，我们可以对服务端进行一些进一步的配置。

服务器内主要有下面的配置文件：

- server.properties：通用的服务器配置文件，包含了服务器的基本设置，如端口、游戏模式、难度、世界名称等。
- ops.json：管理员列表，包含了具有管理员权限的玩家。
- whitelist.json：白名单列表，包含了被允许连接到服务器的玩家。
- banned-players.json：封禁玩家列表，包含了被禁止连接到服务器的
玩家。
- banned-ips.json：封禁IP列表，包含了被禁止连接到服务器的IP地址。
- 其他服务端可能还有一些特定的配置文件，例如 Paper 的 paper.yml，Purpur 的 purpur.yml 等，这些文件包含了服务端特定的配置选项，可以根据需要进行修改。

下面是常用的设置：

设置默认游戏模式：

```properties
gamemode=survival
```

开启白名单：

```properties
white-list=true
```

开启正版验证：

```properties
online-mode=true
```

设置世界名称：

```properties
level-name=world
```

## 启动脚本

为了方便起见，我们可以创建一个启动脚本来简化启动服务端的过程。以下是一个简单的 Bash 脚本示例：

```bash
# 设置 Java 环境变量
JAVA="/path/to/java" # 替换为你的 Java 路径
# 设置服务器内存大小
XMX="4G"
XMS="4G"
# 设置服务器 jar 文件名
JAR="server.jar" # 替换为你的服务器 jar 文件名
# 启动服务器
$JAVA -Xmx$XMX -Xms$XMS -jar $JAR nogui
```

将上述内容保存为 `start.sh`，并给予执行权限：

```bash
chmod +x start.sh
```

写成脚本后，每次启动服务器只需要运行 `./start.sh` 就可以了，避免了每次都要输入长命令的麻烦。我们还可以再进行进一步的修改：

自动重启：

```bash
#!/bin/bash
JAVA="/path/to/java"
XMX="4G"
XMS="4G"
JAR="server.jar"
while true; do
    $JAVA -Xmx$XMX -Xms$XMS -jar $JAR nogui
    echo "服务器已停止，正在重启..."
    sleep 5 # 等待 5 秒后重启
done
```

通过这样自动重启的脚本，即使服务器崩溃了也能自动重启，保持服务器的持续运行，通过 `Ctrl + C` 可以手动停止服务器。

## 图形化管理

纯命令行的服务端可能比较难以管理，我们可以在服务器上运行一个 Minecraft Server Manager (MCSM) 服务来提供一个网页管理面板。

在 Ubuntu/Centos/Debian/Arch 等主流 x86_64/ARM 架构的操作系统都支持下面的安装命令

因为需要注册到系统服务，一键安装脚本必须使用 root 权限运行。

```bash
sudo su -c "wget -qO- https://script.mcsmanager.com/setup_cn.sh | bash"
```

通过下面的命令来启动 MCSM 服务：

```bash
# 先启动面板守护进程。
# 这是用于进程控制，终端管理的服务进程。
systemctl start mcsm-daemon.service
# 再启动面板 Web 服务。
# 这是用来实现支持网页访问和用户管理的服务。
systemctl start mcsm-web.service

# 重启面板命令
systemctl restart mcsm-daemon.service
systemctl restart mcsm-web.service

# 停止面板命令
systemctl stop mcsm-web.service
systemctl stop mcsm-daemon.service
```

启动完毕后，在命令行里可以看到

![mcsm start](/img/post/03_install_java_server/mcsm_start.webp)

连接提供的 HTTP 面板地址就可以访问管理页面了，第一次进入会要求创建一个管理员账号，并询问是否需要引导。

![mcsm login](/img/post/03_install_java_server/mcsm_login.webp)

如果我们已经按前面的流程创建了服务器，就可以使用上传zip的方式创建新实例了，也可以直接按 mcsm 提供的模板创建新实例。

![mcsm new](/img/post/03_install_java_server/mcsm_new.webp)

一键安装后的 MCSM 面板默认使用 23333 端口，可以直接在通过 localhost:23333 或使用 WSL 的 IP 地址访问这个端口来访问面板。该服务会在 WSL 启动时自动启动，所以不需要担心忘记启动服务的问题了。

在 MCSM 中，所有服务器和通用控制台程序都被包装为实例，每个实例的文件相互隔离，被存放在 `/opt/mcsmanager/daemon/data/InstanceData/` 

## 安装插件

安装插件很简单，只需要将插件的 `.jar` 文件放到服务器目录下的 `plugins` 文件夹中，然后重启服务器，插件就会被加载了。

插件的配置文件主要通过 `plugins` 文件夹中的子文件夹来管理，每个插件通常会有一个以插件名称命名的文件夹，里面包含了该插件的配置文件和数据文件。配置文件主要使用 YAML 语法，不同插件的配置文件格式和内容可能会有所不同，具体可以参考插件的文档或者官方网站。

多数插件会提供如下的重载指令,以允许修改配置文件后不重启服务器就能让修改生效：

```bash
插件名称或简写 reload
```

> 用客户端运行命令记得加上 `/` 前缀，例如 `/插件名称或简写 reload`，否则会被当成聊天消息发送。

使用 `plugins` 或者 `pl` 命令可以查看服务器上安装了哪些插件

加载成功、失败的插件会用绿色和红色显示，启动服务器或重载时可以在命令行看到加载时的输出信息。

寻找插件的过程可能会比较麻烦，可以在 [SpigotMC](https://www.spigotmc.org/resources/) 和 [Bukkit](https://dev.bukkit.org/bukkit-plugins) 上寻找插件，或者直接在搜索引擎上搜索插件名称加上“Bukkit”或者“Spigot”等关键词。

下面是常用的插件列表，每种类型只列出一个最具代表性的插件：

| 插件名称                                                                                                              | 类型     | 功能                                                                            |
| --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| [EssentialsX](https://www.spigotmc.org/resources/essentialsx.9089/)                                                   | 基础     | 提供了例如服务器传送、家、私聊、木牌商店、昵称等相关的命令，老牌插件            |
| [CoreProtect](https://modrinth.com/plugin/coreprotect)                                                                | 防破坏   | 记录玩家的方块破坏和放置行为，方便管理员查找和恢复被破坏的区域。比较轻量级。    |
| [InvSee++](https://www.spigotmc.org/resources/invsee.82342/)                                                          | 查看     | 可以查看和编辑其他玩家的物品栏和末影箱。                                        |
| [Carbon](https://modrinth.com/plugin/carbon)                                                                          | 聊天     | 现代频道制聊天插件，支持 MiniMessage 格式、跨服聊天、可高度自定义。             |
| [EcoItems](https://www.spigotmc.org/resources/ecoitems-free-%E2%AD%95-make-custom-items.117785/)                      | 物品库   | 强大的自定义物品插件（有免费版），支持武器、防具、等级、稀有度等。              |
| [LuckPerms](https://modrinth.com/plugin/luckperms)                                                                    | 权限     | 最流行的高性能权限管理插件，支持多平台、Web 编辑器和大规模网络。                |
| [Plugin Portal](https://modrinth.com/plugin/pluginportal)                                                             | 插件管理 | 游戏内插件下载/更新工具，支持 Modrinth、Spigot、Hangar 等市场（有付费高级版）。 |
| [BeautyQuests](https://www.spigotmc.org/resources/beautyquests.39255/)                                                | 任务     | GUI 驱动的简单易用任务系统，支持 NPC 和图形化创建。                             |
| [Residence](https://www.spigotmc.org/resources/residence-1-7-10-up-to-1-21.11480/)                                    | 领地     | 经典的玩家领地保护插件，支持细分权限和出租。                                    |
| [PlotSquared](https://www.spigotmc.org/resources/plotsquared-v7.77506/)                                               | 地皮     | 专业地皮/剧情世界管理插件，支持生成和保护无限地皮。                             |
| [ASkyBlock](https://www.spigotmc.org/resources/askyblock.1220/)                                                       | 空岛     | 经典空岛插件（较老）。                                                          |
| [BentoBox](https://www.spigotmc.org/resources/bentobox-bskyblock-acidisland-skygrid-caveblock-aoneblock-boxed.73261/) | 领域     | 模块化空岛/游戏模式框架，支持多种附加组件。                                     |
| [Towny](https://modrinth.com/plugin/towny)                                                                            | 城镇     | 经典城镇与国家系统插件，支持经济、战争和领地管理。                              |
| [WorldEdit](https://modrinth.com/plugin/worldedit)                                                                    | 建筑     | 创世神(小木斧)，最强大的方块编辑工具，支持快速选区和操作。                      |
| [WorldGuard](https://modrinth.com/plugin/worldguard/version/7.0.11)                                                   | 保护     | 区域保护和标志系统插件，与 WorldEdit 配合最佳。                                 |
| [Multiverse](https://modrinth.com/plugin/multiverse-core)                                                             | 多世界   | 经典多世界管理插件，支持不同世界生成器和传送。                                  |
| [DeluxeHub](https://www.spigotmc.org/resources/deluxehub-3-professional-hub-management.49425/)                        | 大厅     | 专业大厅管理插件，支持计分板、传送、双跳等。                                    |
| [Terra](https://modrinth.com/plugin/terra)                                                                            | 世界生成 | 现代自定义世界生成器，支持配置包创建独特地形。                                  |
| [Slimefun](https://www.spigotmc.org/resources/slimefun.134248/)                                                       | 游戏性   | 粘液科技，经典插件，包含数百种机器和物品。                                      |

## 备份存档

别忘了备份存档，尤其是当你安装了很多插件或者模组的时候，存档可能会因为插件或模组的更新而损坏，所以定期备份存档是非常重要的。你可以使用一些自动备份工具来定期备份存档，或者手动复制存档文件夹到其他位置进行备份。下面是一些用于自动备份的服务器插件：

| 插件名称              | 介绍                                                    |
| --------------------- | ------------------------------------------------------- |
| [eBackup](https://www.spigotmc.org/resources/ebackup-simple-and-reliable-backups-for-your-server-supports-ftp-sftp.69917/)               | 可设置黑名单不备份某些文件，FTP 远程备份支持            |
| [Server Backup](https://www.spigotmc.org/resources/server-backup-ingame-dropbox-ftp-backup-1-8-1-20-multithreaded.79320/)         | 可支持动态备份 (即只备份最近变更过的文件)，占用空间更小 |
| [InventoryRollbackPlus](https://www.spigotmc.org/resources/.85811) | 插件可以备份玩家的背包。                                |

如果没有使用第三方服务端，也可以用下面的软件进行自动备份

[MCServerBackup](https://github.com/OblivionOcean/MCServerBackup)

[BorgBackup](https://www.borgbackup.org/)

[rsnapshot](https://rsnapshot.org/)

> 如果你实在走投无路了，也不是不可以手动备份，只记得在对服务端进行重大更改之前一定要进行一次备份，不然数据火葬场。

事实上，服务器上的存档安全还是很容易爆炸的，考虑到mc存储数据的方式，下面的这些东西可能会一起爆炸：

- **区块数据**：每个区块被单独存储，如果这个文件炸了，整个区块就炸了，导致玩家在这个区块内的建筑和物品丢失。

- **实体**：所有的实体被存储在一个文件中，如果这个文件炸了，所有的实体（包括掉落物、村民、动物等）都会丢失。

- **命令存储（storage）**：一般是数据包玩家关心的，每个 storage 被单独存储在一个文件中，这个文件炸了会导致整个 storage 的数据丢失。

- **记分板**：这一般也是数据包玩家关心的，所有计分项和分数持有者的数据被存放在一个文件中，如果这个文件炸了，所有计分项和分数持有者的数据都会丢失。（分数不是记在玩家或者实体身上的）

- **玩家数据**：每个玩家的数据被单独存储在一个文件中，如果这个文件炸了，玩家的所有数据（包括位置、背包、经验等）都会丢失。

这也是为什么定期备份非常重要，这类数据损坏不是用某些插件能防止的服务器破坏，只有备份才能防止数据丢失。

## 使用 systemd 管理服务

到这里为止，我们启动 Minecraft 服务端和 MCSM 时都直接在终端里运行命令，或者依赖 MCSM 自带的安装脚本来注册服务。但如果你想在没有 MCSM 的情况下让服务端在后台持续运行、开机自动启动、崩溃后自动重启，就需要认识 Linux 中的服务管理工具 `systemd`。

### systemd 和 systemctl 是什么

`systemd` 是现代 Linux 发行版（包括 Debian、Ubuntu、CentOS 等）默认的系统和服务管理器。它负责在系统启动时按顺序启动各种服务，也可以管理服务的生命周期。

`systemctl` 是 `systemd` 的命令行控制工具。我们用它来启动、停止、重启、查看服务状态。

### 常用 systemctl 命令

| 命令 | 作用 |
| --- | --- |
| `systemctl start 服务名` | 启动服务 |
| `systemctl stop 服务名` | 停止服务 |
| `systemctl restart 服务名` | 重启服务 |
| `systemctl status 服务名` | 查看服务状态 |
| `systemctl enable 服务名` | 设置开机自启 |
| `systemctl disable 服务名` | 取消开机自启 |
| `systemctl enable --now 服务名` | 设置开机自启并立即启动 |
| `systemctl daemon-reload` | 重新加载服务配置文件（新增或修改 .service 文件后必须执行） |

例如，前面安装 MCSM 时使用的：

```bash
systemctl start mcsm-daemon.service
systemctl start mcsm-web.service
```

就是在用 `systemctl` 启动 MCSM 的两个服务。

### 查看服务日志

systemd 会自动收集服务的输出日志，可以使用 `journalctl` 查看：

```bash
journalctl -u 服务名 -f
```

其中：

- `-u 服务名`：只看指定服务的日志
- `-f`：持续跟随输出新日志（类似 `tail -f`）

### 为 Minecraft 服务端编写 systemd 服务

如果你不想使用 MCSM 面板，也可以直接用 systemd 管理你的 Minecraft 服务端。

先创建一个服务文件：

```bash
sudo vim /etc/systemd/system/minecraft.service
```

写入：

```ini
[Unit]
Description=Minecraft Server
After=network.target

[Service]
Type=simple
User=mc
WorkingDirectory=/home/mc/server
ExecStart=/usr/bin/java -Xmx4G -Xms4G -jar server.jar nogui
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

几个关键配置：

| 配置 | 作用 |
| --- | --- |
| `After=network.target` | 等网络就绪后再启动 |
| `User=mc` | 使用第二课中创建的 `mc` 用户运行，而不是 root |
| `WorkingDirectory` | 服务端所在目录 |
| `ExecStart` | 启动命令，如果使用 Liberica JRE 需要替换为完整路径 |
| `Restart=on-failure` | 异常退出时自动重启 |
| `WantedBy=multi-user.target` | 允许开机自启 |

然后加载并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now minecraft
sudo systemctl status minecraft
```

以后修改了服务端配置需要重启时：

```bash
sudo systemctl restart minecraft
```

查看服务端输出日志：

```bash
journalctl -u minecraft -f
```

> 理解 systemd 和 systemctl 是 Linux 服务器管理的基本功。下一课我们配置 frp 内网穿透时，也会用同样的方式来管理 frp 服务。

## 下一步

到目前为止，我们的 Minecraft 服务端已经可以在本地运行，并且可以通过 `localhost:25565` 或局域网 IP 连接。但如果你想让互联网上的朋友也能连进来，就需要解决内网穿透的问题。

下一课我们将学习如何使用 frp 把内网里的 Minecraft 服务端暴露到公网，让全世界的小伙伴都能连接你的服务器。

## Q&A

Q：开发玩法功能，选择数据包还是插件？

A：这是一个经常被问到的问题，甚至有时充满了各种偏见。一般来说，插件的功能和性能都远优于数据包，只有下面的场景才适合使用数据包：

- 你的功能想要发布成单人/局域网联机地图

- 你想要将作品发布到 Realms 上（即只能使用原版服务端）

- 你只会编写数据包，不会编写插件

- 你想要你的功能在新版本刚刚发布时就能使用（因为第三方服务端通常会有一些滞后）

- ~~你是香草图书馆忠实粉丝~~

一个比较常见的误区可能是数据包始终有最强的兼容性，其实不然，很多服务端为了性能修改了很多原版特性，虽然这些服务端也支持数据包，但为原版设计的数据包可能在这些服务端上表现不佳，甚至完全无法正常运作。另一个极端是认为插件和数据包两者完全不相容，实际上在服务端上利用插件来辅助原本是数据包开发的项目是很常见的，这种情况使用leaves的服务端就可以很好的兼容数据包和插件了。还有一种典型情况是不依靠数据包实现玩法（即不适用函数部分），而是通过数据包去配置一些其他的游戏机制（战利品表、附魔、标签等）。

## 参考

[https://nitwikit.8aka.org](https://nitwikit.8aka.org)

[https://zh.minecraft.wiki/w/%E6%9C%8D%E5%8A%A1%E5%99%A8?variant=zh-cn](https://zh.minecraft.wiki/w/%E6%9C%8D%E5%8A%A1%E5%99%A8?variant=zh-cn)

[https://zh.minecraft.wiki/w/%E6%95%99%E7%A8%8B#%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AE%BE%E7%BD%AE](https://zh.minecraft.wiki/w/%E6%95%99%E7%A8%8B#%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AE%BE%E7%BD%AE)
