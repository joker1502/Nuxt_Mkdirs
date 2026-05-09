export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  return sendRedirect(event, `/tutorial/${slug}`, 301)
})
