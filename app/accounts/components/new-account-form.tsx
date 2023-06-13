'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { InsertAccountSchema } from '@/database/types'
import { env } from '@/lib/env.mjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'

type NewAccountFormSchema = z.infer<typeof InsertAccountSchema>

interface NewAccountFormProps {
  onDismiss?: () => void
}

export function NewAccountForm({ onDismiss }: NewAccountFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<NewAccountFormSchema>({
    resolver: zodResolver(InsertAccountSchema),
    defaultValues: {
      name: '',
      balance: '1000'
    }
  })
  const mutation = useMutation({
    mutationFn: (values: NewAccountFormSchema) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}/accounts`, {
        method: 'post',
        body: JSON.stringify(values)
      })
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })

      toast({
        title: 'Successful new account'
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

  async function onSubmit(values: NewAccountFormSchema) {
    await mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-[380px]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Smith" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="500.00"
                  autoComplete="off"
                  {...field}
                  value={String(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-1 w-full justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
