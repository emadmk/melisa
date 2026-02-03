/**
 * اسکریپت بکاپ خودکار دیتابیس و فایل‌ها
 * قابل اجرا با cron job برای بکاپ روزانه
 *
 * استفاده:
 * npx ts-node scripts/backup.ts
 * یا: npm run backup
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

interface BackupConfig {
  databaseUrl: string
  uploadsPath: string
  backupsPath: string
  retentionDays: number
}

const config: BackupConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/hatef',
  uploadsPath: path.resolve(process.cwd(), 'public/uploads'),
  backupsPath: process.env.BACKUPS_PATH || '/var/www/hatef/backups',
  retentionDays: 30,
}

async function ensureBackupDir(): Promise<void> {
  if (!fs.existsSync(config.backupsPath)) {
    fs.mkdirSync(config.backupsPath, { recursive: true })
    console.log(`📁 ساخت پوشه بکاپ: ${config.backupsPath}`)
  }
}

function getTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}_${hour}-${minute}`
}

async function backupDatabase(): Promise<string | null> {
  const timestamp = getTimestamp()
  const fileName = `db_backup_${timestamp}.sql`
  const filePath = path.join(config.backupsPath, fileName)

  try {
    // Parse database URL
    const url = new URL(config.databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password

    // Set password via environment variable for pg_dump
    const env = { ...process.env, PGPASSWORD: password }

    const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F p -f "${filePath}"`

    console.log('🔄 در حال بکاپ دیتابیس...')
    await execAsync(command, { env })

    // Compress the backup
    const gzipPath = `${filePath}.gz`
    await execAsync(`gzip -f "${filePath}"`)

    const stats = fs.statSync(gzipPath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)

    console.log(`✅ بکاپ دیتابیس: ${fileName}.gz (${sizeMB} MB)`)
    return gzipPath
  } catch (error) {
    console.error('❌ خطا در بکاپ دیتابیس:', error)
    return null
  }
}

async function backupUploads(): Promise<string | null> {
  if (!fs.existsSync(config.uploadsPath)) {
    console.log('⚠️ پوشه uploads وجود ندارد')
    return null
  }

  const timestamp = getTimestamp()
  const fileName = `uploads_backup_${timestamp}.tar.gz`
  const filePath = path.join(config.backupsPath, fileName)

  try {
    console.log('🔄 در حال بکاپ فایل‌ها...')

    const command = `tar -czf "${filePath}" -C "${path.dirname(config.uploadsPath)}" "${path.basename(config.uploadsPath)}"`
    await execAsync(command)

    const stats = fs.statSync(filePath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)

    console.log(`✅ بکاپ فایل‌ها: ${fileName} (${sizeMB} MB)`)
    return filePath
  } catch (error) {
    console.error('❌ خطا در بکاپ فایل‌ها:', error)
    return null
  }
}

async function cleanOldBackups(): Promise<void> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays)

  try {
    const files = fs.readdirSync(config.backupsPath)
    let deletedCount = 0

    for (const file of files) {
      const filePath = path.join(config.backupsPath, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath)
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      console.log(`🗑️ ${deletedCount} بکاپ قدیمی حذف شد`)
    }
  } catch (error) {
    console.error('❌ خطا در پاکسازی بکاپ‌های قدیمی:', error)
  }
}

async function listBackups(): Promise<void> {
  if (!fs.existsSync(config.backupsPath)) {
    console.log('📂 هیچ بکاپی وجود ندارد')
    return
  }

  const files = fs.readdirSync(config.backupsPath)
    .filter(f => f.endsWith('.gz') || f.endsWith('.tar.gz'))
    .sort()
    .reverse()

  console.log('\n📋 لیست بکاپ‌ها:')
  console.log('─'.repeat(60))

  for (const file of files) {
    const filePath = path.join(config.backupsPath, file)
    const stats = fs.statSync(filePath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
    const date = stats.mtime.toLocaleString('fa-IR')

    console.log(`  ${file} - ${sizeMB} MB - ${date}`)
  }

  console.log('─'.repeat(60))
  console.log(`  مجموع: ${files.length} بکاپ\n`)
}

async function restoreDatabase(backupFile: string): Promise<boolean> {
  const filePath = path.join(config.backupsPath, backupFile)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ فایل بکاپ یافت نشد: ${backupFile}`)
    return false
  }

  try {
    const url = new URL(config.databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password

    const env = { ...process.env, PGPASSWORD: password }

    console.log('🔄 در حال بازیابی دیتابیس...')

    // Decompress if gzipped
    let sqlFile = filePath
    if (filePath.endsWith('.gz')) {
      sqlFile = filePath.replace('.gz', '')
      await execAsync(`gunzip -k -f "${filePath}"`)
    }

    const command = `psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${sqlFile}"`
    await execAsync(command, { env })

    // Clean up decompressed file
    if (filePath.endsWith('.gz') && fs.existsSync(sqlFile)) {
      fs.unlinkSync(sqlFile)
    }

    console.log('✅ دیتابیس با موفقیت بازیابی شد')
    return true
  } catch (error) {
    console.error('❌ خطا در بازیابی دیتابیس:', error)
    return false
  }
}

async function runBackup(): Promise<void> {
  console.log('\n' + '═'.repeat(50))
  console.log('🗄️  سیستم بکاپ کرمان هاتف ارتباط')
  console.log('═'.repeat(50))
  console.log(`⏰ زمان: ${new Date().toLocaleString('fa-IR')}`)
  console.log('─'.repeat(50))

  await ensureBackupDir()

  const dbBackup = await backupDatabase()
  const uploadsBackup = await backupUploads()

  await cleanOldBackups()

  console.log('─'.repeat(50))

  if (dbBackup || uploadsBackup) {
    console.log('✅ بکاپ با موفقیت انجام شد')
  } else {
    console.log('⚠️ بکاپ با مشکل مواجه شد')
    process.exit(1)
  }

  console.log('═'.repeat(50) + '\n')
}

// Parse CLI arguments
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'list':
    listBackups()
    break
  case 'restore':
    if (!args[1]) {
      console.error('❌ نام فایل بکاپ را وارد کنید')
      console.log('استفاده: npm run backup restore db_backup_2024-01-01_12-00.sql.gz')
      process.exit(1)
    }
    restoreDatabase(args[1])
    break
  case 'run':
  default:
    runBackup()
}
