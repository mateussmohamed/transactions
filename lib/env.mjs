import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

function getApiUrl() {
  const env = [process.env.NODE_ENV, process.env.VERCEL_ENV]

  if (env.includes('production')) {
    return `https://${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/api`
  }

  const VERCEL_URL = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL

  return env.includes('development') ? VERCEL_URL : `https://${VERCEL_URL}/api`
}

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string(),
    POSTGRES_PRISMA_URL: z.string(),
    POSTGRES_URL_NON_POOLING: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DATABASE: z.string(),
    API_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'preview', 'production']),
    VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional()
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url()
  },
  runtimeEnv: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    API_URL: getApiUrl(),
    NEXT_PUBLIC_API_URL: getApiUrl(),
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  }
})
