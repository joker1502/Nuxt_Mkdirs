import { v4 as uuid } from 'uuid';
import sanityClient from './lib/sanity-client.js';
import { generateJSON } from './lib/ai-client.js';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  try {
    console.log('🚀 Starting blog post generation...\n');

    // 1. Fetch blog categories and admin user
    console.log('📋 Fetching blog categories and admin user...');
    let blogCategories = await sanityClient.fetch(
      `*[_type == "blogCategory"] { _id, name }`
    );

    // Find or create admin user
    let adminUser = await sanityClient.fetch(
      `*[_type == "user"] | order(_createdAt asc)[0] { _id, name }`
    );

    if (!adminUser) {
      console.log('   No user found, creating default admin user...');
      adminUser = await sanityClient.create({
        _type: 'user',
        _id: `user.${uuid()}`,
        name: 'AI Editor',
        email: 'ai-editor@topaiskills.com',
        role: 'administrator',
      });
      console.log(`   Created user: ${adminUser._id}`);
    }

    // Create default blog category if none exist
    if (blogCategories.length === 0) {
      console.log('   No blog categories found, creating default...');
      const cat = await sanityClient.create({
        _type: 'blogCategory',
        _id: `blogCategory.${uuid()}`,
        name: 'AI Tutorial',
        slug: { _type: 'slug', current: 'ai-tutorial' },
      });
      blogCategories = [cat];
      console.log(`   Created category: ${cat.name}`);
    }

    console.log(
      `   Categories: ${blogCategories.map((c) => c.name).join(', ')}\n`
    );

    // 2. Generate content
    console.log('🤖 Generating tutorial article with Gemini...');
    const prompt = `You are an AI tutorial writer for topaiskills.com, a Chinese website about AI tools and practical skills.

Write a practical tutorial article in Chinese. The body MUST be in Sanity Portable Text format (array of blocks).

Available blog categories: ${blogCategories.map((c) => c.name).join(', ')}

Output as JSON:
{
  "title": "Article title in Chinese (16-28 characters, include specific scenario and/or numbers, no clickbait)",
  "excerpt": "A brief 1-2 sentence hook in Chinese",
  "body": [
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Section heading", "marks": []}], "markDefs": []},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Paragraph text.", "marks": []}], "markDefs": []}
  ],
  "categoryName": "Pick ONE from available categories"
}

WRITING RULES:
- Title: 16-28 Chinese characters, include concrete use case or numbers
- Style: Step-by-step tutorial, like teaching a friend. Use "你".
- Open with what the tool does and why it matters (the hook)
- Include specific steps, practical tips, and real use cases
- Body: 8-15 blocks including h2 headings and normal paragraphs
- Make it genuinely useful and actionable, avoid generic fluff
- NO fabricated user personas (no "小王", "小李", etc.)
- NO uncertainty words (maybe, perhaps, 可能, 也许)
- NO clickbait phrases
- DO NOT add hashtags at the end`;

    const data = await generateJSON(prompt);
    console.log(`   Title: ${data.title}\n`);

    // 3. Check slug uniqueness
    const slug = slugify(data.title);
    const existingPost = await sanityClient.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]._id`,
      { slug }
    );
    if (existingPost) {
      console.log(`⚠️ Blog post with slug "${slug}" already exists. Skipping.`);
      return;
    }

    // 4. Match category
    const category = blogCategories.find((c) => c.name === data.categoryName);
    if (!category) {
      console.warn(
        `⚠️ Category "${data.categoryName}" not found. Using first available.`
      );
    }
    const selectedCategory = category || blogCategories[0];

    // 5. Validate body format
    if (!Array.isArray(data.body) || data.body.length === 0) {
      console.error('❌ Invalid body format from AI.');
      process.exit(1);
    }

    // 6. Create blog post
    console.log('📝 Creating blog post in Sanity...');
    const post = await sanityClient.create({
      _type: 'blogPost',
      _id: `blogPost.${uuid()}`,
      title: data.title,
      slug: { _type: 'slug', current: slug },
      excerpt: data.excerpt,
      body: data.body,
      author: { _type: 'reference', _ref: adminUser._id },
      publishDate: new Date().toISOString(),
      categories: [
        {
          _type: 'reference',
          _ref: selectedCategory._id,
          _key: uuid(),
        },
      ],
    });

    console.log(`✅ Blog post created successfully!`);
    console.log(`   ID: ${post._id}`);
    console.log(`   Title: ${data.title}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Category: ${selectedCategory.name}`);
    console.log(`   Body blocks: ${data.body.length}`);
  } catch (error) {
    console.error('❌ Blog post generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
