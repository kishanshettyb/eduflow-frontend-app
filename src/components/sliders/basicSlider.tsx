'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import sliderImage from '../../../public/slider/slide-1.jpeg';

export function BasicSlider() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card className="rounded-2xl">
              <Image
                width="600"
                height="300"
                src={sliderImage}
                alt="eduflow"
                priority
                className="w-full h-64 rounded-2xl"
              />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
