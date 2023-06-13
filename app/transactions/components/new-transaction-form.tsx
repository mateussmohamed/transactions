'use client'

import { AccountSearchInput } from '@/app/accounts/components/account-search-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { InsertTransactionSchema } from '@/database/types'
import { env } from '@/lib/env.mjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select } from '@radix-ui/react-select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'

type NewTransactionFormSchema = z.infer<typeof InsertTransactionSchema>

interface NewTransactionFormProps {
  onDismiss?: () => void
}

export function NewTransactionForm({ onDismiss }: NewTransactionFormProps) {
  const [fromBalance, setSenderBalance] = useState('')

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<NewTransactionFormSchema>({
    resolver: zodResolver(InsertTransactionSchema)
  })
  const mutation = useMutation({
    mutationFn: (values: NewTransactionFormSchema) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: 'post',
        body: JSON.stringify(values)
      })
    },
    onSuccess: async (data) => {
      if (data.status === 422) {
        const { message } = await data.json()

        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: message
        })
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      toast({
        title: 'Successful transaction',
        description: 'Check the transaction list'
      })

      form.reset()

      onDismiss && onDismiss()
    },
    onError: () => {
      toast({
        title: 'Ops...',
        description: 'Something wrong happened!'
      })
    }
  })

  async function onSubmit(values: NewTransactionFormSchema) {
    await mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-[380px]">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select the transfer type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="withdraw">Withdraw</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <AccountSearchInput
                inputProps={{
                  id: 'from',
                  name: 'from',
                  placeholder: 'from'
                }}
                onChangeAccount={(value) => {
                  field.onChange(value)
                }}
                onSelectAccount={(account) => {
                  if (account.balance) {
                    setSenderBalance(account.balance)
                  }
                }}
              />
              <FormMessage />
              {fromBalance ? <FormDescription>from Balance: {fromBalance}</FormDescription> : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <AccountSearchInput
                inputProps={{
                  id: 'to',
                  name: 'to',
                  placeholder: 'Receiver'
                }}
                onChangeAccount={(value) => {
                  field.onChange(value)
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-1 w-full justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send
          </Button>
        </div>
      </form>
    </Form>
  )
}
