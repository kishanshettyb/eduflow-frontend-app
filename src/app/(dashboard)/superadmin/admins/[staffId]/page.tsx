'use client';
import PageDetailsImageCard from '@/components/cards/pageDetailsImageCard';
import TitleBar from '@/components/header/titleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import IconsListItemBasic from '@/components/cards/iconsListItemBasic';
import CardHead from '@/components/cards/cardHead';

import { useGetSingleAdmin } from '@/services/queries/superadmin/admins';
import { useSearchParams } from 'next/navigation';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
const AdminDetails = ({ params }: { params: { slug: string } }) => {
  const search = useSearchParams();

  const schoolId: number = search?.get('schoolId');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const getSingleAdmin = useGetSingleAdmin(schoolId, params.staffId);

  const attachmentId = getSingleAdmin.data?.data.photo?.attachmentId;
  const { data: imageUrl } = useViewAttachment(schoolId, attachmentId);
  useEffect(() => {
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  }, [imageUrl]);
  if (getSingleAdmin.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSingleAdmin.isError) {
    return <h1>Something went wrong...</h1>;
  }

  return (
    <div className="mt-5">
      {/* {JSON.stringify(getSingleCustomer.data.data)} */}
      {/* Titlebar */}

      <TitleBar title="Admin Details" />
      {/* Page banner */}
      <PageDetailsImageCard
        title={getSingleAdmin.data.data.firstName}
        email={getSingleAdmin.data.data.email}
        phone={getSingleAdmin.data.data.mobileNumber}
        profileUrl={profileImageUrl}
      />
      <div className="flex my-5 gap-5">
        {/* Basic Customer Details */}
        <div className="w-1/3">
          <Card>
            <CardHeader className="pb-0 mb-0">
              <CardTitle classNmae="text-md text-xl">About</CardTitle>
              <CardDescription className="text-xs">
                <span className="font-semibold">Admin Id: </span>
                {getSingleAdmin.data.data.staffId}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <IconsListItemBasic
                email={getSingleAdmin.data.data.email}
                phone={getSingleAdmin.data.data.mobileNumber}
                address={getSingleAdmin.data.data.currentAddress.streetName}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-2/3">
          <div key={getSingleAdmin.data.data.staffId}>
            <Card className="p-0 mb-10">
              <CardHead
                btnLink={`/superadmin/admins/create?schoolId=${getSingleAdmin.data.data.schoolId}&staffId=${getSingleAdmin.data.data.staffId}`}
                btnName="Edit Admin"
                image={getSingleAdmin.data.data?.logoUrl}
                title={getSingleAdmin.data.data.firstName}
                description={getSingleAdmin.data.data.currentAddress.city}
              />
              <Separator className="my-4" />
              <div className="p-4 pt-0">
                {getSingleAdmin.data.data?.bannerUrl !== undefined ? (
                  <Image
                    src={getSingleAdmin.data.data?.bannerUrl}
                    width="1500"
                    height="1500"
                    alt="Eduflow"
                    className="rounded-lg w-100 h-[300px] object-cover"
                  />
                ) : (
                  <Image
                    src="/slider/slide-1.jpeg"
                    width="1500"
                    height="1500"
                    alt="Eduflow"
                    className="rounded-lg w-100 h-[300px] object-cover"
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
