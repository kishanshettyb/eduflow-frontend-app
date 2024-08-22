'use client';

import Link from 'next/link';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardImage, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import IconListItems from './iconListItems';
import { ImgCardProps } from '@/types/common/cardTypes';

const defaultBg = '/slider/slide-1.jpeg';
const ImageCard: React.FC<ImgCardProps> = ({
  title,
  id,
  place,
  bgImageSrc,
  logoSrc,
  name,
  email,
  phone,
  uniqueCode,
  cardLink,
  listTitle
}) => {
  return (
    <Link href={cardLink + String(id)}>
      <Card className="w-full  bg-white dark:bg-slate-900  hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 cursor-pointer">
        {bgImageSrc == null || bgImageSrc == '' ? (
          <div className="relative">
            <CardImage
              className="rounded-lg w-full h-[180px] object-cover"
              alt="Eduflow"
              src={defaultBg}
              width="300"
              height="300"
            />
            {uniqueCode ? (
              <div className="absolute right-3 top-3">
                <Badge className="font-normal">School Code: {uniqueCode}</Badge>
              </div>
            ) : (
              <p>{''}</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <CardImage
              src={`${bgImageSrc}`}
              alt={title}
              width="300"
              height="300"
              className="rounded-lg w-full h-[180px] object-cover"
            />
            {uniqueCode ? (
              <div className="absolute top-3 right-3">
                <Badge className="font-normal">School Code: {uniqueCode}</Badge>
              </div>
            ) : (
              <p>{''}</p>
            )}
          </div>
        )}
        <CardContent className="m-0 p-0">
          <IconListItems listTitle={listTitle} name={name} email={email} phone={phone} />
          <div>
            {(title == null || title == '') && (place == null || place == '') ? (
              <div className="h-[85px] flex  items-center justify-center">
                <Badge className="bg-blue-300 px-4 py-2">School not found</Badge>
              </div>
            ) : (
              <div className="flex gap-3 justify-start items-start h-[84px] p-3">
                <div>
                  {logoSrc == null || logoSrc == '' ? (
                    <CardImage
                      width="50"
                      height="50"
                      src={defaultBg}
                      alt="eduflow"
                      className="rounded-full min-w-[45px] h-[45px]  bg-cover border"
                    />
                  ) : (
                    <CardImage
                      width="50"
                      height="50"
                      alt={title}
                      src={`${logoSrc}`}
                      className="rounded-full min-w-[45px] h-[45px] bg-cover border"
                    />
                  )}
                </div>
                <div>
                  <CardTitle className="mb-1 text-sm   text-slate-700 dark:text-slate-300">
                    {title}
                  </CardTitle>
                  <CardDescription className="mb-0 flex text-xs items-center justify-start">
                    <MapPin className="me-1 w-4 h-4" />
                    {place}
                  </CardDescription>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ImageCard;
