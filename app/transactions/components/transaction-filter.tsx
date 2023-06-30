import { AccountSearchInput } from '@/app/accounts/components/account-search-input'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface TransactionFilterProps {
  onSearchParams: (params: {
    createdAt?: string
    from?: string
    to?: string
    type?: string
  }) => void
}

export function TransactionFilter({ onSearchParams }: TransactionFilterProps) {
  const router = useRouter()

  return (
    <section className="flex flex-col gap-6 mb-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Search</h3>
        <Button variant="outline" onClick={() => router.push('/transactions/new')}>
          New Transaction
        </Button>
      </div>
      <div className="flex flex-row gap-4">
        <DatePicker onChange={(createdAt: string) => onSearchParams({ createdAt })} />

        <Select onValueChange={(type: string) => onSearchParams({ type })}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Type</SelectItem>
            <SelectItem value="withdraw">Withdraw</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>

        <AccountSearchInput
          inputProps={{
            id: 'from',
            name: 'from',
            placeholder: 'From (Name)'
          }}
          onChangeAccount={(value) => onSearchParams({ from: value })}
        />
        <AccountSearchInput
          inputProps={{
            id: 'to',
            name: 'to',
            placeholder: 'To (Name)'
          }}
          onChangeAccount={(value) => onSearchParams({ to: value })}
        />
      </div>
    </section>
  )
}
