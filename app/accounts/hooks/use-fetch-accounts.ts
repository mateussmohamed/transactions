import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
// @ts-ignore
import { useDebounce } from '@uidotdev/usehooks'

import { Account } from '@/database/types'
import { env } from '@/lib/env.mjs'

const fetchAccounts = async (name = '') => {
  let url = `${env.NEXT_PUBLIC_API_URL}/accounts`

  if (name) url += `?name=${name}`

  const response = await fetch(url)
  const accounts = await response.json()

  return accounts
}

export function useFetchAccounts({ enabled = false }) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data = [], ...rest } = useQuery<Account[]>({
    enabled,
    queryKey: ['accounts', debouncedSearchTerm],
    queryFn: () => fetchAccounts(debouncedSearchTerm),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 3
  })

  const accountOptions = data.map((item) => ({
    value: item.id,
    label: item.name
  }))

  return { accounts: data, accountOptions, searchTerm, setSearchTerm, ...rest }
}
