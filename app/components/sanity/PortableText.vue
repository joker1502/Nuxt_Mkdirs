<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  blocks: any[];
}

const props = defineProps<Props>();

// Convert Portable Text blocks to HTML
const htmlContent = computed(() => {
  if (!props.blocks || !Array.isArray(props.blocks)) return '';
  return props.blocks.map(block => renderBlock(block)).join('');
});

function renderBlock(block: any): string {
  if (!block) return '';

  // Handle different block types
  switch (block._type) {
    case 'block':
      return renderTextBlock(block);
    case 'image':
      return renderImage(block);
    case 'code':
      return renderCode(block);
    default:
      return '';
  }
}

function renderTextBlock(block: any): string {
  const style = block.style || 'normal';
  const markDefs = block.markDefs || [];
  const text = renderChildren(block.children || [], markDefs);

  switch (style) {
    case 'h1':
      return `<h2 class="mt-10 scroll-m-20 text-3xl font-semibold border-b pb-1 first:mt-0">${text}</h2>`;
    case 'h2':
      return `<h3 class="mt-8 scroll-m-20 text-2xl font-semibold">${text}</h3>`;
    case 'h3':
      return `<h4 class="mt-8 scroll-m-20 text-xl font-semibold">${text}</h4>`;
    case 'h4':
      return `<h5 class="mt-6 scroll-m-20 text-lg font-semibold">${text}</h5>`;
    case 'blockquote':
      return `<blockquote class="mt-6 border-l-4 border-muted pl-4 italic text-muted-foreground">${text}</blockquote>`;
    default:
      return `<p class="mt-4 leading-7 [&:not(:first-child)]:mt-6">${text}</p>`;
  }
}

function renderChildren(children: any[], markDefs: any[] = []): string {
  return children.map(child => {
    if (child._type === 'span') {
      let text = escapeHtml(child.text || '');
      const marks = child.marks || [];

      // First: wrap in link if applicable (outermost)
      let linkHref: string | null = null;
      const otherMarks: string[] = [];

      marks.forEach((mark: string) => {
        const def = markDefs.find((d: any) => d._key === mark);
        if (def && def._type === 'internalLink') {
          if (def.slug?.current) {
            const prefix = def.refType === 'item' ? '/skill' : '/tutorial';
            linkHref = `${prefix}/${def.slug.current}`;
          }
        } else if (def && def.href) {
          linkHref = def.href;
        } else {
          otherMarks.push(mark);
        }
      });

      // Then: apply other marks (bold, italic, etc.)
      otherMarks.forEach((mark: string) => {
        switch (mark) {
          case 'strong':
            text = `<strong class="font-semibold">${text}</strong>`;
            break;
          case 'em':
            text = `<em>${text}</em>`;
            break;
          case 'code':
            text = `<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">${text}</code>`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'strike-through':
            text = `<del>${text}</del>`;
            break;
        }
      });

      // Finally: wrap in link if needed
      if (linkHref) {
        const isInternal = linkHref.startsWith('/') || linkHref.startsWith('https://topaiskills.com');
        const target = isInternal ? '' : ' target="_blank" rel="nofollow noopener noreferrer"';
        const linkClass = isInternal
          ? 'font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'
          : 'font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors';
        text = `<a href="${escapeHtml(linkHref)}"${target} class="${linkClass}">${text}</a>`;
      }

      return text;
    }
    return '';
  }).join('');
}

function renderImage(block: any): string {
  const imageUrl = getSanityImageUrl(block, { width: 800 });
  const alt = block.alt || 'Image';
  return `<figure class="mt-8"><img src="${imageUrl}" alt="${escapeHtml(alt)}" class="rounded-lg w-full" />${block.caption ? `<figcaption class="mt-2 text-center text-sm text-muted-foreground">${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
}

function renderCode(block: any): string {
  const code = escapeHtml(block.code || '');
  const language = block.language || '';
  return `<pre class="mt-6 overflow-x-auto rounded-lg bg-muted p-4"><code class="text-sm font-mono language-${language}">${code}</code></pre>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m] || m);
}
</script>

<template>
  <div class="prose prose-lg dark:prose-invert max-w-none" v-html="htmlContent" />
</template>
