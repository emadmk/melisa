/**
 * Image Optimization Script
 * کرمان هاتف ارتباط
 *
 * This script optimizes images for web:
 * - Converts to WebP format
 * - Creates multiple sizes (thumbnail, medium, large)
 * - Compresses images
 * - Preserves original files
 *
 * Usage:
 * npx ts-node scripts/optimize-images.ts [source-dir] [output-dir]
 *
 * Example:
 * npx ts-node scripts/optimize-images.ts ./uploads ./public/images
 */

import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'

interface ImageSize {
  name: string
  width: number
  height?: number
}

const sizes: ImageSize[] = [
  { name: 'thumbnail', width: 150, height: 150 },
  { name: 'small', width: 300 },
  { name: 'medium', width: 600 },
  { name: 'large', width: 1200 },
]

const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

interface OptimizationResult {
  file: string
  originalSize: number
  optimizedSize: number
  savings: string
  variants: string[]
}

async function optimizeImage(
  inputPath: string,
  outputDir: string
): Promise<OptimizationResult | null> {
  const ext = path.extname(inputPath).toLowerCase()
  if (!supportedFormats.includes(ext)) {
    return null
  }

  const filename = path.basename(inputPath, ext)
  const originalStats = fs.statSync(inputPath)
  const variants: string[] = []

  try {
    // Read image
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      console.log(`  ⚠️ Skipping ${filename}: Cannot read dimensions`)
      return null
    }

    // Create output directory if needed
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Create WebP version at original size
    const webpOutput = path.join(outputDir, `${filename}.webp`)
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(webpOutput)
    variants.push(`${filename}.webp`)

    // Create different sizes
    for (const size of sizes) {
      // Skip if original is smaller than target
      if (metadata.width < size.width) continue

      const sizeDir = path.join(outputDir, size.name)
      if (!fs.existsSync(sizeDir)) {
        fs.mkdirSync(sizeDir, { recursive: true })
      }

      // Resize and convert to WebP
      const resizeOptions: sharp.ResizeOptions = {
        width: size.width,
        height: size.height,
        fit: size.height ? 'cover' : 'inside',
        withoutEnlargement: true,
      }

      const outputPath = path.join(sizeDir, `${filename}.webp`)
      await sharp(inputPath)
        .resize(resizeOptions)
        .webp({ quality: 85 })
        .toFile(outputPath)

      variants.push(`${size.name}/${filename}.webp`)
    }

    // Calculate savings
    const optimizedStats = fs.statSync(webpOutput)
    const savings = (
      ((originalStats.size - optimizedStats.size) / originalStats.size) *
      100
    ).toFixed(1)

    return {
      file: filename,
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      savings: `${savings}%`,
      variants,
    }
  } catch (error) {
    console.error(`  ❌ Error optimizing ${filename}:`, error)
    return null
  }
}

async function processDirectory(
  sourceDir: string,
  outputDir: string
): Promise<OptimizationResult[]> {
  const results: OptimizationResult[] = []

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`)
    return results
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const outputPath = path.join(outputDir, entry.name)

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      const subResults = await processDirectory(sourcePath, outputPath)
      results.push(...subResults)
    } else {
      const result = await optimizeImage(sourcePath, outputDir)
      if (result) {
        results.push(result)
        console.log(`  ✅ ${result.file} - Saved ${result.savings}`)
      }
    }
  }

  return results
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function main() {
  const args = process.argv.slice(2)
  const sourceDir = args[0] || './uploads'
  const outputDir = args[1] || './public/images/optimized'

  console.log('🖼️  Image Optimization Script')
  console.log('=============================\n')
  console.log(`Source: ${sourceDir}`)
  console.log(`Output: ${outputDir}\n`)

  const startTime = Date.now()
  const results = await processDirectory(sourceDir, outputDir)
  const endTime = Date.now()

  // Summary
  console.log('\n=============================')
  console.log('📊 Summary')
  console.log('=============================')
  console.log(`Total images processed: ${results.length}`)

  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0)
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0)
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100

    console.log(`Original size: ${formatBytes(totalOriginal)}`)
    console.log(`Optimized size: ${formatBytes(totalOptimized)}`)
    console.log(`Total savings: ${totalSavings.toFixed(1)}%`)
    console.log(`Time: ${((endTime - startTime) / 1000).toFixed(1)}s`)
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
