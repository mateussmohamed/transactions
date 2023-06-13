'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { NewTransactionForm } from '../components/new-transaction-form'

export default function NewTransactionPage() {
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className="flex justify-center items-center">
      <NewTransactionForm onDismiss={onDismiss} />
    </div>
  )
}
