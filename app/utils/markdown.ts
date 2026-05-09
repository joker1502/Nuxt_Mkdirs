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

  // Links - convert /item/ to /skill/ for internal links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
    const fixedHref = href.replace(/^\/item\//, '/skill/');
    return `<a href="${fixedHref}" target="_blank" rel="noopener noreferrer" class="link-underline">${text}</a>`;
  });

  // Unordered lists - handle nested lists properly
  // First, mark list items with indentation level
  const listLines: string[] = [];
  html.split('\n').forEach(line => {
    const match = line.match(/^(\s*)-\s+(.+)$/);
    if (match) {
      const indent = match[1].length;
      listLines.push({ indent, content: match[2] });
    } else {
      listLines.push({ indent: -1, content: line });
    }
  });

  // Build proper nested list HTML
  const buildList = (lines: typeof listLines, startIdx: number, parentIndent: number): { html: string; nextIdx: number } => {
    let result = '<ul class="my-2 space-y-1">\n';
    let i = startIdx;

    while (i < lines.length) {
      const line = lines[i];
      if (line.indent === -1) break;
      if (line.indent <= parentIndent && i > startIdx) break;

      result += `<li class="list-disc list-inside">${line.content}`;

      // Check for nested items
      if (i + 1 < lines.length && lines[i + 1].indent > line.indent) {
        const nested = buildList(lines, i + 1, line.indent);
        result += '\n' + nested.html;
        i = nested.nextIdx;
      } else {
        i++;
      }

      result += '</li>\n';
    }

    result += '</ul>';
    return { html: result, nextIdx: i };
  };

  // Process the lines into nested list HTML
  let listHtml = '';
  let idx = 0;
  while (idx < listLines.length) {
    if (listLines[idx].indent === -1) {
      listHtml += listLines[idx].content + '\n';
      idx++;
    } else {
      // If content before this list is not empty, add a separator
      const result = buildList(listLines, idx, -1);
      listHtml += '\n' + result.html + '\n';
      idx = result.nextIdx;
    }
  }

  html = listHtml;

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
