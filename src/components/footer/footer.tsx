import Image from 'next/image';
import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-50   border-b-0 border-l-0 border-r-0 border border-t-slate-200 dark:border-t-slate-800 dark:bg-gray-950 w-full">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <Image
              src="/eduflowicon.png"
              width={100}
              height={100}
              className="h-12 w-auto"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-800 dark:text-white tracking-wide">
              eduflow
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-900 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{' '}
          <a href="#" className="hover:underline">
            Inflowsol Pvt. Ltd.{' '}
          </a>
          All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
