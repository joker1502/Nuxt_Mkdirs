<script setup lang="ts">
import { Hash } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

const iconUrl = computed(() => {
  const ic = props.item.icon as any;
  if (!ic) return '';
  if (ic.url) return ic.url;
  if (ic.asset) return getSanityImageUrl(ic, { width: 64 });
  return '';
});

const coverUrl = computed(() => {
  const img = props.item.image as any;
  if (img?.asset) {
    return getSanityImageUrl(img, { width: 400 });
  }
  return '';
});
</script>

<template>
  <NuxtLink
    :to="`/skill/${typeof item.slug === 'string' ? item.slug : item.slug?.current || item.slug}`"
    :class="cn(
      'cursor-pointer border rounded-lg flex flex-col justify-between gap-3 overflow-hidden group',
      'hover:bg-accent/60 transition-colors duration-300'
    )"
  >
    <!-- Cover image -->
    <div v-if="coverUrl" class="aspect-video overflow-hidden">
      <img :src="coverUrl" :alt="item.name" class="w-full h-full object-cover image-scale" />
    </div>
    <div class="p-4 flex flex-col justify-between gap-3 flex-1">
      <div class="flex items-start gap-3">
        <div v-if="iconUrl" class="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
          <img :src="iconUrl" :alt="`${item.name} icon`" class="w-8 h-8 object-contain" />
        </div>
        <div v-else class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span class="text-lg font-bold text-muted-foreground/40">{{ item.name?.charAt(0)?.toUpperCase() || '?' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 :class="cn('text-lg font-medium truncate', item.featured && 'text-gradient_indigo-purple font-semibold')">
            <span class="flex items-center gap-1">
              <span class="truncate">{{ item.name }}</span>
            </span>
          </h3>
        </div>
      </div>
      <div class="flex flex-wrap gap-1">
        <div v-if="item.categories && item.categories.length > 0">
          <span v-for="category in item.categories.slice(0, 2)" :key="category._id" class="text-xs text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full">{{ category.name }}</span>
        </div>
        <span v-else-if="item.category" class="text-xs text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full">{{ item.category }}</span>
      </div>
      <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{{ item.description }}</p>
      <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 items-center pt-1">
        <NuxtLink v-for="(tag, index) in item.tags.slice(0, 3)" :key="index" :to="`/tags/${typeof tag === 'string' ? tag.toLowerCase().replace(/[\s/]+/g, '-') : (tag.slug?.current || tag.slug || tag.name?.toLowerCase().replace(/[\s/]+/g, '-'))}`" class="flex items-center gap-0.5 group/tag" @click.stop>
          <Hash class="w-3 h-3 text-muted-foreground icon-scale" />
          <span class="text-xs text-muted-foreground link-underline">{{ typeof tag === 'string' ? tag : tag.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </NuxtLink>
</template>
