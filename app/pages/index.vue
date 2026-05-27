<script setup lang="ts">
const route = useRoute();

// Reactive query params for items API
const itemsQuery = computed(() => ({
  limit: 12,
  q: route.query.q || undefined,
  category: route.query.category || undefined,
  tag: route.query.tag || undefined,
  sort: route.query.sort || undefined,
  f: route.query.f || undefined,
  page: route.query.page || undefined,
}));

// Fetch items from Sanity - reactive to URL changes
const { data: itemsData } = await useFetch('/api/items', {
  query: itemsQuery,
  watch: [itemsQuery],
});

const items = computed(() => {
  if (!itemsData.value?.items) return [];
  return itemsData.value.items.map((item: any) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug?.current || item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon,
    image: item.image,
    featured: item.featured,
    tags: item.tags?.map((t: any) => t.name) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

// Fetch groups from Sanity
const { data: groupsData } = await useFetch('/api/groups');

// Fetch categories from Sanity
const { data: categoriesData } = await useFetch('/api/categories');

// Groups (if available)
const groups = computed(() => {
  if (!groupsData.value || groupsData.value.length === 0) return [];
  return groupsData.value.map((group: any) => ({
    _id: group._id,
    name: group.name,
    slug: group.slug?.current || group.slug,
    categories: group.categories?.map((cat: any) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug?.current || cat.slug,
    })) || [],
  }));
});

// Categories (flat list)
const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
  }));
});

// Categories options for filter
const categoryOptions = computed(() => {
  return categories.value.map((cat: any) => ({
    value: cat.slug,
    label: cat.name,
  }));
});

// Fetch tags from Sanity
const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag.slug?.current || tag.slug,
    label: tag.name,
  }));
});

useSeoMeta({
  title: 'Top AI Skills - Best AI Skills Directory & Resources',
  description: 'Discover the best AI skills, tools, and resources. Top AI Skills curates AI coding skills, AI writing skills, AI image generation, and more — all in one place.',
  ogTitle: 'Top AI Skills - Best AI Skills Directory & Resources',
  ogDescription: 'Discover the best AI skills, tools, and resources. Top AI Skills curates AI coding skills, AI writing skills, AI image generation, and more — all in one place.',
  ogImage: 'https://topaiskills.com/logo.png',
  ogUrl: 'https://topaiskills.com',
  ogSiteName: 'Top AI Skills',
  ogLocale: 'en_US',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhirentegong',
  twitterCreator: '@zhirentegong',
  twitterImage: 'https://topaiskills.com/logo.png',
  keywords: 'Top AI Skills, AI Skills, Best AI Skills',
  robots: 'index, follow',
});

// JSON-LD structured data
useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://topaiskills.com/#website',
      name: 'Top AI Skills',
      url: 'https://topaiskills.com',
      description: 'Discover and compare the best AI skills, AI agents, and AI tools. Curated directory for developers and creators.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://topaiskills.com?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://topaiskills.com/#organization',
      name: 'Top AI Skills',
      url: 'https://topaiskills.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://topaiskills.com/logo.png',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@topaiskills.com',
        contactType: 'customer support',
      },
    },
  ],
});
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <!-- Hero -->
    <HomeHero />

    <!-- Main Content with Sidebar -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left sidebar: category/group list (desktop only) -->
      <div class="hidden md:block w-[250px] shrink-0">
        <div class="sticky top-24">
          <HomeGroupList :categories="categories" url-prefix="/" />
        </div>
      </div>

      <!-- Right content: filter + item grid -->
      <div class="flex-1 flex flex-col gap-8">
        <!-- Search Filter -->
        <HomeSearchFilter :tags="tags" :categories="categoryOptions" url-prefix="/" :show-date-picker="false" />

        <!-- Item Grid -->
        <SharedEmptyState v-if="items.length === 0" />
        
        <template v-else>
          <ItemGrid :items="items" />

          <!-- Pagination -->
          <div class="mt-8 flex items-center justify-center">
            <SharedPagination route-prefix="/" :total-pages="totalPages" />
          </div>
        </template>
      </div>
    </div>

    <!-- Newsletter -->
    <HomeNewsletter />
  </LayoutContainer>
</template>
