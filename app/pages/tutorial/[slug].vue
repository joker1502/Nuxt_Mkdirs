<script setup lang="ts">
import { ArrowLeft, FileText } from 'lucide-vue-next';
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Fetch blog post from Sanity
const { data: post, error } = await useFetch(() => `/api/blog/${slug.value}`);

// Computed values for template
const imageUrl = computed(() => {
  if (!post.value?.image) return '';
  return getSanityImageUrl(post.value.image, { width: 1200 });
});

const authorImageUrl = computed(() => {
  if (!post.value?.author?.image) return '';
  return getSanityImageUrl(post.value.author.image, { width: 96, height: 96 });
});

const publishDate = computed(() => {
  if (!post.value?.publishDate && !post.value?._createdAt) return '';
  const date = new Date(post.value.publishDate || post.value._createdAt);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const relatedPosts = computed(() => {
  if (!post.value?.relatedPosts) return [];
  return post.value.relatedPosts.map((p: any) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug?.current || p.slug,
    excerpt: p.excerpt,
    image: p.image ? getSanityImageUrl(p.image, { width: 800 }) : '',
    publishedAt: p.publishDate,
    author: p.author?.name || '',
    categories: p.categories?.map((c: any) => c.name) || [],
  }));
});

// Generate keywords from post data
const keywords = computed(() => {
  if (!post.value) return 'AI skills tutorials, AI tools guides';
  const parts = [post.value.title];
  if (post.value.categories?.length) {
    parts.push(...post.value.categories.map((c: any) => (typeof c === 'string' ? c : c.name)));
  }
  return [...new Set(parts)].join(', ');
});

useSeoMeta({
  title: () => `${post.value?.title || 'Tutorial'} | Top AI Skills`,
  description: () => post.value?.excerpt || 'Read this tutorial on Top AI Skills.',
  ogTitle: () => `${post.value?.title || 'Tutorial'} | Top AI Skills`,
  ogDescription: () => post.value?.excerpt || 'Read this tutorial on Top AI Skills.',
  ogImage: () => imageUrl.value || 'https://topaiskills.com/logo.png',
  ogUrl: () => `https://topaiskills.com/tutorial/${slug.value}`,
  ogSiteName: 'Top AI Skills',
  ogLocale: 'en_US',
  ogType: 'article',
  keywords: () => keywords.value,
  twitterCard: 'summary_large_image',
  twitterSite: '@zhirentegong',
  twitterCreator: '@zhirentegong',
  twitterImage: () => imageUrl.value || 'https://topaiskills.com/logo.png',
  robots: 'index, follow',
});

// Inject Article JSON-LD for EEAT (author + publisher)
onMounted(() => {
  if (!post.value) return;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://topaiskills.com/tutorial/${slug.value}#article`,
    headline: post.value.title,
    description: post.value.excerpt,
    image: imageUrl.value || 'https://topaiskills.com/logo.png',
    datePublished: post.value.publishDate || post.value._createdAt,
    dateModified: post.value._updatedAt || post.value.publishDate || post.value._createdAt,
    author: {
      '@type': 'Person',
      name: post.value.author?.name || 'Top AI Skills Team',
      url: 'https://topaiskills.com/about',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://topaiskills.com/#organization',
      name: 'Top AI Skills',
      logo: {
        '@type': 'ImageObject',
        url: 'https://topaiskills.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://topaiskills.com/tutorial/${slug.value}`,
    },
  };
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(articleSchema);
  document.head.appendChild(script);
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div v-if="post" class="flex flex-col gap-8">
        <!-- Content section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left column -->
          <div class="lg:col-span-2 flex flex-col">
            <!-- Basic information -->
            <div class="space-y-8">
              <!-- Breadcrumb -->
              <nav class="flex items-center gap-2 text-sm text-muted-foreground">
                <NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink>
                <span>/</span>
                <NuxtLink to="/tutorial" class="hover:text-foreground">Tutorials</NuxtLink>
                <template v-if="post.categories?.[0]">
                  <span>/</span>
                  <NuxtLink
                    :to="`/tutorial/category/${post.categories[0].slug?.current || post.categories[0].slug}`"
                    class="hover:text-foreground"
                  >
                    {{ post.categories[0].name }}
                  </NuxtLink>
                </template>
                <span>/</span>
                <span class="text-foreground">{{ post.title }}</span>
              </nav>

              <!-- Blog post image -->
              <div class="group overflow-hidden relative aspect-video rounded-lg transition-all border">
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  :alt="post.image?.alt || post.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Blog post title -->
              <h1 class="text-3xl font-bold">{{ post.title }}</h1>

              <!-- Blog post description -->
              <p class="text-lg text-muted-foreground">{{ post.excerpt }}</p>
            </div>

            <!-- Blog post content -->
            <div class="prose max-w-none mt-4">
              <SanityPortableText v-if="post.body" :blocks="post.body" />
            </div>

            <div class="flex items-center justify-start mt-16">
            <NuxtLink to="/tutorial">
                <UiButton variant="outline" class="gap-2">
                  <ArrowLeft class="size-4" />
                  All Posts
                </UiButton>
              </NuxtLink>
            </div>
          </div>

          <!-- Right column (sidebar) -->
          <div>
            <div class="space-y-4 lg:sticky lg:top-24">
              <!-- Author info -->
              <div class="bg-muted/50 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Publisher</h2>
                <div class="flex items-center gap-4">
                  <div class="relative h-12 w-12 shrink-0">
                    <img
                      v-if="authorImageUrl"
                      :src="authorImageUrl"
                      :alt="post.author?.name"
                      class="w-full h-full rounded-full object-cover border"
                    />
                    <div
                      v-else
                      class="w-full h-full rounded-full bg-muted flex items-center justify-center text-lg font-semibold"
                    >
                      {{ post.author?.name?.charAt(0) || '?' }}
                    </div>
                  </div>
                  <div>
                    <a
                      v-if="post.author?.link"
                      :href="post.author.link"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      class="font-medium link-underline"
                    >
                      {{ post.author.name }}
                    </a>
                    <span v-else class="font-medium">{{ post.author?.name }}</span>
                    <p class="text-sm text-muted-foreground">{{ publishDate }}</p>
                  </div>
                </div>
              </div>

              <!-- Categories -->
              <div v-if="post.categories?.length" class="bg-muted/50 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Categories</h2>
                <ul class="flex flex-wrap gap-4">
                  <li v-for="category in post.categories" :key="category._id">
                    <NuxtLink
                      :to="`/tutorial/category/${category.slug?.current || category.slug}`"
                      class="text-sm link-underline"
                    >
                      {{ category.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <!-- Tags -->
              <div v-if="post.tags?.length" class="bg-muted/50 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Tags</h2>
                <ul class="flex flex-wrap gap-2">
                  <li v-for="tag in post.tags" :key="tag._id">
                    <NuxtLink
                      :to="`/tags/${tag.slug?.current || tag.slug}`"
                      class="inline-block text-xs font-medium bg-background border rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {{ tag.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer section shows related posts -->
        <div v-if="relatedPosts.length > 0" class="flex flex-col gap-8 mt-8">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-indigo-500" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              More Posts
            </h2>
          </div>

          <BlogGrid :posts="relatedPosts" />
        </div>
      </div>

      <SharedEmptyState
        v-else
        title="Post not found"
        description="The tutorial you're looking for doesn't exist."
      >
        <NuxtLink to="/tutorial" class="mt-4">
          <UiButton>Browse all posts</UiButton>
        </NuxtLink>
      </SharedEmptyState>
    </LayoutContainer>
  </div>
</template>
