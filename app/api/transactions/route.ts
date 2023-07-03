import { NextResponse } from 'next/server'

import { db } from '@/database/drizzle'
import { accounts, transactions } from '@/database/schema'
import { InsertTransactionSchema, Transaction } from '@/database/types'
import { add } from 'date-fns'
import { eq } from 'drizzle-orm'

async function processWithdraw(transaction: Transaction) {
  const fromAccount = await db.query.accounts.findFirst({
    where: (table, { eq }) => eq(accounts.id, transaction?.from)
  })

  if (Number(transaction.amount) > Number(fromAccount?.balance)) {
    return NextResponse.json({ message: 'Insufficient funds', code: 422 }, { status: 422 })
  }

  await db.insert(transactions).values(transaction)

  const fromNewBalance = String(Number(fromAccount?.balance) - Number(transaction.amount))

  await db
    .update(accounts)
    .set({ balance: fromNewBalance })
    .where(eq(accounts.id, transaction.from))

  return NextResponse.json({}, { status: 200 })
}

async function processDeposit(transaction: Transaction) {
  const fromAccount = await db.query.accounts.findFirst({
    where: (table, { eq }) => eq(accounts.id, transaction?.from)
  })

  await db.insert(transactions).values(transaction)

  const fromNewBalance = String(Number(fromAccount?.balance) + Number(transaction.amount))

  await db
    .update(accounts)
    .set({ balance: fromNewBalance })
    .where(eq(accounts.id, transaction.from))

  return NextResponse.json({}, { status: 200 })
}

async function processTransfer(transaction: Transaction) {
  if (transaction.from && transaction.to) {
    const from = await db.query.accounts.findFirst({
      columns: {
        balance: true
      },
      where: (table, { eq }) => eq(table.id, transaction.from)
    })

    const hasntBalance = Number(transaction.amount) > Number(from?.balance)
    if (hasntBalance) {
      return NextResponse.json({ message: 'Insufficient funds', code: 422 }, { status: 422 })
    }

    const to = await db.query.accounts.findFirst({
      columns: {
        balance: true
      },
      where: (table, { eq }) => eq(table.id, transaction.to!)
    })

    await db.insert(transactions).values([
      {
        type: 'withdraw',
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to
      },
      {
        type: 'deposit',
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to
      }
    ])

    const fromNewBalance = String(Number(from?.balance) - Number(transaction.amount))
    const toNewBalance = String(Number(to?.balance) + Number(transaction.amount))

    await db
      .update(accounts)
      .set({ balance: fromNewBalance })
      .where(eq(accounts.id, transaction.from))

    await db.update(accounts).set({ balance: toNewBalance }).where(eq(accounts.id, transaction.to))

    return NextResponse.json({}, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const transaction = InsertTransactionSchema.parse(body)

    if (transaction.type === 'withdraw') {
      return await processWithdraw(transaction)
    }

    if (transaction.type === 'deposit') {
      return await processDeposit(transaction)
    }

    if (transaction.type === 'transfer') {
      return await processTransfer(transaction)
    }
  } catch (error) {
    if (error instanceof Error) {
      //@ts-ignore
      return NextResponse.json({ message: error.detail, code: 422 }, { status: 422 })
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const createdAt = searchParams.get('createdAt') || ''
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const type = (searchParams.get('type') || '') as 'withdraw' | 'deposit'
    const limit = Number(searchParams.get('limit')) || 10
    const offset = Number(searchParams.get('offset')) || 0

    const data = await db.query.transactions.findMany({
      limit,
      offset,
      columns: {
        id: true,
        type: true,
        amount: true,
        createdAt: true
      },
      with: {
        from: {
          columns: {
            id: true,
            name: true
          }
        },
        to: {
          columns: {
            id: true,
            name: true
          }
        }
      },
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
      where: (table, { eq, and, sql }) => {
        const clauses = []

        if (!from && !to && !createdAt && !type) return undefined

        if (createdAt) {
          const nextDay = add(new Date(createdAt), { days: 1 })
          clauses.push(
            sql<string>`${table.createdAt} >= ${createdAt} and ${table.createdAt} <= ${nextDay}`
          )
        }

        if (type) clauses.push(eq(table.type, type))

        if (from && !to) clauses.push(eq(table.from, from))

        if (to && !from) clauses.push(eq(table.to, to))

        if (from && to) {
          clauses.push(eq(table.from, from), eq(table.to, to))
        }

        return and(...clauses)
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    console.error(e)
  }
}
