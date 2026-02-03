/**
 * WordPress to Next.js Migration Script
 * کرمان هاتف ارتباط
 *
 * Usage:
 * 1. Import WordPress SQL to MySQL: mysql wordpress_temp < database.sql
 * 2. Set environment variables
 * 3. Run: npx ts-node scripts/migrate-wordpress.ts
 */

import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// Configuration
const config = {
  wordpress: {
    host: process.env.WP_DB_HOST || 'localhost',
    user: process.env.WP_DB_USER || 'wpuser',
    password: process.env.WP_DB_PASSWORD || 'wppass123',
    database: process.env.WP_DB_NAME || 'wordpress_temp',
    tablePrefix: process.env.WP_TABLE_PREFIX || 'wp_',
  },
  uploadsSource: '/var/www/melisa/wordpress/uploads',
  uploadsTarget: '/var/www/melisa/uploads',
}

const prisma = new PrismaClient()

// Clean HTML content
function cleanHtml(html: string): string {
  if (!html) return ''
  let cleaned = html.replace(/\[.*?\]/g, '') // Remove shortcodes
  cleaned = cleaned.replace(/<[^>]*>/g, ' ') // Remove HTML tags
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  return cleaned
}

// Extract featured image from post meta
async function getFeaturedImage(
  wpConnection: mysql.Connection,
  postId: number
): Promise<string | null> {
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT p.guid FROM ${prefix}posts p
     INNER JOIN ${prefix}postmeta pm ON p.ID = pm.meta_value
     WHERE pm.post_id = ? AND pm.meta_key = '_thumbnail_id'`,
    [postId]
  )

  if (rows.length > 0 && rows[0].guid) {
    const url = rows[0].guid as string
    // Extract path from WordPress URL
    const match = url.match(/uploads\/(.+)$/)
    if (match) {
      return `/uploads/${match[1]}`
    }
  }
  return null
}

// Migrate Categories
async function migrateCategories(wpConnection: mysql.Connection) {
  console.log('📁 Migrating categories...')
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT t.term_id, t.name, t.slug, tt.description, tt.parent
     FROM ${prefix}terms t
     INNER JOIN ${prefix}term_taxonomy tt ON t.term_id = tt.term_id
     WHERE tt.taxonomy = 'product-category'`
  )

  let count = 0
  for (const row of rows) {
    try {
      await prisma.category.upsert({
        where: { slug: row.slug || `cat-${row.term_id}` },
        update: {
          nameFa: row.name,
          description: row.description || null,
        },
        create: {
          nameFa: row.name,
          nameEn: row.slug,
          slug: row.slug || `cat-${row.term_id}`,
          description: row.description || null,
          order: count,
        },
      })
      count++
      console.log(`  ✓ ${row.name}`)
    } catch (error) {
      console.error(`  ❌ Error: ${row.name}`, error)
    }
  }

  console.log(`  ✅ Migrated ${count} categories\n`)
  return count
}

// Migrate Brands
async function migrateBrands(wpConnection: mysql.Connection) {
  console.log('🏷️ Migrating brands...')
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT t.term_id, t.name, t.slug, tt.description
     FROM ${prefix}terms t
     INNER JOIN ${prefix}term_taxonomy tt ON t.term_id = tt.term_id
     WHERE tt.taxonomy = 'brands'`
  )

  let count = 0
  for (const row of rows) {
    try {
      await prisma.brand.upsert({
        where: { slug: row.slug || `brand-${row.term_id}` },
        update: {
          name: row.name,
          description: row.description || null,
        },
        create: {
          name: row.name,
          slug: row.slug || `brand-${row.term_id}`,
          description: row.description || null,
          order: count,
        },
      })
      count++
      console.log(`  ✓ ${row.name}`)
    } catch (error) {
      console.error(`  ❌ Error: ${row.name}`, error)
    }
  }

  console.log(`  ✅ Migrated ${count} brands\n`)
  return count
}

// Migrate Products
async function migrateProducts(wpConnection: mysql.Connection) {
  console.log('📦 Migrating products...')
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT p.ID, p.post_title, p.post_name, p.post_content, p.post_excerpt, p.post_date, p.guid
     FROM ${prefix}posts p
     WHERE p.post_type = 'products' AND p.post_status = 'publish'`
  )

  let count = 0
  for (const row of rows) {
    try {
      const image = await getFeaturedImage(wpConnection, row.ID)

      // Get product category
      const [catRows] = await wpConnection.execute<mysql.RowDataPacket[]>(
        `SELECT t.slug FROM ${prefix}terms t
         INNER JOIN ${prefix}term_taxonomy tt ON t.term_id = tt.term_id
         INNER JOIN ${prefix}term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
         WHERE tr.object_id = ? AND tt.taxonomy = 'product-category'
         LIMIT 1`,
        [row.ID]
      )

      let categoryId: string | undefined
      if (catRows.length > 0) {
        const category = await prisma.category.findUnique({
          where: { slug: catRows[0].slug },
        })
        categoryId = category?.id
      }

      // Get product attributes
      const [metaRows] = await wpConnection.execute<mysql.RowDataPacket[]>(
        `SELECT meta_key, meta_value FROM ${prefix}postmeta
         WHERE post_id = ? AND meta_key NOT LIKE '\\_%' AND meta_value IS NOT NULL AND meta_value != ''`,
        [row.ID]
      )

      const attributes: Array<{key: string, value: string}> = []
      for (const m of metaRows) {
        if (m.meta_value && String(m.meta_value).length < 500 && String(m.meta_value).length > 0) {
          attributes.push({
            key: String(m.meta_key).replace(/_/g, ' '),
            value: String(m.meta_value),
          })
        }
      }

      const slug = row.post_name || `product-${row.ID}`

      await prisma.product.upsert({
        where: { slug },
        update: {
          titleFa: row.post_title,
          fullDesc: cleanHtml(row.post_content),
          shortDesc: cleanHtml(row.post_excerpt),
          image: image || null,
          categoryId,
          status: 'PUBLISHED',
          oldUrl: row.guid,
        },
        create: {
          titleFa: row.post_title,
          titleEn: row.post_name,
          slug,
          fullDesc: cleanHtml(row.post_content),
          shortDesc: cleanHtml(row.post_excerpt),
          image: image || null,
          categoryId,
          status: 'PUBLISHED',
          oldUrl: row.guid,
          attributes: {
            create: attributes,
          },
        },
      })
      count++
      console.log(`  ✓ ${row.post_title}`)
    } catch (error) {
      console.error(`  ❌ Error: ${row.post_title}`, error)
    }
  }

  console.log(`  ✅ Migrated ${count} products\n`)
  return count
}

// Migrate Blog Posts
async function migratePosts(wpConnection: mysql.Connection) {
  console.log('📝 Migrating blog posts...')
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT p.ID, p.post_title, p.post_name, p.post_content, p.post_excerpt,
            p.post_date, p.post_author
     FROM ${prefix}posts p
     WHERE p.post_type = 'post' AND p.post_status = 'publish'`
  )

  let count = 0
  for (const row of rows) {
    try {
      const image = await getFeaturedImage(wpConnection, row.ID)

      const [authorRows] = await wpConnection.execute<mysql.RowDataPacket[]>(
        `SELECT display_name FROM ${prefix}users WHERE ID = ?`,
        [row.post_author]
      )
      const authorName = authorRows[0]?.display_name || 'تیم فنی هاتف ارتباط'

      const slug = row.post_name || `post-${row.ID}`

      await prisma.post.upsert({
        where: { slug },
        update: {
          titleFa: row.post_title,
          content: row.post_content,
          excerpt: cleanHtml(row.post_excerpt),
          image: image || null,
          status: 'PUBLISHED',
        },
        create: {
          titleFa: row.post_title,
          titleEn: row.post_name,
          slug,
          content: row.post_content,
          excerpt: cleanHtml(row.post_excerpt),
          image: image || null,
          author: authorName,
          status: 'PUBLISHED',
          publishedAt: new Date(row.post_date),
        },
      })
      count++
      console.log(`  ✓ ${row.post_title}`)
    } catch (error) {
      console.error(`  ❌ Error: ${row.post_title}`, error)
    }
  }

  console.log(`  ✅ Migrated ${count} posts\n`)
  return count
}

// Migrate Services
async function migrateServices(wpConnection: mysql.Connection) {
  console.log('🔧 Migrating services...')
  const prefix = config.wordpress.tablePrefix

  const [rows] = await wpConnection.execute<mysql.RowDataPacket[]>(
    `SELECT p.ID, p.post_title, p.post_name, p.post_content, p.post_excerpt, p.post_date, p.guid
     FROM ${prefix}posts p
     WHERE p.post_type = 'services' AND p.post_status = 'publish'`
  )

  let count = 0
  for (const row of rows) {
    try {
      const image = await getFeaturedImage(wpConnection, row.ID)
      const slug = row.post_name || `service-${row.ID}`

      await prisma.service.upsert({
        where: { slug },
        update: {
          titleFa: row.post_title,
          fullDesc: row.post_content,
          shortDesc: cleanHtml(row.post_excerpt),
          image: image || null,
          status: 'PUBLISHED',
        },
        create: {
          titleFa: row.post_title,
          titleEn: row.post_name,
          slug,
          fullDesc: row.post_content,
          shortDesc: cleanHtml(row.post_excerpt),
          image: image || null,
          status: 'PUBLISHED',
          order: count,
        },
      })
      count++
      console.log(`  ✓ ${row.post_title}`)
    } catch (error) {
      console.error(`  ❌ Error: ${row.post_title}`, error)
    }
  }

  console.log(`  ✅ Migrated ${count} services\n`)
  return count
}

// Copy media files
async function copyMediaFiles() {
  console.log('🖼️ Copying media files...')

  const sourcePath = config.uploadsSource
  const destPath = config.uploadsTarget

  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠️ Source path not found: ${sourcePath}`)
    return 0
  }

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true })
  }

  let count = 0

  function copyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) return

    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPathFull = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPathFull)) {
          fs.mkdirSync(destPathFull, { recursive: true })
        }
        copyDir(srcPath, destPathFull)
      } else if (/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(entry.name)) {
        // Skip WordPress thumbnail variants
        if (!/-\d+x\d+\./.test(entry.name)) {
          fs.copyFileSync(srcPath, destPathFull)
          count++
        }
      }
    }
  }

  copyDir(sourcePath, destPath)

  console.log(`  ✅ Copied ${count} media files\n`)
  return count
}

// Generate redirects file
async function generateRedirects() {
  console.log('🔄 Generating redirects...')

  const products = await prisma.product.findMany({
    where: { oldUrl: { not: null } },
    select: { slug: true, oldUrl: true },
  })

  const redirects = products
    .filter((p) => p.oldUrl)
    .map((p) => {
      const oldPath = new URL(p.oldUrl!).pathname
      return {
        source: oldPath,
        destination: `/products/${p.slug}`,
        permanent: true,
      }
    })

  const content = `// Auto-generated redirects from WordPress migration
export const redirects = ${JSON.stringify(redirects, null, 2)}
`

  fs.writeFileSync('./config/redirects.ts', content)
  console.log(`  ✅ Generated ${redirects.length} redirects\n`)

  return redirects.length
}

// Main migration function
async function main() {
  console.log('🚀 WordPress Migration - کرمان هاتف ارتباط')
  console.log('==========================================\n')

  let wpConnection: mysql.Connection | null = null

  try {
    console.log('🔌 Connecting to WordPress MySQL...')
    wpConnection = await mysql.createConnection({
      host: config.wordpress.host,
      user: config.wordpress.user,
      password: config.wordpress.password,
      database: config.wordpress.database,
    })
    console.log('  ✅ Connected!\n')

    // Run migrations
    const results = {
      media: await copyMediaFiles(),
      categories: await migrateCategories(wpConnection),
      brands: await migrateBrands(wpConnection),
      products: await migrateProducts(wpConnection),
      services: await migrateServices(wpConnection),
      posts: await migratePosts(wpConnection),
      redirects: await generateRedirects(),
    }

    console.log('==========================================')
    console.log('✅ Migration Complete!')
    console.log('==========================================')
    console.log(`📁 Categories: ${results.categories}`)
    console.log(`🏷️ Brands: ${results.brands}`)
    console.log(`📦 Products: ${results.products}`)
    console.log(`🔧 Services: ${results.services}`)
    console.log(`📝 Posts: ${results.posts}`)
    console.log(`🖼️ Media: ${results.media}`)
    console.log(`🔄 Redirects: ${results.redirects}`)
    console.log('')
    console.log('Next steps:')
    console.log('1. npm run build')
    console.log('2. pm2 restart hatef-website')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    if (wpConnection) await wpConnection.end()
    await prisma.$disconnect()
  }
}

main()
