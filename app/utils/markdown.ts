/**
 * Simple markdown to HTML converter for item introduction rendering.
 * Handles headings, bold, italic, code blocks, inline code, lists, links, paragraphs.
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md;

  // Escape HTML tags for safety
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (```...```) - must be before other transformations
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-muted rounded-md p-4 overflow-x-auto text-sm my-4"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Headings (h2, h3) — must be before paragraph splitting
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3 text-foreground">$1</h3>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-underline">$1</a>');

  // Unordered lists
  html = html.replace(/^-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/(<li[\s\S]*?<\/li>)\s*\n(?!<li)/g, '$1\n</ul>\n');
  html = html.replace(/(?:^|\n)(<li[\s\S]*?<\/li>)/g, '\n<ul class="my-2 space-y-1">\n$1');

  // Paragraphs: split by double newlines
  const blocks = html.split(/\n\n+/).map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // Already wrapped in tags
    if (trimmed.startsWith('<')) return trimmed;
    // Single line that's not a heading or list item
    if (!trimmed.startsWith('<h') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<li')) {
      return `<p class="mb-4 leading-relaxed">${trimmed}</p>`;
    }
    return trimmed;
  });

  return blocks.join('\n');
}
