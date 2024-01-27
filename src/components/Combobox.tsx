import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxProps<T extends string> = {
  options: Combobox.Option<T>[];
  placeholder?: {
    search: string;
    select: string;
  };
  onChange?: (value?: T) => void;
};

const DEFAULT_PLACEHOLDERS: ComboboxProps<any>['placeholder'] = {
  search: 'Search options...',
  select: 'Select an option...',
};

export function Combobox<T extends string>({
  options,
  placeholder = DEFAULT_PLACEHOLDERS,
  onChange,
}: ComboboxProps<T>) {
  const placeholders = placeholder ?? {
    search: 'Search options...',
    select: 'Select an option...',
  };

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {value ? options.find((option) => option.value === value)?.label : placeholders.select}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholders.search} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  const newValue: T | undefined = option.value === value ? undefined : option.value;
                  setValue(newValue ?? '');
                  setOpen(false);
                  onChange?.(newValue);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export namespace Combobox {
  export type Option<T extends string> = {
    value: T;
    label: string;
  };
}
