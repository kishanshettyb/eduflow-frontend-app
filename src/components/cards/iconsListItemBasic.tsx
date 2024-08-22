import { IconListItemsProps } from '@/types/common/cardTypes';
import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ReceiptIndianRupee,
  Key,
  QrCode,
  Calendar,
  KeyIcon,
  User
} from 'lucide-react';

function IconsListItemBasic({
  email,
  gst,
  phone,
  website,
  address,
  schoolcode,
  username,
  dob,
  id,
  contactPerson
}: IconListItemsProps) {
  return (
    <ul className="py-2 m-0">
      {id != null ? (
        <li className="   py-3 flex  items-center">
          <KeyIcon className="w-4 h-4 text-slate-900 m-10 block me-3" />
          <p className="text-slate-900 text-sm dark:text-slate-300">
            <span className="font-semibold">Customer Id: </span>
            <span>#000{id}</span>
          </p>
        </li>
      ) : (
        ''
      )}
      {phone != null ? (
        <li className="   py-3 flex  items-center">
          <Phone className="w-4 h-4 text-slate-900 m-10 block me-3" />
          <a className="text-slate-900 text-sm dark:text-slate-300" href="tel:+91 9900990099">
            <span className="font-semibold">Phone: </span>
            {phone}
          </a>
        </li>
      ) : (
        ''
      )}
      {email != null ? (
        <li className="   py-3 flex  items-center">
          <Mail className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <a
            className="text-slate-900 text-sm dark:text-slate-300"
            href="mailto:info@pesuniversity.com"
          >
            <span className="font-semibold">Email: </span>

            {email}
          </a>
        </li>
      ) : (
        ''
      )}
      {address != null ? (
        <li className="   py-3 flex justify-start items-start">
          <MapPin className="w-4 h-4 text-slate-900 m-10 block me-3 mt-1" />
          <a className="text-slate-900 text-sm dark:text-slate-300" href="#">
            <span className="font-semibold">Address: </span>

            {address}
          </a>
        </li>
      ) : (
        ''
      )}
      {dob != null ? (
        <li className="   py-3 flex  items-center">
          <Calendar className="w-4 h-4 text-slate-900 m-10 block me-3" />
          <p className="text-slate-900 text-sm dark:text-slate-300">
            <span className="font-semibold">Date of Birth: </span>
            {dob}
          </p>
        </li>
      ) : (
        ''
      )}
      {website != null ? (
        <li className="py-3 flex items-center">
          <Globe className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <a
            className="text-slate-900 text-sm dark:text-slate-300"
            href="mailto:info@pesuniversity.com"
          >
            {website}
          </a>
        </li>
      ) : (
        ''
      )}
      {gst != null ? (
        <li className="py-3 flex items-center">
          <ReceiptIndianRupee className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <a
            className="text-slate-900 text-sm dark:text-slate-300"
            href="mailto:info@pesuniversity.com"
          >
            <span className="font-semibold text-sm dark:text-slate-300">GST:</span> {gst}
          </a>
        </li>
      ) : (
        ''
      )}
      {username != null ? (
        <li className="py-3 flex items-center">
          <Key className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <a
            className="text-slate-900 text-sm dark:text-slate-300"
            href="mailto:info@pesuniversity.com"
          >
            <span className="font-semibold text-sm dark:text-slate-300">Username:</span> {username}
          </a>
        </li>
      ) : (
        ''
      )}
      {schoolcode != null ? (
        <li className="py-3 flex items-center">
          <QrCode className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <a
            className="text-slate-900 text-sm dark:text-slate-300"
            href="mailto:info@pesuniversity.com"
          >
            <span className="font-semibold text-sm dark:text-slate-300">School Code:</span>{' '}
            {schoolcode}
          </a>
        </li>
      ) : (
        ''
      )}
      {contactPerson != null ? (
        <li className="py-3 flex items-center">
          <User className="w-4 h-4 text-slate-900 m-10 block me-3 " />
          <p className="text-slate-900 text-sm dark:text-slate-300">
            <span className="font-semibold text-sm dark:text-slate-300">Contact Person:</span>{' '}
            {contactPerson}
          </p>
        </li>
      ) : (
        ''
      )}
    </ul>
  );
}

export default IconsListItemBasic;
