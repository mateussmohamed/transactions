'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { NewAccountForm } from '../components/new-account-form'

export default function NewAccountPage() {
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className="flex justify-center items-center">
      <NewAccountForm onDismiss={onDismiss} />
    </div>
  )
}
