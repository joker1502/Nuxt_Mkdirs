// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

// Trigger rebuild for config changes - TS installed
export default defineNuxtConfig({
  compatibilityDate: '2025-12-12',
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },

  // Cloudflare Workers configuration for NuxtHub v0.10
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  
  modules: [
    '@nuxthub/core',
    '@nuxtjs/color-mode',
    '@nuxtjs/sanity',
    '@nuxtjs/sitemap',
    'nuxt-gtag',
  ],

  // Google Analytics 配置
  gtag: {
    enabled: true,
  },

  // Sitemap configuration
  // https://nuxtseo.com/sitemap/getting-started/installation
  sitemap: {
    // Exclude admin/dashboard routes from sitemap
    exclude: [
      '/dashboard/**',
      '/studio/**',
      '/auth/**',
    ],
  },

  hub: {
    // NuxtHub configuration
    // https://hub.nuxt.com/docs/getting-started/deploy
  },

  // Sanity configuration
  // projectId and dataset are read from sanity.config.ts automatically
  sanity: {
    useCdn: false,
    projectId: 'isvdg9tz',
    dataset: 'production',
    apiToken: process.env.NUXT_SANITY_API_TOKEN || '',
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Runtime config for environment variables
  // Nuxt automatically maps NUXT_* env vars to runtimeConfig
  // https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    // Sanity config (used by @nuxtjs/sanity module)
    sanity: {
      token: '', // NUXT_SANITY_TOKEN
    },

    // Server-side only (private) - auto-mapped from NUXT_*
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

    // Client-side (public) - auto-mapped from NUXT_PUBLIC_*
    public: {
      appUrl: 'http://localhost:3000',
      sanityProjectId: 'isvdg9tz',
      sanityDataset: 'production',
      stripePublishableKey: '',
      stripeProPriceId: '',
      stripeSponsorPriceId: '',
      creemProProductId: '',
      creemSponsorProductId: '',
      googleAnalyticsId: '',
      // Feature flags (these need special handling for boolean/number)
      supportCategoryGroup: true,
      supportItemIcon: true,
      supportAiSubmit: true,
      itemsPerPage: 12,
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'AI Agent Directory - Discover the Best AI Agents',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '发现最好用的AI智能体工具。Discover and explore the best AI agents and tools.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
