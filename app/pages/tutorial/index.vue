
<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();

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

// Reactive query params
const postsQuery = computed(() => ({
  limit: 8,
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
    coverImage: post.image ? getSanityImageUrl(post.image, { width: 800 }) : '',
    publishedAt: post.publishDate,
    author: post.author?.name || '',
    categories: post.categories?.map((c: any) => c.name) || [],
  }));
});

const totalPages = computed(() => postsData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: 'AI Skills Tutorials | Top AI Skills',
  description: 'Learn AI skills with step-by-step tutorials. From beginner to advanced — master AI tools through hands-on guides and practical examples.',
  ogTitle: 'AI Skills Tutorials | Top AI Skills',
  ogDescription: 'Learn AI skills with step-by-step tutorials. From beginner to advanced — master AI tools through hands-on guides and practical examples.',
  keywords: 'AI skills tutorials, learn AI skills, AI tools tutorials, AI tutorials for beginners, AI skills guide, how to use AI tools',
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
        label="Tutorials"
        title="Learn AI skills with step-by-step tutorials"
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
          <SharedPagination route-prefix="/tutorial" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>

    <!-- Newsletter -->
    <LayoutContainer class="mt-8">
      <HomeNewsletter />
    </LayoutContainer>
  </div>
</template>

