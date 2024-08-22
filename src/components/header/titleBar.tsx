'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SortMenu } from '../menu/sortMenu';

type TitleBarProps = {
  title: string;
  btnLink?: string;
  btnName?: string;
  search?: boolean;
  sort?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSort?: (term: string) => void;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (term: string) => void;
  placeholder?: string;
  modal?: boolean;
  // eslint-disable-next-line no-unused-vars
  onButtonClick?: () => void;
  showButton?: boolean;
};

function TitleBar({
  title,
  btnLink,
  btnName,
  search,
  sort,
  placeholder,
  onSearch,
  onSort,
  modal = false,
  onButtonClick,
  showButton = true
}: TitleBarProps) {
  const pathname = usePathname();
  const breadcrumb = pathname.replace(/^\//, '').replace(/\//g, ' > ');

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  // const handleSort = (sortOrder: 'asc' | 'desc') => {
  //   setSortOrder(sortOrder);
  //   onSort(sortOrder);
  // };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <>
      {title && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-0">
              {title}
            </h2>
            <ul className="list-none flex items-center mt-1">
              <li>
                <Link
                  href={pathname}
                  className="text-xs capitalize text-slate-400 dark:text-slate-200"
                >
                  {breadcrumb}
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full md:w-auto">
            <div className="flex-1 flex items-end justify-end md:justify-start gap-4">
              {sort && (
                <div>
                  <SortMenu onSort={onSort} />
                </div>
              )}
              {search && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full max-w-xs md:max-w-sm"
                  />
                </div>
              )}
            </div>
            {showButton &&
              btnName &&
              (modal || btnLink) &&
              (modal ? (
                <Button onClick={handleButtonClick} className="w-full md:w-auto">
                  <Plus className="me-2 w-5 h-5" /> {btnName}
                </Button>
              ) : (
                btnLink && (
                  <Link href={btnLink} className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">
                      <Plus className="me-2 w-5 h-5" /> {btnName}
                    </Button>
                  </Link>
                )
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default TitleBar;
