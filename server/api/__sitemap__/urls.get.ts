import { serverQueryContent } from '@nuxtjs/sitemap/runtime/server'
import { defineSitemapEventHandler } from '#imports'
import { createClient } from '@sanity/client'

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const sanity = createClient({
    projectId: 'isvdg9tz',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: config.sanityApiToken || process.env.NUXT_SANITY_API_TOKEN,
  })

  const siteUrl = 'https://topaiskills.com'

  // Fetch all items (skills)
  const items = await sanity.fetch(`*[_type == "item" && defined(slug.current) && defined(publishDate) && forceHidden != true] { "slug": slug.current, _updatedAt }`)
  // Fetch all categories
  const categories = await sanity.fetch(`*[_type == "category" && defined(slug.current)] { "slug": slug.current, _updatedAt }`)
  // Fetch all tags
  const tags = await sanity.fetch(`*[_type == "tag" && defined(slug.current)] { "slug": slug.current, _updatedAt }`)
  // Fetch all blog posts
  const blogPosts = await sanity.fetch(`*[_type == "blogPost" && defined(slug.current) && defined(publishDate)] { "slug": slug.current, _updatedAt }`)
  // Fetch all blog categories
  const blogCategories = await sanity.fetch(`*[_type == "blogCategory" && defined(slug.current)] { "slug": slug.current, _updatedAt }`)

  const urls = [
    // Static pages
    { loc: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { loc: '/categories', changefreq: 'weekly', priority: 0.9 },
    { loc: '/tags', changefreq: 'weekly', priority: 0.7 },
    { loc: '/blog', changefreq: 'daily', priority: 0.8 },
    { loc: '/about', changefreq: 'monthly', priority: 0.3 },
    { loc: '/privacy', changefreq: 'monthly', priority: 0.1 },
    { loc: '/terms', changefreq: 'monthly', priority: 0.1 },

    // Dynamic items (skills)
    ...items.map((item: any) => ({
      loc: `/skill/${item.slug}`,
      lastmod: item._updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.8,
    })),

    // Dynamic categories
    ...categories.map((cat: any) => ({
      loc: `/categories/${cat.slug}`,
      lastmod: cat._updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),

    // Dynamic tags
    ...tags.map((tag: any) => ({
      loc: `/tags/${tag.slug}`,
      lastmod: tag._updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),

    // Dynamic blog posts
    ...blogPosts.map((post: any) => ({
      loc: `/blog/${post.slug}`,
      lastmod: post._updatedAt,
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),

    // Dynamic blog categories
    ...blogCategories.map((cat: any) => ({
      loc: `/blog/category/${cat.slug}`,
      lastmod: cat._updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.4,
    })),
  ]

  return urls
})
