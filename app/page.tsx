'use client'

import { TransactionFilter } from '@/app/transactions/components/transaction-filter'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { TransactionList } from './transactions/components/transaction-list'
import { useInfiniteTransactions } from './transactions/hooks/use-infinite-transactions'

export default function TransactionsPage() {
  const {
    transactions,
    hasItems,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    fetchNextPage,
    setSearchParams
  } = useInfiniteTransactions()

  const handleSearchParams = (params: any) => {
    setSearchParams((old) => ({ ...old, ...params }))
  }

  return (
    <>
      <TransactionFilter onSearchParams={handleSearchParams} />

      <div className="flex flex-row justify-center mt-4">
        {error && error.message && <p>Error: {error.message}</p>}
      </div>

      <TransactionList transactions={transactions} isLoading={isLoading} />

      {hasItems ? (
        <div className="flex flex-row justify-center mt-4">
          <Button
            onClick={() => {
              fetchNextPage()
            }}
            variant="outline"
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : hasNextPage ? (
              'Load More'
            ) : (
              'Nothing more to load'
            )}
          </Button>
        </div>
      ) : null}
    </>
  )
}
