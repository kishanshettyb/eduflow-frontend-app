import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowDownUp } from 'lucide-react';

function SortData() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ArrowDownUp className="w-4 h-4 me-2" />
            Sort By
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>ASC</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>DES</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Created Date</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SortData;
