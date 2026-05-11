/**
 * Get single tag by slug with its items
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    // Get tag
    const tagQuery = `*[_type == "tag" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      description
    }`;

    const tag = await sanityFetch<any>(tagQuery, { slug });

    if (!tag) {
      throw createError({
        statusCode: 404,
        message: 'Tag not found',
      });
    }

    // Count items with this tag
    const countQuery = `count(*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && $slug in tags[]->slug.current])`;
    const total = await sanityFetch<number>(countQuery, { slug });

    // Count blog posts with this tag
    const blogCountQuery = `count(*[_type == "blogPost" && defined(slug.current) 
      && defined(publishDate)
      && $slug in tags[]->slug.current])`;
    const blogTotal = await sanityFetch<number>(blogCountQuery, { slug });

    // Get items with this tag
    const start = (page - 1) * limit;
    const end = start + limit;
    const itemsQuery = `*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && $slug in tags[]->slug.current] 
      | order(coalesce(featured, false) desc, _updatedAt desc) [${start}...${end}] {
        _id,
        _createdAt,
        name,
        slug,
        description,
        link,
        featured,
        icon {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        categories[]->,
        tags[]->,
      }`;

    const items = await sanityFetch<any[]>(itemsQuery, { slug });

    // Get blog posts with this tag
    const blogPostsQuery = `*[_type == "blogPost" && defined(slug.current) 
      && defined(publishDate)
      && $slug in tags[]->slug.current] 
      | order(publishDate desc) [${start}...${end}] {
        _id,
        _createdAt,
        title,
        slug,
        excerpt,
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        publishDate,
        author->,
        categories[]->,
        tags[]->,
      }`;

    const blogPosts = await sanityFetch<any[]>(blogPostsQuery, { slug });

    return {
      tag,
      items: items || [],
      blogPosts: blogPosts || [],
      pagination: {
        page,
        limit,
        total: total + blogTotal,
        totalPages: Math.ceil((total + blogTotal) / limit),
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching tag:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tag',
    });
  }
});
