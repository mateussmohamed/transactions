import { relations, sql } from 'drizzle-orm'
import { numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

/*
 * Accounts
 */
export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    balance: numeric('balance', { precision: 10, scale: 2 }),

    createdAt: timestamp('createdAt').default(sql`now()`),
    updatedAt: timestamp('updatedAt').default(sql`now()`)
  },
  (accounts) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(accounts.name)
    }
  }
)

/*
 * Transactions
 */

export const transferTypeEnum = pgEnum('transaction_type', ['withdraw', 'deposit', 'transfer'])

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),

  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: transferTypeEnum('type').notNull(),

  from: uuid('from_id')
    .references(() => accounts.id)
    .notNull(),
  to: uuid('to_id').references(() => accounts.id),

  createdAt: timestamp('createdAt').default(sql`now()`),
  updatedAt: timestamp('updatedAt').default(sql`now()`)
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
  from: one(accounts, {
    fields: [transactions.from],
    references: [accounts.id]
  }),
  to: one(accounts, {
    fields: [transactions.to],
    references: [accounts.id]
  })
}))
