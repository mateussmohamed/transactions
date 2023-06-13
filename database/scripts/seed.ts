import { faker } from '@faker-js/faker'

import { db } from '../drizzle'
import { accounts, transactions } from '../schema'
import { Account, Transaction } from '../types'

async function createRandomAccounts() {
  return await db
    .insert(accounts)
    .values(
      Array(15)
        .fill(null)
        .map(() => {
          return {
            name: faker.person.fullName(),
            balance: faker.finance.amount(100, 10000)
          }
        })
    )
    .returning()
}

async function createRandomTransactions(accounts: Account[]) {
  const withdraws = Array(15)
    .fill(null)
    .map(() => {
      const fromIndex = faker.number.int({ min: 0, max: 14 })
      const amount = faker.finance.amount(10, 200, 2)
      return {
        amount,
        type: 'withdraw',
        from: accounts[fromIndex].id
      }
    })

  const deposits = Array(15)
    .fill(null)
    .map(() => {
      const fromIndex = faker.number.int({ min: 0, max: 14 })
      const amount = faker.finance.amount(10, 200, 2)
      return {
        amount,
        type: 'deposit',
        from: accounts[fromIndex].id
      }
    })

  const transfers = Array(15)
    .fill(null)
    .map(() => {
      const fromIndex = faker.number.int({ min: 0, max: 14 })
      const toIndex = faker.number.int({ min: 0, max: 14 })
      const amount = faker.finance.amount(10, faker.number.int({ min: 10, max: 200 }), 2)
      return {
        amount,
        type: 'transfer',
        from: accounts[fromIndex].id,
        to: accounts[toIndex].id
      }
    })

  return await db
    .insert(transactions)
    .values([...withdraws, ...deposits, ...transfers] as Transaction[])
}

;(async () => {
  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not defined')
    }

    console.info('🔄 Running seed...')

    const start = Date.now()
    const accounts = await createRandomAccounts()
    await createRandomTransactions(accounts)
    const end = Date.now()

    console.info(`✅ Seed completed in ${end - start}ms`)

    process.exit(0)
  } catch (error) {
    console.error(`🚀 ~ file: seed.ts:84 ~ ; ~ error:`, error)
    process.exit(1)
  }
})()
