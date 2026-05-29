import { createClient } from '@sanity/client'
import { uuid } from '@sanity/uuid'

const client = createClient({
  projectId: 'isvdg9tz',
  dataset: 'production',
  apiVersion: '2024-08-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

async function fetchRepoAvatar(owner: string, repo: string): Promise<Buffer | null> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'topaiskills-icon-fetcher/1.0' },
  })
  if (!res.ok) {
    console.error(`  GitHub API error: ${res.status} for ${owner}/${repo}`)
    return null
  }
  const data = await res.json()
  const avatarUrl = data.owner?.avatar_url
  if (!avatarUrl) return null

  const imgRes = await fetch(avatarUrl)
  if (!imgRes.ok) return null
  const buffer = Buffer.from(await imgRes.arrayBuffer())
  return buffer
}

async function uploadToSanity(buffer: Buffer, name: string): Promise<string | null> {
  try {
    const asset = await client.assets.upload('image', buffer, {
      filename: `icon-${name.toLowerCase().replace(/\s+/g, '-')}.png`,
      contentType: 'image/png',
    })
    return asset._id
  } catch (e) {
    console.error(`  Upload error for ${name}:`, e)
    return null
  }
}

async function updateItemIcon(itemId: string, assetId: string) {
  await client.patch(itemId).set({
    icon: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
    },
  }).commit()
}

async function main() {
  const items = await client.fetch(
    `*[_type == "item" && defined(link) && link match "*github*" && !defined(icon.asset)]{_id, name, link}`
  )

  console.log(`Found ${items.length} items missing GitHub icons\n`)

  const repoCache = new Map<string, string>()

  for (const item of items) {
    const parsed = parseGitHubRepo(item.link)
    if (!parsed) {
      console.log(`✗ ${item.name}: could not parse GitHub URL (${item.link})`)
      continue
    }

    const { owner, repo } = parsed
    const cacheKey = `${owner}/${repo}`.toLowerCase()

    let assetId = repoCache.get(cacheKey)

    if (!assetId) {
      console.log(`→ Fetching ${cacheKey} avatar...`)
      const buffer = await fetchRepoAvatar(owner, repo)
      if (!buffer) {
        console.log(`✗ ${item.name}: failed to fetch avatar for ${cacheKey}`)
        continue
      }

      assetId = await uploadToSanity(buffer, `${owner}-${repo}`) as string
      if (!assetId) {
        console.log(`✗ ${item.name}: failed to upload avatar`)
        continue
      }
      repoCache.set(cacheKey, assetId)
    }

    await updateItemIcon(item._id, assetId)
    console.log(`✓ ${item.name}: icon set (from ${cacheKey})`)
  }

  console.log(`\nDone! Updated ${items.length} items.`)
}

main().catch(console.error)
