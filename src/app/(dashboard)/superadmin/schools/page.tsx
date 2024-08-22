'use client';

import Autoplay from 'embla-carousel-autoplay';
import ImageCard from '@/components/cards/imageCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import TitleBar from '@/components/header/titleBar';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGetAllSchools } from '@/services/queries/superadmin/schools';
import { Eye } from 'lucide-react';
import NotFound from '@/components/notfound/notfound';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

function Schools() {
  const plugin = React.useRef(Autoplay({ delay: 3000, duration: 5000, stopOnInteraction: true }));
  const getSchools = useGetAllSchools();

  if (getSchools.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSchools.isError) {
    return <h1>Something went wrong...</h1>;
  }

  let sortedData = [];
  if (getSchools.data && Array.isArray(getSchools.data.data)) {
    sortedData = [...getSchools.data.data].sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
    );
  }
  const schoolsAvailable =
    getSchools.data && Array.isArray(getSchools.data.data) && getSchools.data.data.length > 0;

  const schoolsToShow = sortedData.slice(0, 10);

  const ImageCardWithAttachment = ({ school }) => {
    const attachmentData = useViewAttachment(school.schoolId, school?.photo?.attachmentId);
    const bgImageSrc = attachmentData.isSuccess ? attachmentData.data : null;
    console.log('bgImageSrc' + bgImageSrc);
    return (
      <ImageCard
        id={school.schoolId}
        title={school.schoolName}
        description={school.address.place}
        bgImageSrc={bgImageSrc}
        logoSrc={bgImageSrc}
        name={school.contactPerson}
        email={school.emailId}
        phone={school.contactNumber}
        place={school.address.city}
        uniqueCode={school.uniqueCode}
        cardLink={process.env.NEXT_PUBLIC_SCHOOLS_URL}
        listTitle="School Info"
      />
    );
  };

  return (
    <div className="mt-5">
      <TitleBar title="Schools" btnLink="/superadmin/schools/create" btnName="Create School" />
      <div className="flex-col ">
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {schoolsToShow.map((school) => (
              <CarouselItem
                className="basis-full md:basis-1/3 xl:basis-1/4 2xl:basis-1/4 mb-5"
                key={school.schoolId}
              >
                <ImageCardWithAttachment school={school} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="mb-60">
        {!schoolsAvailable && (
          <NotFound
            image="/Nodata.svg"
            title="Sorry No Schools Found!!!"
            description="Please click the below button to create School"
            btnLink="/superadmin/schools/create"
            btnName="Create Schools"
          />
        )}
        {schoolsAvailable && (
          <div className="text-center">
            <Link href="/superadmin/schools/viewall">
              <Button variant="outline" size="sm">
                <Eye className="w-5 h-5 me-3" />
                View All Schools
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schools;
