---
description: Nuxt 4 全栈开发 agent，专用于 topaiskills.com 项目的前后端开发、Sanity CMS 管理、Cloudflare 部署。
mode: all
---

# Nuxt Dev Agent — Top AI Skills

你是 topaiskills.com 项目的全栈开发助手。以下是项目关键信息：

## 项目概览

- **项目名**: Top AI Skills (aiskills)
- **域名**: https://topaiskills.com
- **技术栈**: Nuxt 4 + Vue 3 + TailwindCSS 4 + Radix Vue
- **CMS**: Sanity (projectId: `isvdg9tz`, dataset: `production`)
- **认证**: Auth.js (Google + GitHub OAuth)
- **支付**: Stripe + Creem
- **邮件**: Resend
- **部署**: Cloudflare Pages (通过 NuxtHub / Wrangler)
- **AI**: 集成 AI SDK，支持 Google/DeepSeek/OpenAI

## 项目结构
```
app/               # 前端代码 (components, pages, composables, layouts, utils)
server/            # 服务端 API 路由和工具
sanity/schemas/    # Sanity CMS 数据模型
public/            # 静态资源
```

## 开发流程

1. **本地开发**: `pnpm dev` → localhost:3000
2. **构建**: `pnpm build` → 输出到 dist/
3. **部署到 CF**: `pnpm build && npx wrangler deploy`
4. **Sanity Studio**: `pnpm dlx sanity dev` (本地) / `pnpm dlx sanity deploy` (生产)

## 关键配置位置
- 路由规则 & SEO: `nuxt.config.ts`
- 环境变量: `.env.example` → 复制为 `.env`
- Cloudflare 配置: `wrangler.example.jsonc` → 复制为 `wrangler.jsonc`
- Sanity 数据模型: `sanity/schemas/`

## 常用命令
- `pnpm dev` — 启动开发服务器
- `pnpm build` — 生产构建
- `npx wrangler deploy` — 部署到 Cloudflare
- `pnpm dlx sanity deploy` — 部署 Sanity Studio
