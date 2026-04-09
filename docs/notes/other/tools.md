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
```

### 配置别名

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"
```

## VSCode

### 常用快捷键

| 功能 | Windows | Mac |
|------|---------|-----|
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 查找文件 | Ctrl+P | Cmd+P |
| 多光标编辑 | Alt+Click | Opt+Click |

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
