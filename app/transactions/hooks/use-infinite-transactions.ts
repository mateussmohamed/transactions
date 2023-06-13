import { TransactionListItem } from '@/database/types'
import { env } from '@/lib/env.mjs'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

const fetchTransactions = async ({
  limit = 10,
  offset = 0,
  createdAt = '',
  from = '',
  to = '',
  type = ''
}) => {
  const params = new URLSearchParams([
    ...Object.entries({
      createdAt,
      from,
      to,
      type,
      offset: offset.toString(),
      limit: limit.toString()
    })
  ]).toString()

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/transactions?${params}`)

  return await response.json()
}

export function useInfiniteTransactions() {
  const [searchParams, setSearchParams] = useState({})

  const { data = { pages: [], pageParams: [] }, ...rest } = useInfiniteQuery<
    TransactionListItem[],
    Error,
    TransactionListItem[]
  >({
    queryKey: ['transactions', searchParams],
    queryFn: ({ pageParam = 0 }) => fetchTransactions({ offset: pageParam, ...searchParams }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length !== 10) return undefined

      return allPages.flat().length
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 3
  })

  const hasNextPage = useMemo(() => ([...data.pages].pop() || []).length === 10, [data.pages])
  const transactions = useMemo(() => data.pages.map((page) => page).flatMap((page) => page), [data])
  const hasItems = useMemo(() => transactions.length > 0, [transactions])

  return { transactions, hasNextPage, hasItems, setSearchParams, ...rest }
}
