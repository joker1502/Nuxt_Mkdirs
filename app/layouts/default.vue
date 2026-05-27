<script setup lang="ts">
import { marketingConfig } from '~/config/marketing';

// Inject canonical URL site-wide (SSR + client)
const route = useRoute();
useHead({
  link: [
    { rel: 'canonical', href: `https://topaiskills.com${route.path}` },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-background antialiased">
    <LayoutNavbar :config="marketingConfig" scroll />
    
    <main>
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>
