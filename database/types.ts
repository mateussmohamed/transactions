import { InferModel } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import * as z from 'zod'
import { accounts, transactions } from './schema'

export type Account = InferModel<typeof accounts, 'select'>
export type TransactionListItem = {
  from: Account
  to: Account
} & Omit<InferModel<typeof transactions, 'select'>, 'updatedAt'>

export const InsertAccountSchema = createInsertSchema(accounts, {
  name: z.string({
    required_error: 'Type a name'
  }),
  balance: z.string({
    required_error: 'Type a initial balance'
  })
})

enum TransferType {
  Withdraw = 'withdraw',
  Deposit = 'deposit',
  Transfer = 'transfer'
}

export const InsertTransactionSchema = createInsertSchema(transactions, {
  amount: z.string({
    required_error: 'Type a amount'
  }),
  type: z.nativeEnum(TransferType, {
    required_error: 'Select a transfer type'
  }),
  from: z.string({
    required_error: 'Select a from'
  }),
  to: z.string({
    required_error: 'Select a to'
  })
})

export type Transaction = z.infer<typeof InsertTransactionSchema>
