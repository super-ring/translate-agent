# Translate Agent

![GitHub stars](https://img.shields.io/github/stars/super-ring/translate-agent)
![GitHub forks](https://img.shields.io/github/forks/super-ring/translate-agent)
![GitHub pull requests](https://img.shields.io/github/issues-pr/super-ring/translate-agent)

基于大模型的智能翻译浏览器插件，支持英中互译、词典查询和长文档翻译。

## 功能

- **智能识别**：自动判断输入语言，中文翻译成英文，英文句子翻译成中文，英文单词进入词典模式
- **流式输出**：翻译结果实时流式显示，支持 Markdown 渲染和纯文本切换
- **长文档翻译**：逐句翻译，保留 Markdown 格式、代码块、链接等原始结构
- **专有名词处理**：自动识别人名、地名、品牌名、技术术语等，保留原文不翻译
- **可自定义 Skill**：支持自定义翻译 System Prompt，灵活调整翻译行为
- **数据本地存储**：所有配置和数据仅存储在浏览器本地，不会上传到任何服务器

## 技术栈

- React 19 + TypeScript
- Tailwind CSS v4
- Vite 8
- Chrome Extension Manifest V3
- OpenAI 兼容 API（流式）

## 使用方式

### 开发

```bash
pnpm install
pnpm dev
```

### 构建插件

```bash
pnpm build
```

构建产物在 `dist/` 目录下。

### 安装到 Chrome

1. 打开 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist/` 目录

### 配置

首次使用需在「API 设置」中配置：

- **API Base URL**：OpenAI 兼容接口地址（如 `https://api.openai.com`）
- **API Key**：接口密钥
- **模型名称**：要使用的模型（如 `gpt-4o-mini`）

## 项目结构

```
src/
  App.tsx                # 主应用，Tab 导航
  components/
    TranslatePanel.tsx   # 翻译模块
    ApiSettings.tsx      # API 设置
    TranslateSettings.tsx # 翻译 Skill 设置
    MarkdownRenderer.tsx # Markdown 渲染
  hooks/
    useStorage.ts        # 本地存储 Hook
  lib/
    api.ts               # OpenAI 兼容流式 API
    constants.ts         # 默认 Skill、存储 Key
    storage.ts           # chrome.storage / localStorage 封装
```
