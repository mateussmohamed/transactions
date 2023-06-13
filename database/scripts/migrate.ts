import { migrate } from 'drizzle-orm/vercel-postgres/migrator'

import { db } from '../drizzle'
;(async () => {
  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not defined')
    }

    console.info('🔄 Running migrations...')

    const start = Date.now()
    await migrate(db, { migrationsFolder: './database/migrations' })
    const end = Date.now()

    console.info(`✅ Migrations completed in ${end - start}ms`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Migrations failed!')
    console.error(error)
    process.exit(1)
  }
})()
