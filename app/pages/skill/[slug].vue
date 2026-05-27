<script setup lang="ts">
import { Globe, Hash, LayoutGrid, ArrowLeft } from 'lucide-vue-next';
import { getSanityImageUrl, getSanityIconUrl } from '~/utils/sanity-image';
import { markdownToHtml } from '~/utils/markdown';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Fetch item from API
const { data: item, error } = await useFetch(`/api/items/${slug.value}`);

// Format date
function formatDate(dateString: string | undefined) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get image URL
const imageUrl = computed(() => {
  if (!item.value?.image) return '';
  return getSanityImageUrl(item.value.image, { width: 800 });
});

// Get icon URL
const iconUrl = computed(() => {
  if (!item.value?.icon) return '';
  return getSanityIconUrl(item.value.icon, 32);
});

// Get website hostname
const websiteHostname = computed(() => {
  if (!item.value?.link) return '';
  try {
    return new URL(item.value.link).hostname;
  } catch {
    return item.value.link;
  }
});

// Get item link (affiliate or regular)
const itemLink = computed(() => {
  return item.value?.affiliateLink || item.value?.link || '#';
});

// Related items
const relatedItems = computed(() => item.value?.related || []);

// Generate keywords from item data
const keywords = computed(() => {
  if (!item.value) return 'AI skills, AI tools';
  const parts = [item.value.name];
  if (item.value.categories?.length) {
    parts.push(...item.value.categories.map((c: any) => c.name));
  }
  if (item.value.tags?.length) {
    parts.push(...item.value.tags.map((t: any) => t.name));
  }
  return [...new Set(parts)].join(', ');
});

useSeoMeta({
  title: () => item.value?.name ? `${item.value.name} | Top AI Skills` : 'AI Skill | Top AI Skills',
  description: () => item.value?.description || 'View this AI skill and learn more.',
  ogTitle: () => item.value?.name ? `${item.value.name} | Top AI Skills` : 'AI Skill | Top AI Skills',
  ogDescription: () => item.value?.description || 'View this AI skill and learn more.',
  ogImage: () => imageUrl.value || 'https://topaiskills.com/logo.png',
  ogUrl: () => `https://topaiskills.com/skill/${slug.value}`,
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

// JSON-LD structured data
const breadcrumbItems = computed(() => {
  const items = [{ name: 'Home', url: 'https://topaiskills.com/' }];
  if (item.value?.categories?.[0]) {
    items.push({
      name: item.value.categories[0].name,
      url: `https://topaiskills.com/categories/${item.value.categories[0].slug?.current}`,
    });
  }
  items.push({ name: item.value?.name || '', url: `https://topaiskills.com/skill/${slug.value}` });
  return items;
});

if (item.value) {
  useBreadcrumbSchema(breadcrumbItems.value);
  useItemSchema({
    name: item.value.name || '',
    description: item.value.description,
    image: imageUrl.value,
    url: `https://topaiskills.com/skill/${slug.value}`,
    category: item.value.categories?.[0]?.name,
  });
}
</script>

<template>
  <LayoutContainer class="py-8">
    <div v-if="item" class="flex flex-col gap-8">
      <!-- Header section -->
      <div class="grid grid-cols-1 gap-8">
        <!-- Left column -->
        <div class="gap-8 flex flex-col">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-muted-foreground">
            <NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink>
            <span>/</span>
            <NuxtLink 
              v-if="item.categories?.[0]" 
              :to="`/categories/${item.categories[0].slug?.current}`"
              class="hover:text-foreground"
            >
              {{ item.categories[0].name }}
            </NuxtLink>
            <span v-if="item.categories?.[0]">/</span>
            <span class="text-foreground">{{ item.name }}</span>
          </nav>

          <!-- Icon + Name + Description -->
          <div class="flex flex-1 items-center">
            <div class="flex flex-col gap-8">
              <div class="flex w-full items-center gap-4">
                <img
                  v-if="iconUrl"
                  :src="iconUrl"
                  :alt="`icon of ${item.name}`"
                  class="w-8 h-8 object-cover"
                />
                <h1
                  :class="[
                    'text-4xl tracking-wider font-bold flex items-center gap-2',
                    item.featured && 'text-gradient_indigo-purple font-semibold'
                  ]"
                >
                  {{ item.name }}
                </h1>
              </div>
              <p class="text-muted-foreground text-balance leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-4">
            <a :href="itemLink" target="_blank" rel="nofollow noopener noreferrer">
              <UiButton size="lg" class="group flex items-center gap-2">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                <span>View on GitHub</span>
              </UiButton>
            </a>
          </div>
        </div>
      </div>

      <!-- Content section -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Left column - Introduction -->
        <div class="lg:col-span-3 flex flex-col">
          <div v-if="item.introduction" class="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
            <h2 class="text-lg font-semibold mb-4">Introduction</h2>
            <div class="prose prose-sm dark:prose-invert max-w-none">
              <SanityPortableText v-if="Array.isArray(item.introduction)" :blocks="item.introduction" />
              <div v-else v-html="markdownToHtml(item.introduction)" class="space-y-4"></div>
            </div>
          </div>

          <div class="flex items-center justify-start mt-16">
            <UiButton variant="outline" @click="$router.back()">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back
            </UiButton>
          </div>
        </div>

        <!-- Right column - Info cards -->
        <div class="lg:col-span-2">
          <div class="flex flex-col space-y-4">
            <!-- Information -->
            <div class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Information</h2>
              <ul class="space-y-4 text-sm">
                <li v-if="item.submitter" class="flex justify-between">
                  <span class="text-muted-foreground">Publisher</span>
                  <span class="font-medium">{{ item.submitter.name }}</span>
                </li>
                <li class="flex justify-between space-x-4">
                  <span class="text-muted-foreground">Website</span>
                  <a
                    :href="itemLink"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    class="font-medium link-underline line-clamp-1"
                  >
                    {{ websiteHostname }}
                  </a>
                </li>
                <li class="flex justify-between">
                  <span class="text-muted-foreground">Published date</span>
                  <span class="font-medium">{{ formatDate(item.publishDate || item._createdAt) }}</span>
                </li>
              </ul>
            </div>

            <!-- Categories -->
            <div v-if="item.categories?.length" class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Categories</h2>
              <ul class="flex flex-wrap gap-4">
                <li v-for="category in item.categories" :key="category._id">
                  <NuxtLink
                    :to="`/categories/${category.slug?.current}`"
                    class="text-sm link-underline"
                  >
                    {{ category.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div v-if="item.tags?.length" class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Tags</h2>
              <ul class="flex flex-wrap gap-4">
                <li v-for="tag in item.tags" :key="tag._id">
                  <NuxtLink
                    :to="`/tags/${tag.slug?.current || tag.slug}`"
                    class="text-sm link-underline flex items-center justify-center space-x-0.5 group"
                  >
                    <Hash class="w-3 h-3 text-muted-foreground icon-scale" />
                    <span>{{ tag.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Related items -->
      <div v-if="relatedItems.length > 0" class="flex flex-col gap-4 mt-8">
        <div class="flex items-center gap-2">
          <LayoutGrid class="w-4 h-4 text-indigo-500" />
          <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
            More Products
          </h2>
        </div>
        <div class="mt-4">
          <ItemGrid :items="relatedItems" />
        </div>
      </div>
    </div>

    <!-- Not found -->
    <SharedEmptyState
      v-else-if="error"
      title="Item not found"
      description="The item you're looking for doesn't exist."
    >
      <NuxtLink to="/" class="mt-4">
        <UiButton>Browse all items</UiButton>
      </NuxtLink>
    </SharedEmptyState>
  </LayoutContainer>
</template>
