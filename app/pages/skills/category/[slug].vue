<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
    itemCount: 0,
  }));
});

const currentCategory = computed(() =>
  categories.value.find((c: any) => c.slug === slug.value)
);

const itemsQuery = computed(() => ({
  limit: 12,
  category: slug.value,
  page: route.query.page || undefined,
}));

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
    categories: item.categories?.map((c: any) => ({
      _id: c._id,
      name: c.name,
      slug: c.slug?.current || c.slug,
    })) || [],
  }));
});

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

const { data: sponsorItemData } = await useFetch('/api/items/sponsor');

const sponsorItem = computed(() => {
  if (!sponsorItemData.value) return null;
  const item = sponsorItemData.value;
  return {
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
  };
});

useSeoMeta({
  title: () => `${currentCategory.value?.name || 'Category'} - AI Skills | Top AI Skills`,
  description: () => currentCategory.value?.name
    ? `Browse the best ${currentCategory.value.name} AI tools and skills. Discover top resources.`
    : 'Browse AI tools and skills by category.',
  ogTitle: () => `${currentCategory.value?.name || 'Category'} - AI Skills | Top AI Skills`,
  ogDescription: () => currentCategory.value?.name
    ? `Browse the best ${currentCategory.value.name} AI tools and skills.`
    : 'Browse AI tools and skills by category.',
  ogImage: 'https://topaiskills.com/logo.png',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhirentegong',
  twitterCreator: '@zhirentegong',
  twitterImage: 'https://topaiskills.com/logo.png',
  robots: 'index, follow',
});
</script>

<template>
  <div class="mb-16">
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Skill"
          :title="currentCategory?.name || 'Explore AI skills'"
        />

        <div class="w-full">
          <CategoryFilter :categories="categories" url-prefix="/skills/category" />
        </div>
      </div>
    </div>

    <LayoutContainer class="mt-4">
      <SharedEmptyState v-if="items.length === 0" />

      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ItemCard v-for="item in items.slice(0, 2)" :key="item._id" :item="item" />
          <ItemSponsorItemCard v-if="sponsorItem" :item="sponsorItem" />
          <ItemCard v-for="item in items.slice(2)" :key="item._id" :item="item" />
        </div>

        <div class="mt-8 flex items-center justify-center">
          <SharedPagination :route-prefix="`/skills/category/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
