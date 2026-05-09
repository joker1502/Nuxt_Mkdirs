<script setup lang="ts">
import { cn } from '~/utils';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: BlogCategory[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/blog',
});

const route = useRoute();

// Get current slug from route - handle both /blog/category/[slug] and /blog
const currentSlug = computed(() => {
  const path = route.path;
  if (path.includes('/blog/category/')) {
    return route.params.slug as string;
  }
  return '';
});
</script>

<template>
  <div>
    <!-- Desktop View -->
    <LayoutContainer class="hidden md:block">
      <div class="flex items-center justify-between gap-8">
        <!-- Category List with horizontal scroll -->
        <div class="flex-1 overflow-x-auto pb-2">
          <ul class="flex gap-x-2">
            <li>
              <NuxtLink :to="urlPrefix">
                <UiButton
                  :variant="!currentSlug ? 'default' : 'outline'"
                  size="sm"
                  class="px-3 py-3 shrink-0"
                >
                  All
                </UiButton>
              </NuxtLink>
            </li>
            <li v-for="category in categories" :key="category._id">
              <NuxtLink :to="`${urlPrefix}/category/${category.slug}`">
                <UiButton
                  :variant="currentSlug === category.slug ? 'default' : 'outline'"
                  size="sm"
                  class="px-3 py-3 shrink-0"
                >
                  {{ category.name }}
                </UiButton>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </LayoutContainer>

    <!-- Mobile View -->
    <div class="md:hidden flex flex-col gap-4 px-4">
      <!-- Category Scroll -->
      <div class="overflow-x-auto pb-2">
        <ul class="flex gap-x-2">
          <li>
            <NuxtLink :to="urlPrefix">
              <UiButton
                :variant="!currentSlug ? 'default' : 'outline'"
                size="sm"
                class="px-3 py-3"
              >
                All
              </UiButton>
            </NuxtLink>
          </li>
          <li v-for="category in categories" :key="category._id">
            <NuxtLink :to="`${urlPrefix}/category/${category.slug}`">
              <UiButton
                :variant="currentSlug === category.slug ? 'default' : 'outline'"
                size="sm"
                class="px-3 py-3"
              >
                {{ category.name }}
              </UiButton>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
