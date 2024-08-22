import { IconListItemsProps } from '@/types/common/cardTypes';
import { Mail, Phone, User } from 'lucide-react';
import React from 'react';

function IconListItems({ listTitle, name, email, phone }: IconListItemsProps) {
  return (
    <ul className="border p-3 border-b-slate-200 dark:border-b-slate-800 pb-2 mb-2 border-l-0 border-r-0 border-t-0">
      {listTitle != null ? (
        <li className="flex text-slate-950 dark:text-slate-200  text-sm  justify-start mb-4">
          {listTitle}
        </li>
      ) : (
        ''
      )}
      {name != null ? (
        <li className="flex items-center justify-start mb-2">
          <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-200 flex items-center justify-center me-3">
            <User className="w-3 h-3 inline-flex mb-0 text-blue-600" />
          </span>
          <p className="text-xs  text-slate-600 dark:text-slate-100">{name}</p>
        </li>
      ) : (
        ''
      )}
      {email != null ? (
        <li className="flex items-center justify-start mb-2">
          <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-200 flex items-center justify-center me-3">
            <Mail className="w-3 h-3 inline-flex mb-0 text-blue-600" />
          </span>
          <p className="text-xs  text-slate-600 dark:text-slate-100">{email}</p>
        </li>
      ) : (
        ''
      )}
      {phone != null ? (
        <li className="flex items-center justify-start mb-0">
          <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-200 flex items-center justify-center me-3">
            <Phone className="w-3 h-3 inline-flex mb-0 text-blue-600" />
          </span>
          <p className="text-xs  text-slate-600 dark:text-slate-100">{phone}</p>
        </li>
      ) : (
        ''
      )}
    </ul>
  );
}

export default IconListItems;
