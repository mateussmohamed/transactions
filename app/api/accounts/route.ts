import { NextResponse } from 'next/server'

import { db } from '@/database/drizzle'
import { accounts } from '@/database/schema'
import { InsertAccountSchema } from '@/database/types'
import { ilike } from 'drizzle-orm'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const account = InsertAccountSchema.parse(body)
    const data = await db.insert(accounts).values(account).returning()

    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      const { errors } = error
      return NextResponse.json({ errors }, { status: 422 })
    }

    if (error instanceof Error) {
      //@ts-ignore
      return NextResponse.json({ message: error.detail }, { status: 422 })
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const name = searchParams.get('name') || ''
    const limit = Number(searchParams.get('limit')) || 10
    const offset = Number(searchParams.get('offset')) || 0

    const data = await db
      .select()
      .from(accounts)
      .where(!name ? undefined : ilike(accounts.name, `%${name}%`))
      .limit(limit ?? 10)
      .offset(offset ?? 0)

    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    console.error(e)
  }
}
