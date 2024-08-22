'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowDownUp } from 'lucide-react';

type SortMenuProps = {
  onSort: string;
};
export function SortMenu({ onSort }: SortMenuProps) {
  const [ascending, setAscending] = React.useState(true);

  const handleClick = () => {
    setAscending(!ascending);
    onSort(ascending ? 'desc' : 'asc');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowDownUp className="w-4 h-4 me-3" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <button
          className="flex items-center w-full py-2 px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleClick}
        >
          <ArrowDownUp className={`w-4 h-4 me-2 ${ascending ? '' : 'transform rotate-180'}`} />
          {ascending ? 'Ascending' : 'Descending'}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
