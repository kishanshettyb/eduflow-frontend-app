import { NotFoundProps } from '@/types/common/notfoundTypes';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

const NotFound = ({ image, title, description, btnLink, btnName }: NotFoundProps) => (
  <div className="flex justify-center items-center w-full   flex-col">
    <div className=" border rounded-2xl w-1/2">
      <Image
        src={image}
        width="500"
        height="500"
        className="w-auto h-[300px] m-auto object-cover"
        alt={title}
      />
      <div className="my-5 text-center">
        <p className="text-2xl mb-2 font-semibold">{title}</p>
        <p className="text-md text-slte-600 mb-5">{description}</p>
        <Link href={btnLink}>
          <Button variant="default" className="mb-5">
            {btnName}
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
