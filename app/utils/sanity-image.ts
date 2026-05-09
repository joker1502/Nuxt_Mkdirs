import imageUrlBuilder from '@sanity/image-url';

let imageBuilder: ReturnType<typeof imageUrlBuilder> | null = null;

function getImageBuilder() {
  if (!imageBuilder) {
    const config = useRuntimeConfig();
    imageBuilder = imageUrlBuilder({
      projectId: config.public.sanityProjectId || '',
      dataset: config.public.sanityDataset || '',
    });
  }
  return imageBuilder;
}

/**
 * Generate Sanity image URL using @sanity/image-url
 * Only width is passed — height is NOT forced so images keep their natural aspect ratio.
 */
export function getSanityImageUrl(image: any, options?: { width?: number }): string {
  if (!image || !image.asset) return '';
  
  const builder = getImageBuilder();
  let imgBuilder = builder.image(image).auto('format');
  
  if (options?.width) {
    imgBuilder = imgBuilder.width(options.width);
  }
  
  return imgBuilder.url();
}

/**
 * Generate Sanity icon URL (smaller size)
 */
export function getSanityIconUrl(image: any, size: number = 64): string {
  if (!image || !image.asset) return '';
  
  const builder = getImageBuilder();
  return builder.image(image).auto('format').width(size).height(size).url();
}
