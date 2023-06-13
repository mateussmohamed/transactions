import { sql } from 'drizzle-orm'

import { db } from '../drizzle'
;(async () => {
  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not defined')
    }

    console.info('🔄 Running truncate tables...')

    const start = Date.now()

    await db.execute(sql`alter table transactions alter type type text`)
    await db.execute(sql`drop type if exists transaction_type`)
    await db.execute(sql`truncate table accounts, transactions`)
    const end = Date.now()

    console.info(`✅ Tables are dropped in ${end - start}ms`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Dropping tables failed!')
    console.error(error)
    process.exit(1)
  }
})()
