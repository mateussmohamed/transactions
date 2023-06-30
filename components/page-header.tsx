'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ModeToggle } from './toggle-theme'
import { Button } from './ui/button'

export function PageHeader() {
  const router = useRouter()

  return (
    <header className="py-10 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-3xl font-bold dark:text-white">Transactions</h1>
      </Link>
      <div className="flex gap-5">
        <Button variant="outline" onClick={() => router.push('/accounts/new')}>
          New Account
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
