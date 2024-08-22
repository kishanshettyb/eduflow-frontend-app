import { CardHeadProps } from '@/types/common/cardTypes';
import { CircleChevronRight, MapPin } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import defaultImgUrl from '../../../public/slider/slide-1.jpeg';

function CardHead({ title, description, image, btnLink, btnName }: CardHeadProps) {
  return (
    <div className="flex justify-between items-center p-4 pb-0">
      <div className="flex items-center justify-start">
        <div>
          {image ? (
            <Image
              src={image}
              width="500"
              height="500"
              alt="Eduflow"
              className="rounded-full w-[70px] h-[70px] me-5 shadow-lg border border-slate-200"
            />
          ) : (
            <Image
              src={defaultImgUrl}
              width="500"
              height="500"
              alt="Eduflow"
              className="rounded-full w-[70px] h-[70px] me-5 shadow-lg border border-slate-200"
            />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 text-slate-600 text-sm m-10 block me-2" /> {description}
          </p>
        </div>
      </div>
      <div>
        <Link href={btnLink} alt={title}>
          <Button variant="outline">
            {btnName}
            <CircleChevronRight className="ms-3 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CardHead;
