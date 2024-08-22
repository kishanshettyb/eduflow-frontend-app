import React from 'react';
import { Card } from '../ui/card';
import { InfoCountCardProps } from '@/types/common/cardTypes';
import Image from 'next/image';
import Link from 'next/link';

function InfoCountCard({
  title,
  description,
  imageUrl,
  blueBg,
  greenBg,
  cardLink,
  isLoading
}: InfoCountCardProps & { isLoading: boolean }) {
  return (
    <Link href={cardLink + ''}>
      <Card
        className={
          isLoading
            ? 'bg-gray-200 p-10 rounded-2xl flex justify-center items-center flex-col cursor-pointer animate-pulse'
            : blueBg
              ? 'bg-gradient-to-r from-blue-300 to-blue-200 p-10 rounded-2xl flex justify-center items-center flex-col hover:shadow-lg cursor-pointer'
              : greenBg
                ? 'bg-gradient-to-r from-green-300 to-green-200 p-10 rounded-2xl flex justify-center items-center flex-col hover:shadow-lg cursor-pointer'
                : 'bg-gradient-to-r from-yellow-300 to-yellow-200 p-10 rounded-2xl flex justify-center items-center flex-col hover:shadow-lg cursor-pointer'
        }
      >
        <div
          className={
            blueBg
              ? 'w-[100px] h-[100px] flex justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-blue-300 shadow mb-5'
              : greenBg
                ? 'w-[100px] h-[100px] flex justify-center items-center rounded-full bg-gradient-to-r from-green-500 to-green-300 shadow mb-5'
                : 'w-[100px] h-[100px] flex justify-center items-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 shadow mb-5'
          }
        >
          <Image width="50" height="50" src={imageUrl} alt={title} />
        </div>
        <h2
          className={
            blueBg
              ? 'mb-1 text-3xl font-bold text-blue-900'
              : greenBg
                ? 'mb-1 text-3xl font-bold text-green-900'
                : 'mb-1 text-3xl font-bold text-yellow-900'
          }
        >
          {title}
        </h2>
        <p className={blueBg ? 'text-blue-700' : greenBg ? 'text-green-700' : 'text-yellow-700'}>
          {description}
        </p>
      </Card>
    </Link>
  );
}

export default InfoCountCard;
