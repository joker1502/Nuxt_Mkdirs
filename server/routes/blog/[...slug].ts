export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, '_') || ''
  return sendRedirect(event, `/tutorial/${slug}`, 301)
})
