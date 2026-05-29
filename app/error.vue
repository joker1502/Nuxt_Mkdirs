<script setup lang="ts">
import { ArrowLeft, Home } from 'lucide-vue-next';

const props = defineProps<{
  error: { statusCode: number; message?: string; description?: string };
}>();

const headTitle = computed(() => {
  if (props.error.statusCode === 404) return 'Page Not Found | Top AI Skills';
  return 'Error | Top AI Skills';
});

const title = computed(() => {
  if (props.error.statusCode === 404) return 'Page Not Found';
  return 'Something Went Wrong';
});

const description = computed(() => {
  if (props.error.statusCode === 404) return 'The page you are looking for does not exist or has been moved.';
  return props.error.message || props.error.description || 'An unexpected error occurred. Please try again.';
});

useSeoMeta({
  title: headTitle,
  description,
  robots: 'noindex, nofollow',
});
</script>

<template>
  <div class="min-h-screen bg-background antialiased">
    <div class="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur-xl">
      <div class="container max-w-7xl flex h-16 items-center">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <img src="/logo.png" alt="Top AI Skills" class="size-8 rounded-md">
          <span class="text-xl font-bold">Top AI Skills</span>
        </NuxtLink>
      </div>
    </div>
    <main class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div class="flex flex-col items-center text-center px-4">
        <p class="text-8xl font-bold text-muted-foreground/20">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-4 text-3xl font-bold">{{ title }}</h1>
        <p class="mt-2 text-muted-foreground max-w-md">{{ description }}</p>
        <div class="mt-8 flex gap-4">
          <UiButton variant="outline" class="gap-2" @click="clearError({ redirect: '/' })">
            <Home class="size-4" />
            Go Home
          </UiButton>
          <UiButton class="gap-2" @click="clearError({ redirect: '/' })">
            <ArrowLeft class="size-4" />
            Back to Home
          </UiButton>
        </div>
      </div>
    </main>
  </div>
</template>
