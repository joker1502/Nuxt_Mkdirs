<script setup lang="ts">
import { Hash } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get icon URL from Sanity image
const iconUrl = computed(() => {
  const icon = props.item.icon as any;
  if (icon?.asset) {
    return getSanityImageUrl(icon, { width: 64, height: 64 });
  }
  return typeof icon === 'string' ? icon : '';
});

// Get background image URL from Sanity image
const bgImageUrl = computed(() => {
  const image = props.item.image as any;
  if (image?.asset) {
    return getSanityImageUrl(image, { width: 800 });
  }
  return typeof image === 'string' ? image : '';
});
</script>

<template>
  <div
    :class="cn(
      'relative border rounded-lg flex flex-col justify-between overflow-hidden min-h-[280px]',
      'duration-300 shadow-sm hover:shadow-lg transition-all group',
      item.featured
        ? 'border-orange-300 border-spacing-1.5'
        : ''
    )"
  >
    <!-- Background Image -->
    <div
      v-if="bgImageUrl"
      class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      :style="{ backgroundImage: `url(${bgImageUrl})` }"
    />
    <!-- Subtle background layer (no gradient) -->
    <div
      :class="cn(
        'absolute inset-0 transition-opacity duration-300',
        bgImageUrl ? 'bg-card/30' : 'bg-card'
      )"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-between h-full p-6">
      <!-- Top section -->
      <div class="flex flex-col gap-3">
        <!-- Icon + Name -->
        <div class="flex w-full items-center gap-3">
          <!-- Show icon if available, otherwise show fallback with first letter -->
          <img
            v-if="iconUrl"
            :src="iconUrl"
            :alt="`icon of ${item.name}`"
            :title="`icon of ${item.name}`"
            class="w-8 h-8 object-cover image-scale rounded-md shrink-0 bg-white p-0.5"
          />
          <div
            v-else
            class="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0"
          >
            {{ item.name.charAt(0).toUpperCase() }}
          </div>

          <NuxtLink :to="`/skills/${item.slug}`" class="min-w-0 flex-1">
            <h3
              :class="cn(
                'text-xl font-semibold truncate overflow-hidden text-ellipsis',
                item.featured && 'text-gradient_indigo-purple'
              )"
            >
              {{ item.name }}
            </h3>
          </NuxtLink>
        </div>

        <!-- Categories -->
        <div class="flex flex-col gap-2">
          <div v-if="item.categories && item.categories.length > 0" class="flex flex-wrap gap-2 items-center">
            <NuxtLink
              v-for="category in item.categories"
              :key="category._id"
              :to="`/skills/category/${category.slug}`"
              :class="cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-2 py-1 h-6',
                bgImageUrl
                  ? 'bg-card/50 backdrop-blur-sm border border-border'
                  : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
              )"
            >
              <span class="text-sm">{{ category.name }}</span>
            </NuxtLink>
          </div>
          <div v-else-if="item.category" class="flex flex-wrap gap-2 items-center">
            <NuxtLink
              :to="`/skills/${item.category}`"
              :class="cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-2 py-1 h-6',
                bgImageUrl
                  ? 'bg-card/50 backdrop-blur-sm border border-border'
                  : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
              )"
            >
              <span class="text-sm">{{ item.category }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom section: Description + Tags -->
      <div class="mt-auto pt-4">
        <!-- Description -->
        <NuxtLink :to="`/skills/${item.slug}`" class="block cursor-pointer">
          <p
            :class="cn(
              'text-sm line-clamp-2 leading-relaxed',
              'text-muted-foreground'
            )"
          >
            {{ item.description }}
          </p>
        </NuxtLink>

        <!-- Tags -->
        <div v-if="item.tags && item.tags.length > 0" class="mt-3 flex flex-wrap gap-2 items-center">
          <NuxtLink
            v-for="(tag, index) in item.tags.slice(0, 3)"
            :key="index"
            :to="`/tags/${typeof tag === 'string' ? tag.toLowerCase().replace(/[\\s/]+/g, '-') : tag}`"
            class="flex items-center justify-center space-x-0.5 group/tag"
          >
            <Hash :class="cn('w-3 h-3 icon-scale', 'text-muted-foreground')" />
            <span :class="cn('text-sm link-underline', 'text-muted-foreground')">
              {{ typeof tag === 'string' ? tag : tag }}
            </span>
          </NuxtLink>
          <span v-if="item.tags.length > 3" :class="cn('text-sm px-1', 'text-muted-foreground')">
            +{{ item.tags.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
