import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {
  title: string;
  description: string;
  bgImageSrc: string;
  logoSrc: string;
  name: string;
  email: string;
  phone: string;
  profileUrl: string;
  onClick?: () => void;
};
import defaultImgUrl from '../../../public/slider/slide-1.jpeg';
const PageDetailsImageCard: React.FC<Props> = ({ title, profileUrl, email, phone }) => {
  return (
    <div className="bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.8),rgba(0,86,140,0.8)),url('https://images.unsplash.com/photo-1613896527026-f195d5c818ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center rounded-xl border border-slate-600 h-[300px] shadow">
      <div className="px-10 mt-36 flex justify-start items-center">
        <div>
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={title}
              width="500"
              height="500"
              className="rounded-full w-[140px] h-[140px] me-5 object-cover"
            />
          ) : (
            <Image
              src={defaultImgUrl}
              alt={title}
              width="500"
              height="500"
              className="rounded-full w-[140px] h-[140px] me-5 object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-xl mb-2 text-white text-bold">{title}</h1>
          <div className="flex gap-x-5">
            <span className="text-xs mb-1 text-slate-200 flex">
              <Mail className="me-2 h-4 w-4" />
              {email}
            </span>
            <span className="text-xs text-slate-200 flex">
              <Phone className="me-2 h-4 w-4" />
              {phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetailsImageCard;
