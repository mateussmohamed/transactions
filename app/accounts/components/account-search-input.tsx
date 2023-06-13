import { CommandInput } from 'cmdk'
import { ComponentPropsWithoutRef, useState } from 'react'
// @ts-ignore
import { Check, Loader2, User2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Account } from '@/database/types'
import { cn } from '@/lib/utils'
import { useFetchAccounts } from '../hooks/use-fetch-accounts'

interface AccountSearchInputProps {
  onChangeAccount?: (value: string) => void
  onSelectAccount?: (account: Partial<Account>) => void
  inputProps: ComponentPropsWithoutRef<'input'>
}

export function AccountSearchInput({
  onChangeAccount,
  onSelectAccount,
  inputProps
}: AccountSearchInputProps) {
  const [enabled, toggleEnabled] = useState(false)
  const [value, setValue] = useState('')

  const {
    accountOptions,
    accounts,
    isLoading,
    isRefetching,
    isFetching,
    searchTerm,
    setSearchTerm
  } = useFetchAccounts({ enabled })

  const selectedValue = value
    ? accountOptions.find((item: any) => item.value === value)?.label
    : inputProps.placeholder ?? ''

  return (
    <Popover open={enabled} onOpenChange={toggleEnabled}>
      <PopoverTrigger asChild className="flex-1 w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={enabled}
          className="flex-1 w-full justify-between"
        >
          {selectedValue}
          <User2Icon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white flex-1 p-0">
        <Command shouldFilter={false} className="p-2">
          <CommandInput
            {...inputProps}
            autoComplete="off"
            className="p-2"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="py-2">
            <CommandEmpty>No customers found.</CommandEmpty>

            {(isLoading || isRefetching || isFetching) && (
              <CommandItem className="flex gap-2 justify-center">
                Fetching... <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              </CommandItem>
            )}

            {accountOptions.length > 0 ? (
              <CommandGroup>
                {accountOptions.map((item: any) => (
                  <CommandItem
                    className="py-3"
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      const nextValue = currentValue === value ? '' : currentValue
                      toggleEnabled(false)
                      setValue(nextValue)

                      if (onChangeAccount) onChangeAccount(nextValue)
                      if (onSelectAccount && nextValue)
                        onSelectAccount(accounts.find((item) => item.id === nextValue) || {})
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
