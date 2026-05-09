<script setup>
const route = useRoute()
const slug = route.params.slug

// slug is an array from Nuxt catch-all [...slug]
// e.g., ['foo'] -> /tutorial/foo, ['category', 'ai-image'] -> /tutorial/category/ai-image
// empty array -> /tutorial (no trailing path)

const path = Array.isArray(slug) && slug.length > 0 ? slug.join('/') : ''
await navigateTo(`/tutorial${path ? '/' + path : ''}`, { redirectCode: 301 })
</script>
