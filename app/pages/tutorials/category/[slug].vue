<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Fetch blog categories from Sanity
const { data: categoriesData } = await useFetch('/api/blog/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
  }));
});

const currentCategory = computed(() => 
  categories.value.find((c: any) => c.slug === slug.value)
);

// Reactive query params
const postsQuery = computed(() => ({
  limit: 8,
  category: slug.value,
  page: route.query.page || undefined,
}));

// Fetch blog posts from Sanity
const { data: postsData } = await useFetch('/api/blog', {
  query: postsQuery,
  watch: [postsQuery],
});

const posts = computed(() => {
  if (!postsData.value?.posts) return [];
  return postsData.value.posts.map((post: any) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug?.current || post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage ? getSanityImageUrl(post.coverImage, { width: 800 }) : '',
    publishedAt: post.publishDate,
    author: post.author?.name || '',
    categories: post.categories?.map((c: any) => c.name) || [],
  }));
});

const totalPages = computed(() => postsData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: () => `${currentCategory.value?.name || 'Category'} - Tutorials | Top AI Skills`,
  description: () => `Read tutorials about ${currentCategory.value?.name || 'this category'} on Top AI Skills.`,
  ogTitle: () => `${currentCategory.value?.name || 'Category'} - Tutorials | Top AI Skills`,
  ogDescription: () => `Read tutorials about ${currentCategory.value?.name || 'this category'} on Top AI Skills.`,
  keywords: () => currentCategory.value?.name
    ? `${currentCategory.value.name}, AI skills tutorials, ${currentCategory.value.name} guide`
    : 'AI skills tutorials, AI tools tutorials',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhirentegong',
  twitterCreator: '@zhirentegong',
  twitterImage: 'https://topaiskills.com/logo.png',
  robots: 'index, follow',
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8 w-full flex flex-col items-center justify-center gap-8">
      <SharedHeaderSection
        label="Tutorial"
        :title="currentCategory?.name || 'Browse our AI tutorials'"
      />

      <!-- Blog Category Filter -->
      <BlogFilter :categories="categories" />
    </div>

    <!-- Blog Grid -->
    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="posts.length === 0" />

      <template v-else>
        <BlogGrid :posts="posts" />

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination :route-prefix="`/tutorials/category/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>

    <!-- Newsletter -->
    <LayoutContainer class="mt-8">
      <HomeNewsletter />
    </LayoutContainer>
  </div>
</template>
