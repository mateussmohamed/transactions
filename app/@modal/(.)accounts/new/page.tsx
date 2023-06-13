'use client'

import { NewAccountForm } from '@/app/accounts/components/new-account-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function NewAccountModal() {
  const [isOpen, toggleModall] = useState(true)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  const handleDimiss = () => {
    toggleModall((prev) => !prev)
    onDismiss()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDimiss}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Account</DialogTitle>
        </DialogHeader>
        <NewAccountForm onDismiss={handleDimiss} />
      </DialogContent>
    </Dialog>
  )
}
