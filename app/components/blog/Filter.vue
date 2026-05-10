<script setup lang="ts">
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
  urlPrefix: '/tutorial',
});

const route = useRoute();

const currentSlug = computed(() => {
  const path = route.path;
  if (path.includes('/tutorial/category/')) {
    return route.params.slug as string;
  }
  return '';
});
</script>

<template>
  <div>
    <!-- Desktop View -->
    <LayoutContainer class="hidden md:block">
      <div class="flex items-center justify-center">
        <div class="overflow-x-auto pb-2">
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
    <div class="md:hidden flex flex-col px-4">
      <div class="overflow-x-auto pb-2">
        <ul class="flex gap-x-2">
          <li>
            <NuxtLink :to="urlPrefix">
              <UiButton
                :variant="!currentSlug ? 'default' : 'outline'"
                size="sm"
                class="px-3 py-3 whitespace-nowrap"
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
                class="px-3 py-3 whitespace-nowrap"
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
