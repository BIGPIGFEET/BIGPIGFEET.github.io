# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个使用 VitePress 构建的个人主页网站，同时托管学习笔记。

## 技术栈

- **框架**: VitePress
- **部署**: GitHub Pages (BIGPIGFEET.github.io)

## 项目结构

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress 配置
│   └── theme/
│       ├── index.ts      # 主题入口
│       └── custom.css     # 自定义样式（学术风浅蓝色）
├── index.md               # 首页
├── about.md               # 关于页面
├── notes/                 # 笔记目录
│   ├── index.md           # 笔记首页
│   ├── llm/              # 大模型笔记
│   ├── cv/               # CV笔记
│   └── other/            # 其他笔记
└── public/               # 静态资源
```

## 开发命令

```bash
npm run docs:dev    # 本地开发
npm run docs:build  # 构建生产版本
npm run docs:preview # 预览构建结果
```

## 注意事项

1. **头像**: 替换 `docs/public/avatar.png` 为你的头像图片
2. **个人介绍**: 编辑 `docs/about.md`
3. **添加笔记**: 在对应分类目录下创建 `.md` 文件
4. **导航配置**: 编辑 `docs/.vitepress/config.ts` 中的 nav 和 sidebar

## 部署

推送到 main 分支后，GitHub Actions 会自动部署到 GitHub Pages。

# currentDate
Todayʼs date is 2026/04/09.
