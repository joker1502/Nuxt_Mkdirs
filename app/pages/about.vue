<script setup lang="ts">
import { siteConfig } from '~/config/site';
import { onMounted } from 'vue';

useSeoMeta({
  title: 'About Us | Top AI Skills',
  description: 'Learn about Top AI Skills — the curated directory of the best AI skills, AI agents, and AI tools. Expert-reviewed resources for developers and creators.',
  ogTitle: 'About Us | Top AI Skills',
  ogDescription: 'Learn about Top AI Skills — the curated directory of the best AI skills, AI agents, and AI tools. Expert-reviewed resources for developers and creators.',
  keywords: 'Top AI Skills, AI skills directory, AI agents, AI tools, about AI directory',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhirentegong',
  twitterCreator: '@zhirentegong',
  twitterImage: 'https://topaiskills.com/logo.png',
  robots: 'index, follow',
});

// Inject AboutPage JSON-LD for EEAT
onMounted(() => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://topaiskills.com/about/#aboutpage',
    url: 'https://topaiskills.com/about',
    name: 'About Top AI Skills',
    description: 'Top AI Skills is a curated directory of the best AI skills, AI agents, and AI tools, expert-reviewed and updated regularly.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://topaiskills.com/#organization',
      name: 'Top AI Skills',
      url: 'https://topaiskills.com',
      email: 'hello@topaiskills.com',
      description: 'Curated directory of AI skills, AI agents, and AI tools for developers and creators.',
      foundingDate: '2025',
    },
  };
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold mb-6">About Top AI Skills</h1>
        
        <div class="prose prose-lg dark:prose-invert">
          <p>
            Welcome to <strong>Top AI Skills</strong> — your curated directory for discovering
            the best AI skills, AI agents, and AI tools. We help developers, creators, and businesses
            find the right AI resources for their needs.
          </p>

          <h2>Our Mission</h2>
          <p>
            The AI landscape evolves daily. New tools, agents, and skills emerge constantly.
            Our mission is to cut through the noise and curate only the most useful,
            well-documented, and actively maintained AI resources — so you can spend less time
            searching and more time building.
          </p>

          <h2>What Makes Us Different</h2>
          <ul>
            <li><strong>Curated, Not Aggregated</strong> — Every tool is reviewed for quality, documentation, and active development</li>
            <li><strong>GitHub-First</strong> — We prioritize tools with open-source repositories, real documentation, and active communities</li>
            <li><strong>Tutorial-Focused</strong> — Each skill comes with practical tutorials, not just listings</li>
            <li><strong>Regularly Updated</strong> — New skills and tutorials added weekly</li>
          </ul>

          <h2>For Developers, By Curators</h2>
          <p>
            We understand the frustration of finding an "AI tool" that turns out to be a
            landing page with no substance. That's why every skill on Top AI Skills has:
          </p>
          <ul>
            <li>A verifiable GitHub repository with real code</li>
            <li>Official documentation you can actually use</li>
            <li>Real-world use cases with step-by-step tutorials</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Have a suggestion or want to submit a tool? We'd love to hear from you.
            Reach out at <a :href="`mailto:${siteConfig.mail}`">{{ siteConfig.mail }}</a>
            or follow us on <a :href="siteConfig.links.twitter" target="_blank" rel="nofollow noopener noreferrer">Twitter</a>.
          </p>

          <h2>Publisher Information</h2>
          <p>
            <strong>Top AI Skills</strong><br>
            Contact: hello@topaiskills.com<br>
            Founded: 2025
          </p>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>
