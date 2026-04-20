# Dev Cheat Sheet

开发者速查表 —— 快速查找常用命令与代码片段的"外脑系统"。

## 技术栈

- **构建工具**：Vite
- **样式**：TailwindCSS v4
- **搜索**：Fuse.js（模糊搜索）
- **部署**：Vercel / GitHub Pages

## 功能说明

- 卡片式速查表展示（支持展开/收起）
- 分类筛选（顶部 Tab 切换）
- 模糊搜索（标题、标签、内容、命令）
- 收藏功能（localStorage 持久化）
- 暗黑模式（跟随系统 / 手动切换）
- 快捷键：`/` 聚焦搜索、`Esc` 重置、`?` 帮助

## 本地运行

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build    # 输出到 dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
├── public/
│   ├── data/cheatsheets.json   # 速查表数据
│   └── favicon.svg
├── src/
│   ├── components/             # 卡片、分类、搜索组件
│   ├── utils/                  # 主题、收藏、快捷键、数据加载
│   ├── styles/main.css         # TailwindCSS 入口
│   └── main.js                 # 应用入口
├── index.html
├── vite.config.js
└── package.json
```

## 添加新的速查表

编辑 `public/data/cheatsheets.json`，按以下格式添加：

```json
{
  "id": "唯一ID",
  "title": "标题",
  "category": "分类名",
  "tags": ["标签1", "标签2"],
  "content": "简要描述",
  "items": [
    { "cmd": "命令/代码", "desc": "说明" }
  ]
}
```

## License

MIT
