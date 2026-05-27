<script setup lang="ts">
import { siteConfig } from '~/config/site';
import { cn } from '~/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();

const colorMode = useColorMode();

const logo = computed(() => {
  if (colorMode.value === 'dark' && siteConfig.logoDark) {
    return siteConfig.logoDark;
  }
  return siteConfig.logo;
});
</script>

<template>
  <img
    :src="logo"
    alt="Top AI Skills"
    title="Top AI Skills"
    width="96"
    height="96"
    :class="cn('size-8 rounded-md', props.class)"
  />
</template>
