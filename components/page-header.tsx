'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function PageHeader() {
  const router = useRouter()

  return (
    <header className="py-10 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </Link>

      <Button onClick={() => router.push('/accounts/new')}>New Account</Button>
    </header>
  )
}
