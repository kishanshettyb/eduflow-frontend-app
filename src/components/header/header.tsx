import Image from 'next/image';
import React from 'react';
import { PrimaryMenu } from '../menu/primarymenu';
import { Button } from '../ui/button';
import { Fingerprint } from 'lucide-react';
import Link from 'next/link';

function Header() {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-700 border border-slate-100 border-t-0 border-l-0 border-r-0 dark:border-b-slate-800">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image
              src="/eduflowicon.png"
              width={100}
              height={100}
              className="h-12 w-auto"
              alt="Flowbite Logo"
            />
            <span className="self-center text-3xl font-semibold whitespace-nowrap text-slate-800 dark:text-white tracking-wide">
              eduflow
            </span>
          </a>
          <div>
            <PrimaryMenu />
          </div>
          <div>
            <Link href="/auth/login">
              <Button variant="default">
                <Fingerprint className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
