// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-12',
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },

  // ============================================================
  // 1. DEPLOYMENT — Cloudflare Pages + Hybrid Rendering
  // ============================================================
  nitro: {
    preset: 'cloudflare_pages',

    // Pre-render static public pages at BUILD TIME
    // These become pure HTML — zero SSR overhead, max SEO
    prerender: {
      crawlLinks: true, // Follow links from pre-rendered pages
      failOnError: false, // Don't fail build if some routes error (they fallback to SSR)
      routes: [
        '/about',
        '/pricing',
        '/privacy',
        '/terms',
        '/search',
        '/tags',
        '/tutorials',
      ],
    },

    // Gzip static assets
    compressPublicAssets: true,
  },

  // ============================================================
  // 2. ROUTE RULES — SSG vs SSR 分界线
  // ============================================================
  // 公开页面 → SSG (build time) 或 SSR + CDN cache
  // 私有页面 → 纯 SSR (no cache)
  routeRules: {
    // -- 动态内容页：SSR + SWR 缓存 (CDN 缓存 10-60 分钟) --
    // 这些页面内容变化不频繁，SWR 大幅减少 Functions 调用
    '/':               { swr: 600  },  // 10min — 首页 (动态内容,不预渲染)
    '/skills':         { swr: 600  },  // 10min — 技能列表首页
    '/skills/**':      { swr: 600  },  // 10min — 技能详情+分类页
    '/blog/**':         { swr: 3600 },  // 60min — 博客文章
    '/categories':      { redirect: '/skills' },
    '/categories/**':   { redirect: '/skills' },
    '/skill':           { redirect: '/skills' },
    '/skill/**':        { redirect: '/skills' },
    '/tags':            { swr: 600  },  // 10min — 标签列表首页
    '/tags/**':         { swr: 600  },  // 10min — 标签详情页
    '/tutorials':      { swr: 3600 },  // 60min — 教程首页
    '/tutorials/**':   { swr: 3600 },  // 60min — 教程详情+分类
    '/tutorial':       { redirect: '/tutorials' },
    '/tutorial/**':    { redirect: '/tutorials' },
    '/collection/**':   { swr: 600  },  // 10min — 集合

    // -- API 路由：不缓存 (数据实时性要求) --
    '/blog':          { redirect: '/tutorials' },
    '/blog/**':       { redirect: '/tutorials' },

    '/api/**': {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },

    // -- 私有/交互页面：纯 SSR，绝不缓存 --
    '/auth/**':      { ssr: true },
    '/dashboard/**': { ssr: true },
    '/settings/**':  { ssr: true },
    '/payment/**':   { ssr: true },
    '/publish/**':   { ssr: true },
    '/submit/**':    { ssr: true },
    '/studio/**':    { ssr: true },
  },

  modules: [
    '@nuxthub/core',
    '@nuxtjs/color-mode',
    '@nuxtjs/sanity',
    '@nuxtjs/sitemap',
    '@nuxt/fonts',
    'nuxt-gtag',
  ],

  // Google Analytics
  gtag: {
    enabled: true,
  },

  // Sitemap
  sitemap: {
    exclude: [
      '/dashboard/**',
      '/studio/**',
      '/auth/**',
      '/settings/**',
      '/payment/**',
      '/publish/**',
      '/collection',
      '/collection/**',
    ],
    siteUrl: 'https://topaiskills.com',
    discoverImages: true,
    sources: ['/api/__sitemap__/urls'],
    autoLastmod: true,
  },

  hub: {},

  // ============================================================
  // 3. FONTS — Self-Hosted (消除 Google Fonts CDN 外部依赖)
  // ============================================================
  // @nuxt/fonts downloads Google Fonts during build and serves them locally
  // Eliminates external DNS + connection to fonts.googleapis.com (LCP -300ms)
  fonts: {
    families: [
      { name: 'Bricolage Grotesque', provider: 'google' },
      { name: 'Inter', provider: 'google' },
    ],
  },

  // ============================================================
  // 4. SANITY — CDN ENABLED (最大性能提升)
  // ============================================================
  // useCdn: false → 每次请求都打 Sanity Live API (~200ms)
  // useCdn: true  → 走 Sanity CDN (~5ms, 60s TTL)
  // 对目录站来说 60s 延迟完全可接受
  // API version 与 sanity/lib/api.ts 保持一致 (2024-08-01)
  sanity: {
    useCdn: true,
    projectId: 'isvdg9tz',
    dataset: 'production',
    apiVersion: '2024-08-01',
    token: process.env.NUXT_SANITY_API_TOKEN,
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Runtime config
  runtimeConfig: {
    sanity: {
      token: '',
    },
    sanityApiToken: '',
    resendApiKey: '',
    resendEmailFrom: 'onboarding@resend.dev',
    resendEmailAdmin: '',
    resendAudienceId: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    creemApiKey: '',
    creemWebhookSecret: '',
    creemTestMode: false,
    authSecret: '',
    authGoogleClientId: '',
    authGoogleClientSecret: '',
    authGithubClientId: '',
    authGithubClientSecret: '',
    googleAiApiKey: '',
    deepseekApiKey: '',
    openaiApiKey: '',
    aiProvider: 'google',

    public: {
      appUrl: 'http://localhost:3000',
      sanityProjectId: '',
      sanityDataset: 'production',
      stripePublishableKey: '',
      stripeProPriceId: '',
      stripeSponsorPriceId: '',
      creemProProductId: '',
      creemSponsorProductId: '',
      googleAnalyticsId: '',
      supportCategoryGroup: true,
      supportItemIcon: true,
      supportAiSubmit: true,
      itemsPerPage: 12,
    },
  },

  // ============================================================
  // 5. APP HEAD — SEO + Fonts (self-hosted via @nuxt/fonts)
  // ============================================================
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Top AI Skills - Best AI Skills Directory & Resources',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover and compare the best AI skills, AI agents, and AI tools. Top AI Skills curates AI writing skills, AI coding skills, AI image generation, and more — all in one place.' },
        { name: 'keywords', content: 'Top AI Skills, AI Skills, Best AI Skills, AI tools, AI directory' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Top AI Skills' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: 'https://topaiskills.com/logo.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@zhirentegong' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
