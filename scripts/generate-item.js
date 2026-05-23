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
    console.log('🚀 Starting item generation...\n');

    // 1. Fetch existing categories and tags
    console.log('📋 Fetching categories and tags from Sanity...');
    const categories = await sanityClient.fetch(
      `*[_type == "category"] { _id, name }`
    );
    const tags = await sanityClient.fetch(`*[_type == "tag"] { _id, name }`);

    if (categories.length === 0) {
      console.error('❌ No categories found. Please create categories in Sanity first.');
      process.exit(1);
    }

    console.log(`   Categories: ${categories.map((c) => c.name).join(', ')}`);
    console.log(`   Tags: ${tags.map((t) => t.name).join(', ') || 'none'}\n`);

    // 2. Generate content with Gemini
    console.log('🤖 Generating AI tool listing with Gemini...');
    const prompt = `You are curating an AI tools directory website (topaiskills.com). Generate a new, interesting AI tool listing that would be valuable for Chinese users. The tool should be relatively new (2024-2026), genuinely useful, and not super well-known yet.

Available categories: ${categories.map((c) => c.name).join(', ')}
Available tags: ${tags.map((t) => t.name).join(', ') || 'AI,Productivity,Developer,Design,Content'}

Output as JSON:
{
  "name": "Tool name - include Chinese translation in parentheses if the tool is English-only",
  "description": "One concise sentence in Chinese describing what the tool does (under 60 chars)",
  "introduction": "Detailed introduction in Chinese markdown. Sections: what problem it solves, key features, pricing model, practical use cases, and why it's recommended. 300-800 Chinese characters. Use markdown formatting (headings, lists, bold).",
  "link": "The official website URL",
  "categoryName": "Pick ONE from available categories that best fits",
  "tagNames": ["Pick 1-3 from available tags (or use new descriptive tags if existing ones don't fit)"]
}

IMPORTANT:
- Choose category and tags thoughtfully from the available lists
- introduction should be genuinely informative, not generic AI-generated fluff
- description should be short and punchy
- The link must be a real, working URL`;

    const data = await generateJSON(prompt, 8192);
    console.log(`   Generated: ${data.name}\n`);

    // 3. Generate slug and check uniqueness
    const slug = slugify(data.name);
    const existingItem = await sanityClient.fetch(
      `*[_type == "item" && slug.current == $slug][0]._id`,
      { slug }
    );
    if (existingItem) {
      console.log(`⚠️ Item with slug "${slug}" already exists. Skipping.`);
      return;
    }

    // 4. Match category
    const category = categories.find((c) => c.name === data.categoryName);
    if (!category) {
      console.warn(
        `⚠️ Category "${data.categoryName}" not found. Using first available.`
      );
    }
    const selectedCategory = category || categories[0];

    // 5. Match tags (only use existing ones to avoid orphan references)
    const matchedTags = tags.filter(
      (t) => data.tagNames && data.tagNames.includes(t.name)
    );

    // 6. Create item in Sanity
    console.log('📝 Creating item in Sanity...');
    const item = await sanityClient.create({
      _type: 'item',
      _id: `item.${uuid()}`,
      name: data.name,
      slug: { _type: 'slug', current: slug },
      description: data.description,
      introduction: data.introduction,
      link: data.link,
      publishDate: new Date().toISOString(),
      pricePlan: 'free',
      freePlanStatus: 'approved',
      featured: false,
      categories: [
        {
          _type: 'reference',
          _ref: selectedCategory._id,
          _key: uuid(),
        },
      ],
      tags: matchedTags.map((t) => ({
        _type: 'reference',
        _ref: t._id,
        _key: uuid(),
      })),
    });

    console.log(`✅ Item created successfully!`);
    console.log(`   ID: ${item._id}`);
    console.log(`   Name: ${data.name}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Category: ${selectedCategory.name}`);
    console.log(`   Tags: ${matchedTags.map((t) => t.name).join(', ') || 'none'}`);
  } catch (error) {
    console.error('❌ Item generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
