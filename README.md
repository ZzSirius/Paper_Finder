# 📄 Paper Finder - 论文查询器

基于关键词搜索学术论文的 AI 驱动 Web 应用，由 **React + Vite** 构建，通过 **Dify AI Workflow API** 提供智能论文检索能力。

## ✨ 功能特性

- 🔍 **关键词搜索**：输入学术关键词，快速返回相关论文
- 📋 **结构化展示**：清晰呈现论文标题、作者、发表时间和摘要
- ⚡ **极速响应**：基于 Vite 构建，HMR 热更新，开发体验流畅
- 🎨 **现代 UI**：紫蓝渐变背景 + 卡片式论文列表，响应式设计
- 🤖 **AI 驱动**：后端通过 Dify Workflow 编排 AI 能力，智能检索论文信息

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| [React 19](https://react.dev/) | 前端 UI 框架 |
| [Vite 8](https://vitejs.dev/) | 构建工具 |
| [Dify API](https://dify.ai/) | AI Workflow 后端服务 |
| Oxlint | 代码检查工具 |

## 📦 项目结构

```
Paper_Finder/
├── public/
│   ├── favicon.svg          # 网站图标
│   └── icons.svg            # 图标资源
├── src/
│   ├── assets/
│   │   ├── hero.png         # 首页图片
│   │   └── vite.svg         # Vite 图标
│   ├── services/
│   │   └── difyApi.js       # Dify API 调用服务
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 主样式文件
│   ├── main.jsx             # 应用入口
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── vite.config.js           # Vite 配置
├── package.json             # 项目依赖配置
└── README.md                # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/ZzSirius/Paper_Finder.git
cd Paper_Finder

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 配置 Dify API

编辑 `src/services/difyApi.js`，修改以下配置：

```js
const API_BASE = "https://api.dify.ai/v1";   // Dify API 地址
const API_KEY = "your-api-key-here";           // 你的 API Key
```

> ⚠️ **安全提醒**：请勿将真实 API Key 提交到公开仓库。建议使用 `.env` 环境变量管理敏感信息。

## 🔧 Dify Workflow 说明

本项目的核心搜索逻辑由 Dify Workflow 编排实现：

1. **输入**：用户输入的关键词（keyword）
2. **处理**：Workflow 调用 LLM / 搜索引擎等节点，检索并整理相关论文
3. **输出**：返回包含论文标题、作者、发表时间、摘要的结构化数据

Workflow 输出格式要求：

```
Title: 论文标题
Authors: 作者1, 作者2
Published: 2024
Summary: 论文摘要内容...
```

## 📸 界面截图

![论文查询器界面](screenshot.png)

## 📄 开源协议

MIT License

---

**Made with ❤️ by ZzSirius**
