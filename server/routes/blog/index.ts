export default defineEventHandler(async (event) => {
  return sendRedirect(event, '/tutorial', 301)
})
