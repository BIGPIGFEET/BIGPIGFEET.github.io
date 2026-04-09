import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: '个人主页',
  description: '个人主页与学习笔记',

  themeConfig: {
    // 顶部导航
    nav: [
      { text: '个人主页', link: '/' },
      { text: '个人简介', link: '/about' },
      { text: '笔记', link: '/notes/' }
    ],

    // 笔记侧边栏
    sidebar: {
      '/notes/': [
        {
          text: '笔记',
          items: [
            {
              text: '大模型学习笔记',
              collapsed: false,
              items: [
                { text: 'Attention Is All You Need', link: '/notes/llm/attention' },
                { text: 'GPT 系列', link: '/notes/llm/gpt' }
              ]
            },
            {
              text: 'CV 学习笔记',
              collapsed: false,
              items: [
                { text: 'ResNet', link: '/notes/cv/resnet' },
                { text: 'YOLO', link: '/notes/cv/yolo' }
              ]
            },
            {
              text: '其他笔记',
              collapsed: false,
              items: [
                { text: '工具使用', link: '/notes/other/tools' }
              ]
            }
          ]
        }
      ]
    },

    // 搜索
    search: {
      provider: 'local'
    }
  }
})
