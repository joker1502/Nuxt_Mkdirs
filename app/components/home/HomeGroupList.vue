<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { cn } from '~/utils';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface GroupItem {
  _id: string;
  name: string;
  slug: string;
  categories?: CategoryItem[];
}

interface Props {
  groups?: GroupItem[];
  categories?: CategoryItem[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/',
});

const route = useRoute();

const selectedCategory = computed(() => (route.query.category as string) || '');
const openGroups = ref<Set<string>>(new Set());

const hasGroups = computed(() => props.groups && props.groups.length > 0);

watch(selectedCategory, (newVal) => {
  if (!newVal || !hasGroups.value) {
    openGroups.value = new Set();
    return;
  }
  const parentGroup = props.groups?.find(group => 
    group.categories?.some(cat => cat.slug === newVal)
  );
  if (parentGroup) {
    openGroups.value = new Set([parentGroup.slug]);
  }
}, { immediate: true });

function toggleGroup(slug: string) {
  const newSet = new Set<string>();
  if (!openGroups.value.has(slug)) {
    newSet.add(slug);
  }
  openGroups.value = newSet;
}

function categoryQuery(slug?: string) {
  const q = { ...route.query };
  if (slug) { q.category = slug; delete q.page; return q }
  delete q.category; delete q.page; return q
}

function isAllSelected() {
  return !selectedCategory.value;
}
</script>

<template>
  <div class="hidden md:flex border rounded-lg p-4">
    <ul class="flex flex-col gap-y-2 w-full">
      <li>
        <NuxtLink :to="{ path: urlPrefix, query: categoryQuery() }" :class="cn(
          'block w-full px-3 py-3 rounded-md text-sm font-medium transition-colors',
          isAllSelected() ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        )">
          All Categories
        </NuxtLink>
      </li>

      <template v-if="hasGroups">
        <li v-for="group in groups" :key="group._id" class="w-full space-y-2">
          <button
            class="w-full px-3 py-3 rounded-md text-sm font-medium text-left transition-colors hover:bg-muted flex items-center justify-between"
            @click="toggleGroup(group.slug)"
          >
            <span>{{ group.name }}</span>
            <ChevronDown v-if="group.categories && group.categories.length > 0"
              :class="cn('h-4 w-4 transition-transform duration-200', openGroups.has(group.slug) && 'rotate-180')"
            />
          </button>
          <div v-if="group.categories && group.categories.length > 0 && openGroups.has(group.slug)" class="space-y-1">
            <NuxtLink v-for="category in group.categories" :key="category._id"
              :to="{ path: urlPrefix, query: categoryQuery(category.slug) }"
              :class="cn('block w-full px-3 py-3 rounded-md text-sm font-medium transition-colors',
                selectedCategory === category.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )">
              {{ category.name }}
            </NuxtLink>
          </div>
        </li>
      </template>

      <template v-else-if="categories && categories.length > 0">
        <li v-for="category in categories" :key="category._id">
          <NuxtLink :to="{ path: urlPrefix, query: categoryQuery(category.slug) }"
            :class="cn('block w-full px-3 py-3 rounded-md text-sm font-medium transition-colors',
              selectedCategory === category.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )">
            {{ category.name }}
          </NuxtLink>
        </li>
      </template>
    </ul>
  </div>
</template>
