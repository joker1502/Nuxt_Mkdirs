import type { SiteConfig } from '~/types';

/**
 * ============================================
 * SITE CONFIGURATION
 * ============================================
 * 
 * This is the main configuration file for your directory website.
 * Update these values to customize your site's SEO, branding, and metadata.
 * 
 * After modifying this file, restart the dev server to see changes.
 */

// Your site's base URL (update this for production)
const SITE_URL = process.env.NUXT_PUBLIC_APP_URL || 'https://topaiskills.com';

export const siteConfig: SiteConfig = {
  // ============================================
  // BASIC SITE INFO
  // ============================================
  
  // Site name - appears in browser tab, SEO, and navigation
  name: "Top AI Skills",
  
  // Short tagline - used in hero sections and meta descriptions
  tagline: "Curated directory of the best AI agents, AI tools, and AI skills. Expert-reviewed and updated regularly to help developers and creators discover top AI resources.",

  // Full description - used for SEO meta description
  description:
    "Discover and compare the best AI skills, AI agents, and AI tools. Top AI Skills curates AI writing skills, AI coding skills, AI image generation, and more — all in one place.",
  
  // SEO keywords - helps search engines understand your content
  keywords: [
    "AI Tools",
    "AI Directory",
    "AI Skills",
    "AI Agents",
    "Top AI",
    "AI Reviews",
    "AI Software",
    "Best AI Tools",
  ],
  
  // Author name - appears in meta tags
  author: "Top AI Skills",
  
  // Site URL - used for canonical URLs and Open Graph
  url: SITE_URL,
  
  // ============================================
  // BRANDING
  // ============================================
  
  // Logo path (relative to /public folder)
  logo: "/logo.png",
  
  // Dark mode logo (optional) - uncomment if you have a dark version
  // logoDark: "/logo-dark.png",
  
  // Default Open Graph image (1200x630 recommended)
  image: `${SITE_URL}/og.png?v=1`,
  
  // ============================================
  // CONTACT
  // ============================================
  
  // Contact email
  mail: "hello@topaiskills.com",
  
  // ============================================
  // UTM TRACKING
  // ============================================
  
  utm: {
    source: "topaiskills.com",
    medium: "referral",
    campaign: "navigation",
  },
  
  // ============================================
  // SOCIAL LINKS
  // ============================================
  
  links: {
    twitter: "https://x.com/zhirentegong",
    github: "https://github.com",
    // youtube: "https://youtube.com/@your-channel",
  },
  
  // ============================================
  // SEO CONFIGURATION
  // ============================================
  
  seo: {
    // Title template - %s will be replaced with page title
    // Example: "Home | Top AI Skills"
    titleTemplate: "%s | Top AI Skills",
    titleSeparator: " | ",
    
    // Open Graph settings
    ogType: "website",
    ogLocale: "en_US",
    
    // Twitter Card settings
    twitterCard: "summary_large_image",
    twitterSite: "@zhirentegong", // Your Twitter handle
    twitterCreator: "@zhirentegong",
    
    // Search Console verification (optional)
    // Get these from Google/Bing Search Console
    // googleSiteVerification: "your-google-verification-code",
    // bingSiteVerification: "your-bing-verification-code",
    
    // Robots settings
    robots: {
      index: true, // Allow search engines to index
      follow: true, // Allow search engines to follow links
    },
    
    // Language code
    language: "en",
    
    // Canonical URL (usually same as site URL)
    canonicalUrl: SITE_URL,
  },
};
