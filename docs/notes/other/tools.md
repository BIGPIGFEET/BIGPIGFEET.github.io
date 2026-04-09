# 工具使用

日常使用中的一些工具配置记录。

## Git

### 常用命令

```bash
# 查看状态
git status

# 查看差异
git diff

# 提交
git add .
git commit -m "message"

# 推送到远程
git push

# 创建并切换到新分支，或者VScode左下角直接创建
git checkout -b happy/0817_test
```

### 远程仓库操作

```bash
# 查看远程仓库地址
git remote -v
# 添加远程仓库别名
git remote add origin git@github.com:BIGPIGFEET/BIGPIGFEET.git
# 浅拉取远程仓库最近10次提交
git fetch --depth 10
```

### 配置别名

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"
```

### 合并

#### 用于将两个分支的历史合并。它会创建一个新的合并提交，并保留合并前两个分支的历史。

```bash
git merge
```

工作方式：

- 当你在目标分支（如 main）上运行 git merge feature-branch 时，Git 会将 feature-branch 分支的更改合并到当前分支。
- 如果两个分支没有冲突，Git 会自动创建一个新的合并提交，将这两个分支的历史记录结合在一起。
- 如果存在冲突，Git 会要求你手动解决冲突，然后创建合并提交。

#### 另一种合并更改的方式，但它通过重新应用提交来改变历史记录，使提交历史更加线性。

```bash
git rebase
```

工作方式：

- 当你在 feature-branch 上运行 git rebase main 时，Git 会将 main 分支上的所有提交应用到 feature-branch 之上。
- 实际上，git rebase 会将 feature-branch 上的每个提交暂时保存起来，然后将它们一一应用到 main 分支的最新提交之后，形成一个新的提交链。
- 如果遇到冲突，Git 会要求你手动解决冲突，并使用 git rebase --continue 继续操作。

#### 要将某个特定的提交（通过其哈希值识别）引入当前分支，可以使用以下命令：

```bash
git cherry-pick <commit_hash>
```

## VSCode

### 常用快捷键

| 功能         | Windows      | Mac         |
| ------------ | ------------ | ----------- |
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 查找文件     | Ctrl+P       | Cmd+P       |
| 多光标编辑   | Alt+Click    | Opt+Click   |

## Docker

### 常用命令

```bash
# 构建镜像
docker build -t image-name .

# 运行容器
docker run -p 8080:80 image-name

# 查看运行中的容器
docker ps
```

## tmux

### 常用命令

```bash
# 下载
apt-get install tmux
# 创建
tmux; tmux new -s xxx
# 使用
tmux attach -t xx
# 查看列表
tmux ls
# 清理
tmux kill-server         # 清理全部
tmux kill-session -t xx  # 清理某个终端
exit                     # 在某个终端中关闭它
```
