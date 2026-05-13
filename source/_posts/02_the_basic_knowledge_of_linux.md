---
title: 第二课 Linux的基础知识
date: 2026-05-12 11:09:50
tags: [活动,课程宣讲]
cover: /img/post/02_the_basic_knowledge_of_linux/linux-minecraft-server-cover.webp
---
# 从入门到入土的Linux架设MC服的第二课：Linux的基础知识

在第一课中，我们已经完成了 Linux 入门、终端基础、下载和解压、Java 准备等内容。

这一节课我们将学习关于Linux用户、文件权限、SSH、IP和端口等基础知识。

## Linux 的用户

Linux 是一个多用户系统。

这里的“多用户”不只是说“很多人可以登录这台电脑”，也包括系统里的程序、服务、文件通常都有自己的所属用户。比如一个 Minecraft 服务端可以由专门的 `mc` 用户运行，网站服务可以由另一个用户运行，数据库也可以有自己的用户。

这听起来比 Windows 上“双击启动”麻烦一点，但好处是很明显的：不同用户之间的权限可以隔开。一个普通用户能改坏的东西通常有限，而 `root` 用户几乎什么都能改。

### 用户与用户组

可以先看自己现在是谁：

```bash
╭─[fridayssheep@allinone:~]—{^o^}—(14:54:45)—(2.569s)
╰─$> whoami
fridayssheep
╭─[fridayssheep@allinone:~]—{^o^}—(14:54:47)—(66ms)
╰─$>
```

再看自己属于哪些用户组：

```bash
id
```

输出可能类似：

```bash
╭─[fridayssheep@allinone:~]—{^o^}—(14:54:47)—(66ms)
╰─$> id
uid=1000(fridayssheep) gid=1000(fridayssheep) 组=1000(fridayssheep),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),102(scanner),106(bluetooth),108(lpadmin),988(docker)
╭─[fridayssheep@allinone:~]—{^o^}—(14:54:56)—(12ms)
╰─$>
```
- `uid`：user id，用户编号
- `gid`：group id，当前用户的主用户组编号
- `groups` / `组`：这个用户还属于哪些用户组

Linux 内部并不是直接靠用户名来判断权限，而是靠数字编号

```text
uid=1000(fridayssheep)
```

- 这个用户的名字是 `fridayssheep`
- 这个用户在系统内部的编号是 `1000`

```text
gid=1000(fridayssheep)
```

- 当前用户的主用户组是 `fridayssheep`
- 这个主用户组在系统内部的编号是 `1000`

```text
组=1000(fridayssheep),24(cdrom),44(video),988(docker)
```

表示这个用户除了自己的主用户组以外，还属于 `cdrom`、`video`、`docker` 等附加用户组。

### UID 和 GID

在Linux系统中，UID（User ID） 和 GID（Group ID） 是用户与用户组的唯一数字标识符，系统通过它们来进行身份识别与权限控制，而不是直接识别用户名或组名。

> UID 用于标识单个用户：
> 0：超级用户（root），拥有最高权限。
> 1\~999（CentOS7为1\~1000）：系统或虚拟用户，用于运行服务，不允许直接登录。
> 1000及以上：普通用户。

> GID 用于标识用户组：
> 每个用户在创建时会生成一个与用户名相同的基本组（GID与UID相同）。
> 用户还可以加入多个附加组，以便共享文件或权限。


### 主用户组和附加用户组

每个用户都有一个主用户组，也可以有多个附加用户组。

主用户组通常和用户名同名。比如创建 `fridayssheep` 用户时，系统往往也会创建一个 `fridayssheep` 用户组，并把它设为这个用户的主用户组。

附加用户组用来授予额外权限。例如：

| 用户组 | 常见含义 |
| --- | --- |
| `sudo` / `wheel` | 允许使用管理员权限 |
| `docker` | 允许管理 Docker |
| `video` | 允许访问显卡、显示相关设备 |
| `audio` | 允许访问音频设备 |
| `plugdev` | 允许访问部分可插拔设备 |

用户组可以理解为“给一批用户统一分配权限”的方式。比如一台服务器上有几个人一起管理 MC 服务端，可以把他们都放进同一个 `mc` 用户组，然后让服务端目录属于这个组。这样不需要把所有人都变成 `root`，也能让他们一起维护同一份文件。

查看自己属于哪些用户组，也可以直接用：

```bash
groups
```

查看某个用户属于哪些组：

```bash
groups 用户名
```

如果想查看系统如何记录用户和用户组，可以知道两个文件：

```bash
/etc/passwd
/etc/group
```

`/etc/passwd` 记录用户的基本信息，`/etc/group` 记录用户组信息。虽然名字叫 `passwd`，现代 Linux 系统里它通常不直接保存密码明文，密码哈希一般在 `/etc/shadow` 里，并且需要管理员权限才能读取。

```bash
╭─[fridayssheep@allinone:~]—{^o^}—(17:21:24)—(2.630s)
╰─$> sudo cat /etc/passwd
[sudo] fridayssheep 的密码：
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
dhcpcd:x:100:65534:DHCP Client Daemon:/usr/libexec:/bin/false
tss:x:101:103:TPM software stack:/var/lib/tpm:/bin/false
systemd-coredump:x:991:991:systemd Core Dumper:/:/usr/sbin/nologin
systemd-timesync:x:990:990:systemd Time Synchronization:/:/usr/sbin/nologin
messagebus:x:989:989:System Message Bus:/nonexistent:/usr/sbin/nologin
sshd:x:988:65534:sshd user:/run/sshd:/usr/sbin/nologin
dnsmasq:x:999:65534:dnsmasq:/var/lib/misc:/usr/sbin/nologin
avahi:x:102:107:Avahi mDNS daemon:/run/avahi-daemon:/usr/sbin/nologin
speech-dispatcher:x:103:29:Speech Dispatcher:/run/speech-dispatcher:/bin/false
usbmux:x:104:46:usbmux daemon:/var/lib/usbmux:/usr/sbin/nologin
cups-pk-helper:x:105:108:user for cups-pk-helper service:/nonexistent:/usr/sbin/nologin
fwupd-refresh:x:987:987:Firmware update daemon:/var/lib/fwupd:/usr/sbin/nologin
sddm:x:106:110:Simple Desktop Display Manager:/var/lib/sddm:/bin/false
saned:x:107:111::/var/lib/saned:/usr/sbin/nologin
geoclue:x:108:112::/var/lib/geoclue:/usr/sbin/nologin
polkitd:x:986:986:User for polkitd:/:/usr/sbin/nologin
rtkit:x:109:113:RealtimeKit:/proc:/usr/sbin/nologin
colord:x:110:114:colord colour management daemon:/var/lib/colord:/usr/sbin/nologin
fridayssheep:x:1000:1000:Fridayssheep,,,:/home/fridayssheep:/bin/bash
_flatpak:x:111:115:Flatpak system-wide installation helper:/nonexistent:/usr/sbin/nologin
pipewire:x:983:109:system user for pipewire:/nonexistent:/usr/sbin/nologin
Debian-exim:x:112:116::/var/spool/exim4:/usr/sbin/nologin
_dhcpcd:x:980:980:DHCP Client Daemon:/var/lib/dhcpcd:/sbin/nologin
╭─[fridayssheep@allinone:~]—{^o^}—(17:21:30)—(2.814s)
╰─$>
```


创建一个用户组：

```bash
sudo groupadd mc
```

把用户加入某个组：

```bash
sudo usermod -aG mc sheep
```

- `-G mc`：设置附加用户组
- `-a`：append，追加到现有附加组里

警告：如果忘了 `-a`，可能会把用户原来属于的其他附加组覆盖掉。比如一个有 `sudo` 权限的用户，如果被错误地改掉了组，可能会失去 `sudo` 权限。

再次警告：如果你在远程服务器上操作用户和用户组，尤其是修改了当前用户的组，可能会导致权限问题，甚至无法继续使用 `sudo`。所以在修改用户组之前，请务必确认你对命令的理解，并且最好在本地环境里先练习一遍。

修改用户组后，通常需要重新登录，新的组权限才会完全生效。


### root 和 sudo

`root` 是 Linux 里的最高权限用户。它可以安装软件、修改系统配置、删除系统文件，也可以改其他用户的文件。安装软件、更新系统、修改系统服务时需要管理员权限。例如：

```bash
sudo apt update
sudo apt install vim fastfetch
```

但如果只是编辑自己 home 目录下的 MC 配置文件、启动自己的服务端、查看日志，一般不需要 `sudo`。请不要滥用 `sudo`，限制用户的权限在 Linux 系统中十分重要。更多时候不是为了防范外在的黑客攻击，而是为了防止自己犯蠢。

| 命令 | 作用 | 要输入谁的密码 |
| --- | --- | --- |
| `sudo 命令` | 用管理员权限执行一条命令 | 当前用户自己的密码 |
| `sudo -i` | 进入一个 root shell | 当前用户自己的密码 |
| `su - 用户名` | 切换到另一个用户 | 目标用户的密码 |
| `su -` | 切换到 root | root 的密码 |

`sudo` 意为让有 sudo 权限的普通用户临时以管理员身份做事。这个普通用户必须在 `sudo`、`wheel` 等管理员用户组里，或者被写进 sudoers 配置中。

`su` 则是 switch user，它更像是“切换登录到另一个用户”。所以 `su - mc` 通常会要求输入 `mc` 这个用户的密码，而不是当前用户的密码。

在 Ubuntu、Debian、WSL Ubuntu 等常见环境里，安装系统时创建的第一个普通用户通常拥有 `sudo` 权限，但 `root` 账户的密码默认可能是锁定或未设置的。此时你可以使用：

```bash
sudo apt update
sudo -i
```

但直接使用一下命令输入用户密码通常不正确：

```bash
su
```

很多发行版默认不鼓励直接用 root 密码登录，因此这个密码通常是随机密码。需要管理员权限时，请优先使用 `sudo`。

在部分发行版本中初次使用`sudo`命令会提示：

```bash
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things: 
    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.
```
```bash
我们信任您已经从系统管理员那里了解了日常注意事项。总结起来无外乎这
三点:
    #1) 尊重别人的隐私。
    #2) 输入前要先考虑后果和风险。
    #3) 权力越大,责任越大。
```

> 比如以后开服时，比较好的习惯是：
>- 用 `sudo` 安装 Java、创建用户、配置防火墙
>- 用普通用户管理服务端文件
>- 不长期使用 `root` 跑 Minecraft 服务端
>
>可以创建一个专门用于开服的用户：
>```bash
>sudo adduser mc
>```
>
>切换到这个用户：
>
>```bash
>su - mc
>```
>
>如果不想输入 `mc` 用户的密码，也可以用当前用户的 sudo 权限切换过去：
>
>```bash
>sudo -iu mc
>```
>
>确认当前身份：
>
>```bash
>whoami
>pwd
>```
>
>这样以后服务端目录可以放在这个用户自己的家目录里，例如：
>
>```bash
>/home/mc/server
>```
## Linux的文件权限

### 文件的归属

在 Linux 中，一个文件通常有两个归属信息：

- 所属用户
- 所属用户组

我们可以用：

```bash
ls -l
```

查看当前目录下文件的详细信息。

例如：

```bash
╭─[fridayssheep@allinone:~/音/Tell Your World]—{^o^}—(17:26:42)—(11ms)
╰─$> ls -l
总计 32980
-rw-r--r-- 1 fridayssheep fridayssheep 33566082  1月 4日 02:49 '初音ミク、DECO 27、livetune-Tell Your World.flac'
-rw-r--r-- 1 fridayssheep fridayssheep   152197 12月 7日 16:12 '初音ミク、DECO 27、livetune-Tell Your World.jpg'
-rw-r--r-- 1 fridayssheep fridayssheep     1868 11月28日 13:27 '初音ミク、DECO 27、livetune-Tell Your World.lrc'
drwxr-xr-x 1 fridayssheep fridayssheep      524  1月26日 02:28 '@eaDir'/
-rw-r--r-- 1 fridayssheep fridayssheep    43520 12月 9日 23:19  Thumbs.db
```

这里两个 `fridayssheep` 分别表示：

- 第一个 `fridayssheep`：文件所属用户
- 第二个 `fridayssheep`：文件所属用户组

如果一个文件属于 `root`，普通用户可能就不能直接修改它。比如：

```bash
╭─[fridayssheep@allinone:~/音/Tell Your World]—{^o^}—(17:26:45)—(9ms)
╰─$> ls -l /etc/fstab
-rw-r--r-- 1 root root 901  5月 5日 19:48 /etc/fstab
╭─[fridayssheep@allinone:~/音/Tell Your World]—{^o^}—(17:27:29)—(10ms)
╰─$>
```

这时普通用户编辑它就可能遇到权限问题。

如果确实需要修改文件归属，可以使用 `chown`。例如把整个服务端目录交给 `mc` 用户：

```bash
sudo chown -R mc:mc /home/mc/server
```

使用前要确认路径，**不要**随手对不熟悉的目录执行递归操作。

### rwx 是什么

继续看 `ls -l` 的输出。

假设我们看到这样一行：
```bash
╭─[fridayssheep@allinone:~/音/愛言葉V]—{^o^}—(17:29:03)—(6ms)
╰─$> ls -l
总计 32176
-rw-rw-r-- 1 fridayssheep fridayssheep 31010196  2月16日 12:20 'DECO_27 - 愛言葉V.flac'
-rw-rw-r-- 1 fridayssheep fridayssheep  1925845  2月16日 12:20 'DECO_27 - 愛言葉V.jpg'
-rw-rw-r-- 1 fridayssheep fridayssheep     5977  2月16日 12:20 'DECO_27 - 愛言葉V.lrc'
```

最前面的部分可以拆成这样：

```text
- rwx r-x r--
  用户 用户组 其他人
```

第一位表示文件类型，常见的有：

- `-`：普通文件
- `d`：目录

后面九位每三位一组：

- 第一组：文件所有者的权限
- 第二组：同组用户的权限
- 第三组：其他人的权限

每一组里的三个字母分别是：

- `r`：read，读取
- `w`：write，写入
- `x`：execute，执行

所以：

```text
rwx
```

表示可读、可写、可执行。

```text
r-x
```

表示可读、不可写、可执行。

```text
r--
```

表示只能读，不能写，也不能执行。

对普通文件来说，`x` 表示这个文件能不能被当作程序或脚本执行。对目录来说，`x` 表示能不能进入这个目录。

### 脚本的执行

我们做一个小实验。

写一个简单脚本：

```bash
echo 'echo server starting' > start.sh
```

查看它的权限：

```bash
╭─[fridayssheep@allinone:~/文/test]—{>_<:130}—(17:31:46)—(9ms)
╰─$> ls -l
总计 4
-rw-rw-r-- 1 fridayssheep fridayssheep 21  5月12日 17:31 start.sh
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:31:47)—(11ms)
╰─$>
```

这个文件可以读、可以写，但没有 `x`。所以直接运行会提示权限不足：

```bash
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:31:47)—(11ms)
╰─$> ./start.sh
-bash: ./start.sh: 权限不够
╭─[fridayssheep@allinone:~/文/test]—{>_<:126}—(17:32:03)—(8ms)
╰─$>
```

给它加上执行权限：

```bash
chmod +x start.sh
```

再看一次：

```bash
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:32:42)—(14ms)
╰─$> ls -l
总计 4
-rwxrwxr-x 1 fridayssheep fridayssheep 21  5月12日 17:31 start.sh*
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:32:45)—(10ms)
╰─$>
```

再次执行：

```bash
╭─[fridayssheep@allinone:~/文/test]—{>_<:130}—(17:33:12)—(10ms)
╰─$> ./start.sh
server starting
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:33:12)—(11ms)
╰─$>
```
现在它就能被当作脚本执行了。
### 使用chmod修改权限

#### chmod 的符号写法
`chmod` 用来修改文件权限。对刚入门的人来说，符号写法比较直观。

给所有人增加执行权限:

```bash
chmod +x start.sh
```

只给文件所有者增加执行权限：

```bash
chmod u+x start.sh
```

移除用户组的写权限：

```bash
chmod g-w server.properties
```

移除其他人的读权限：

```bash
chmod o-r secret.txt
```

这里的字母含义是：

| 符号 | 含义 |
| --- | --- |
| `u` | user，文件所有者 |
| `g` | group，用户组 |
| `o` | others，其他人 |
| `a` | all，所有人 |
| `+` | 增加权限 |
| `-` | 移除权限 |
| `=` | 设置为指定权限 |

比如：

```bash
chmod u=rw,g=r,o= server.properties
```

表示所有者可读写，用户组只读，其他人没有权限。

#### chmod 的数字写法

我们还会看到这样的写法：

```bash
chmod 755 start.sh
chmod 644 server.properties
```

这是 `chmod` 的数字写法。

规则其实很简单：

```text
r = 4
w = 2
x = 1
```
>`rwx` 可以看作三位二进制数，每位对应一个权限：
>- `r`（读）对应二进制的第一位，值为 4（2^2）
>- `w`（写）对应二进制的第二位，值为 2（2^1）
>- `x`（执行）对应二进制的第三位，值为 1（2^0）

把需要的权限加起来：

| 数字 | 权限 |
| --- | --- |
| `7` | `rwx` |
| `6` | `rw-` |
| `5` | `r-x` |
| `4` | `r--` |
| `0` | `---` |

所以：

```bash
chmod 755 start.sh
```

表示：

```text
用户：rwx
用户组：r-x
其他人：r-x
```

也就是自己可以读、写、执行，别人可以读和执行。

```bash
chmod 644 server.properties
```

表示：

```text
用户：rw-
用户组：r--
其他人：r--
```

也就是自己可以读写，别人只能读。

几个常见用途：

| 权限 | 常见用途 |
| --- | --- |
| `755` | 脚本、程序、需要被执行的文件 |
| `644` | 普通配置文件、普通文本 |
| `600` | 私密配置、密钥、只允许自己读写的文件 |

不要为了省事给所有文件都 `chmod 777`。`777` 表示所有人都能读、写、执行，问题也许暂时消失了，但权限边界也一起消失了。

## 使用SSH以远程管理服务器

到目前为止，我们都默认 Linux 环境就在自己电脑上。但真正开服时，服务器可能在很多地方：

- 云服务器
- 宿舍里的一台旧电脑
- NAS
- 开发板
- 实验室机器

这时我们不可能每次都坐到那台机器前面操作。Linux 服务器最常见的远程管理方式就是 SSH。

SSH 可以简单理解为：

> 通过网络安全地登录到另一台机器的终端。

基本格式是：

```bash
ssh 用户名@服务器地址
```

例如：

```bash
ssh sheep@192.168.1.23
```

如果是公网服务器，可能会是：

```bash
ssh root@1.2.3.4
```

连上之后，你看到的终端就不是本机的终端，而是远程服务器的终端。你在里面执行的 `ls`、`cd`、`java -version`，都是在远程服务器上执行。

### 配置 SSH

如果这台机器要被别人通过 SSH 连进来，需要安装 SSH 服务端。Debian / Ubuntu 系可以安装 `openssh-server`：

```bash
sudo apt update
sudo apt install openssh-server
```

查看 SSH 服务状态：

```bash
systemctl status ssh
```

如果没有启动，可以执行：

```bash
sudo systemctl enable --now ssh
```

### 使用 SSH 登录

最基本的 SSH 登录命令是：

```bash
ssh 用户名@服务器地址
```

例如：

```bash
ssh sheep@192.168.1.23
```

如果服务器使用的不是默认 SSH 端口 `22`，需要用 `-p` 指定端口。比如 SSH 服务开在 `2222` 端口：

```bash
ssh -p 2222 sheep@192.168.1.23
```
SSH 还有很多选项可以用来调整连接行为，下面是一些常见选项：

| 选项 | 作用 | 示例 |
| --- | --- | --- |
| `-p` | 指定 SSH 端口 | `ssh -p 2222 user@host` |
| `-i` | 指定私钥文件 | `ssh -i ~/.ssh/id_ed25519 user@host` |
| `-v` | 输出调试信息 | `ssh -v user@host` |
| `-L` | 本地端口转发 | `ssh -L 8080:127.0.0.1:80 user@host` |
| `-N` | 只建立连接，不执行远程命令 | `ssh -N -L 8080:127.0.0.1:80 user@host` |
| `-f` | 连接成功后放到后台 | `ssh -fN -L 8080:127.0.0.1:80 user@host` |


比如用指定私钥和指定端口登录：

```bash
ssh -i ~/.ssh/id_ed25519 -p 2222 sheep@192.168.1.23
```

可以加 `-v` 看更详细的连接过程：

```bash
ssh -v sheep@192.168.1.23
```

如果信息还不够，也可以用 `-vv` 或 `-vvv`，输出会更详细。

第一次连接一台新服务器时，SSH 会询问你是否信任这台远程主机：

```text
The authenticity of host '192.168.1.23' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

如果确认地址没写错，可以输入：

```text
yes
```

之后这台机器的主机指纹会被记录到本地机器的：

```bash
~/.ssh/known_hosts
```

下次再连接时，如果指纹突然变了，SSH 会警告你。常见原因有：

- 远程服务器重装了系统
- 服务器的 SSH 主机密钥被重新生成
- IP 地址被分配给了另一台机器
- 你连错了地址
- 中间人攻击


如果确认是服务器重装或主机密钥正常变化，可以在**本地机器**上删除旧记录：

```bash
ssh-keygen -R 192.168.1.23
```

如果当时连接的是非默认端口，比如 `2222`，删除记录时也要带上端口：

```bash
ssh-keygen -R "[192.168.1.23]:2222"
```

然后重新连接：

```bash
ssh -p 2222 sheep@192.168.1.23
```

### 密码登录和密钥登录

SSH 常见的登录方式有两种。

第一种是密码登录：

```bash
ssh user@server
```

然后输入这个用户的密码。

第二种是密钥登录。先在本机生成一对密钥：

```bash         
ssh-keygen
```

再把公钥放到服务器上：

```bash
ssh-copy-id user@server
```

之后登录时就可以不输入账户密码，或者配合密钥密码使用。

## IP 和端口

如果说前面的用户和权限管理是在“建房子”，那么网络配置就是“修路”。服务端跑起来后，怎么让玩家顺利连进你的世界？我们需要搞懂以下几个核心概念。

### IP、端口与 TCP

先用一个不严谨但好理解的比喻：

- **IP（地址）**：像小区地址，用来在网络里找到某一台机器
- **端口（房门号）**：一台机器上可以同时运行很多服务，端口用来区分这些服务
- **TCP（连接方式）**：一种可靠的网络连接方式，SSH、网页、Minecraft Java 版服务端通常都依靠 TCP 传输数据

比如同一台服务器上可能同时运行：

| 服务 | 常见端口 | 说明 |
| --- | --- | --- |
| SSH | `22/tcp` | 远程登录 |
| HTTP | `80/tcp` | 普通网页 |
| HTTPS | `443/tcp` | 加密网页 |
| Minecraft Java | `25565/tcp` | MC Java 版默认端口 |
| Minecraft Bedrock | `19132/udp` | MC 基岩版默认端口 |


> 举个例子，当玩家在客户端输入 `192.168.1.23:25565` 时，大致意思是：
>
> 去 `192.168.1.23` 这台机器上，敲开 `25565` 这扇门，建立一条 TCP 连接。

一个端口同一时间通常只能被一个程序监听。如果你已经有一个 MC 服务端占用了 `25565`，另一个服务端再想用同一个端口就会失败。要么关掉前一个服务，要么给第二个服务换端口。

端口的数字范围是 `0` 到 `65535`。其中：

| 范围 | 常见含义 |
| --- | --- |
| `0-1023` | 系统常用端口，例如 `22`、`80`、`443`，普通用户通常不能随便监听 |
| `1024-49151` | 注册端口，很多应用会使用 |
| `49152-65535` | 临时端口，系统和程序常用于临时连接 |

所以 MC 选择 `25565` 这种大于 `1024` 的端口，普通用户也可以直接运行服务端监听它。

### 谁能连接我的服务器（本机、局域网与公网）

在开服时，很多“我能连但别人不能连”的千古难题，都来自这里。我们要分清你的 IP 到底是在哪个范围内生效的：

#### localhost：我连我自己

`localhost` 和 `127.0.0.1` 都表示“自己这台机器”。

如果你在运行服务端的同一台电脑上打开 MC 客户端，可以填：

```text
localhost:25565
127.0.0.1:25565
```

自己连得上，只代表服务端在本机能访问，**不代表**别人能进。

#### 局域网 IP：同一个网络里的人连接

局域网 IP 通常长这样：

| 类别 | 地址范围 | 子网掩码 | 可用地址数 |
| --- | --- | --- | --- |
| A类 | 10.0.0.0 - 10.255.255.255 | 255.0.0.0 | 16,777,216 |
| B类 | 172.16.0.0 - 172.31.255.255 | 255.240.0.0 | 1,048,576 |
| C类 | 192.168.0.0 - 192.168.255.255 | 255.255.0.0 | 65,536 |

这些地址一般只在你的内网里有效。比如同一个 Wi-Fi、同一个路由器、同一个实验室交换机下的设备，可能可以互相访问。

在 Linux 里查看本机地址：

```bash
╭─[fridayssheep@allinone:~/文/test]—{>_<:1}—(18:01:17)—(21ms)
╰─$> ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: enp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 22:01:12:a1:0c:3f brd ff:ff:ff:ff:ff:ff
    altname enx220112a10c3f
    inet 192.168.50.3/24 brd 192.168.50.255 scope global dynamic noprefixroute enp2s0
       valid_lft 56775sec preferred_lft 56775sec
    inet6 fda2:3977:ef5f:ae00:a7e8:57fd:7daf:915/64 scope global dynamic noprefixroute
       valid_lft 7084sec preferred_lft 3484sec
    inet6 240a:42a8:c00:f19:3455:a018:d357:5abd/64 scope global dynamic noprefixroute
       valid_lft 7084sec preferred_lft 3484sec
    inet6 240a:42a8:c00:f19::de6/128 scope global dynamic noprefixroute
       valid_lft 7085sec preferred_lft 3485sec
    inet6 fda2:3977:ef5f:ae00::de6/128 scope global dynamic noprefixroute
       valid_lft 7085sec preferred_lft 3485sec
    inet6 fe80::7484:83f3:63df:fd85/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: wlp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 10:6f:d9:31:af:25 brd ff:ff:ff:ff:ff:ff
    altname wlx106fd931af25
    inet 192.168.50.150/24 brd 192.168.50.255 scope global dynamic noprefixroute wlp1s0
       valid_lft 56854sec preferred_lft 56854sec
    inet6 fda2:3977:ef5f:ae00:cc91:538b:9ca:cc75/64 scope global dynamic noprefixroute
       valid_lft 7084sec preferred_lft 3484sec
    inet6 240a:42a8:c00:f19:3bc7:62ac:af67:9ada/64 scope global dynamic noprefixroute
       valid_lft 7084sec preferred_lft 3484sec
    inet6 240a:42a8:c00:f19::714/128 scope global dynamic noprefixroute
       valid_lft 6429sec preferred_lft 2829sec
    inet6 fda2:3977:ef5f:ae00::714/128 scope global dynamic noprefixroute
       valid_lft 6429sec preferred_lft 2829sec
    inet6 fe80::40dc:e103:7e19:3acc/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
4: br-05d1584724ba: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 06:ba:51:72:63:99 brd ff:ff:ff:ff:ff:ff
    inet 172.26.0.1/16 brd 172.26.255.255 scope global br-05d1584724ba
       valid_lft forever preferred_lft forever
    inet6 fe80::4ba:51ff:fe72:6399/64 scope link proto kernel_ll
       valid_lft forever preferred_lft forever
5: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 2a:9d:46:52:e8:91 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
6: br-43e2776264dc: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether be:a4:32:72:1d:ba brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-43e2776264dc
       valid_lft forever preferred_lft forever
    inet6 fe80::bca4:32ff:fe72:1dba/64 scope link proto kernel_ll
       valid_lft forever preferred_lft forever
7: vethaa7ad4a@if2: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-debb90331c08 state UP group default
    link/ether 92:14:24:81:e0:85 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::9014:24ff:fe81:e085/64 scope link proto kernel_ll
       valid_lft forever preferred_lft forever
```

这个输出里最需要看的其实就几项：

- `lo`：回环网卡，也就是自己连自己用的地址，通常是 `127.0.0.1`
- `enp2s0`、`wlp1s0`：真正连接网络的网卡，前者通常是有线网卡，后者通常是无线网卡
- `inet 192.168.50.3/24`：这块网卡的 IPv4 地址，前面的 `192.168.50.3` 就是本机局域网 IP
- `inet6 ...`：这是你的 IPv6 地址

对开服来说，最常用的就是找到这台机器在局域网里的 `inet` 地址，然后让同一网络里的别人用这个地址加端口连接。

如果只想快速看地址，也可以：

```bash
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(18:10:30)—(71ms)
╰─$> hostname -I
192.168.50.3 192.168.50.150 172.26.0.1 172.17.0.1 172.18.0.1 172.24.0.1 172.25.0.1 172.23.0.1 172.19.0.1 172.21.0.1 172.20.0.1 172.22.0.1 172.27.0.1 fda2:3977:ef5f:ae00:a7e8:57fd:7daf:915 240a:42a8:c00:f19:3455:a018:d357:5abd 240a:42a8:c00:f19::de6 fda2:3977:ef5f:ae00::de6 fda2:3977:ef5f:ae00:cc91:538b:9ca:cc75 240a:42a8:c00:f19:3bc7:62ac:af67:9ada 240a:42a8:c00:f19::714 fda2:3977:ef5f:ae00::714
```
所列出的地址为可以通达本机的地址，通常第一个就是局域网 IP。

注意，“同一个校园网”不一定等于“同一个局域网”。有些校园网会隔离不同宿舍、不同 AP、不同 VLAN。即使大家都连着学校 Wi-Fi，也不一定能互相访问。

#### 公网 IP：互联网上的人连接

公网 IP 是互联网能直接访问到的地址。

如果你的服务器是云服务器，例如阿里云、腾讯云、华为云，通常会分配一个公网 IP。外网玩家连接时填的就是：

```text
公网IP:25565
```

如果你的机器在宿舍、家里或实验室，通常在路由器和运营商 NAT 后面，不一定有真正能被外网访问的公网 IP。外网玩家直接连你的局域网 IP 肯定是不行的，连你路由器看到的“公网地址”也不一定行。

常见的内网地址包括：

```text
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
```

还有一种很常见的运营商级 NAT 地址：

```text
100.64.0.0/10
```
![非公网ip的路由器](/img/post/02_the_basic_knowledge_of_linux/router-wan-status.webp)

如果你在路由器 WAN 口看到的是 `10.x.x.x`、`172.16-31.x.x`、`192.168.x.x` 或 `100.64.x.x`，那通常说明你并没有真正直接暴露在公网里。这时外网朋友想连进来，就需要端口转发、公网服务器中转，或者内网穿透。

### 服务端真的在等玩家吗？（端口监听）

有时候连不上，并不是网络卡了，而是服务端根本没在门口“迎客”。在 Linux 中，可以用这个命令查看正在监听的端口：

```bash
ss -tulnp
```

(**t**cp, **u**dp, **l**istening, **n**umeric, **p**rocess)

几个参数的含义是：

- `t`：TCP
- `u`：UDP
- `l`：listening，只看正在监听的端口
- `n`：numeric，不把端口号转换成服务名
- `p`：process，显示对应进程

通常一个系统中会存在不少连接，我们可以使用 `grep` 过滤一下：

```bash
╭─[fridayssheep@allinone:~/文/test]—{>_<:1}—(17:59:22)—(38ms)
╰─$> ss -tulnp | grep 8096
tcp   LISTEN 0      4096                                    0.0.0.0:8096       0.0.0.0:*
tcp   LISTEN 0      4096                                       [::]:8096          [::]:*
╭─[fridayssheep@allinone:~/文/test]—{^o^}—(17:59:26)—(36ms)
╰─$>
```

对于 MC Java 版服务端，可以这样看：

```bash
ss -tulnp | grep 25565
```

如果能看到类似：

```text
tcp LISTEN 0 4096 0.0.0.0:25565 0.0.0.0:* users:(("java",pid=1234,fd=123))
```

说明有一个 Java 程序正在监听 `25565/tcp`。

- `127.0.0.1:25565`：只允许本机访问，别人一般连不进来
- `0.0.0.0:25565`：监听所有 IPv4 网卡，局域网或公网设备才有机会连进来
- `[::]:25565`：监听 IPv6 地址，通常表示 IPv6 也在监听

如果想从另一台机器测试端口是否能连，可以用：

```bash
nc -vz 192.168.1.23 25565
```

如果没有 `nc`，Debian / Ubuntu 可以安装：

```bash
sudo apt install netcat-openbsd
```

注意，`ping` 只能说明 ICMP 是否能到达，并不能证明某个 TCP 端口是通的。测试端口比单纯 `ping` 更有意义。

### 防火墙配置 (ufw)

Minecraft 服务端虽然在监听，但如果防火墙没放行对应端口，玩家还是进不来。Linux 系统里的防火墙就像小区门卫，负责检查每个进出的数据包，看它们有没有通行证。如果没有，就不让它们进来。

通常来说，Ubuntu 和 Debian 不会存在默认的防火墙规则，但是对于暴露在公网的服务器来说，配置防火墙是非常重要的安全措施。它可以帮助你限制哪些端口对外开放，减少被攻击的风险。

Ubuntu 和 Debian 上最简单好用的防火墙工具是 `ufw`。

手动安装它：

```bash
sudo apt update
sudo apt install ufw
```

我们需要手动把 SSH 和 MC 的端口放行：

```bash
# 极其重要：务必先放行 SSH！否则一会开启防火墙后，你自己也会被踢出服务器！
sudo ufw allow ssh 
# 或 sudo ufw allow 22/tcp

# 放行 Minecraft Java 版端口
sudo ufw allow 25565/tcp

# 启用防火墙
sudo ufw enable

# 查看当前生效的规则
sudo ufw status numbered
```

如果需要删除某条规则，可以先用 `ufw status numbered` 查看规则编号，然后执行：

```bash
sudo ufw delete 规则编号
```

如果 SSH 不是默认端口，比如前面改成了 `2222`，就不要只写 `allow ssh`，而应该放行实际端口：

```bash
sudo ufw allow 2222/tcp
```

如果只希望某个固定 IP 能 SSH 进来，可以写得更严格：

```bash
sudo ufw allow from 192.168.1.100 to any port 22 proto tcp
```

这条规则的意思是：只允许 `192.168.1.100` 访问本机的 `22/tcp`。
