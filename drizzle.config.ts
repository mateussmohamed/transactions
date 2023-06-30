import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './database/migrations',
  dbCredentials: {
    connectionString: String(process.env.POSTGRES_URL)
  }
} satisfies Config
