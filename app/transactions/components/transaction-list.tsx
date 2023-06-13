import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TransactionListItem } from '@/database/types'
import { parseISO } from 'date-fns'
import { ArrowDownLeftIcon, ArrowLeftRight, ArrowUpRightIcon, Loader2 } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TransactionListProps {
  transactions: TransactionListItem[]
  isLoading: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const isEmpty = transactions.length === 0

  return (
    <div className="overflow-hidden">
      <Table className="min-h-[200px]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty || isLoading ? (
            <TableRow className="p-0 border-none">
              <TableCell className="border-none text-center" colSpan={6}>
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  </div>
                ) : null}

                {isEmpty && !isLoading ? 'No results.' : null}
              </TableCell>
            </TableRow>
          ) : null}
          {transactions.map(({ id, amount, from, to, type, createdAt }) => (
            <TableRow key={id}>
              <TableCell className="font-bold whitespace-nowrap p-4">
                {parseISO(String(createdAt)).toLocaleString()}
              </TableCell>
              <TableCell className="font-bold whitespace-nowrap p-4">{id}</TableCell>
              <TableCell className="font-bold whitespace-nowrap p-4">{amount}</TableCell>
              <TableCell className="font-bold whitespace-nowrap p-4">{from?.name}</TableCell>
              <TableCell className="font-bold whitespace-nowrap p-4">{to?.name}</TableCell>
              <TableCell className="font-bold whitespace-nowrap p-4 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {type === 'withdraw' ? (
                        <ArrowUpRightIcon className="h-7 w-7 text-red-600" />
                      ) : null}

                      {type === 'deposit' ? (
                        <ArrowDownLeftIcon className="h-7 w-7 text-green-600" />
                      ) : null}

                      {type === 'transfer' ? (
                        <ArrowLeftRight className="h-7 w-7 text-blue-600" />
                      ) : null}
                    </TooltipTrigger>
                    <TooltipContent>{type === 'withdraw' ? 'Withdraw' : 'Deposit'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
