'use client';
import PageDetailsImageCard from '@/components/cards/pageDetailsImageCard';
import TitleBar from '@/components/header/titleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import IconsListItemBasic from '@/components/cards/iconsListItemBasic';
import CardHead from '@/components/cards/cardHead';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
const StaffDetails = ({ params }: { params: { slug: string } }) => {
  const { schoolId } = useSchoolContext();
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const getSingleStaff = useGetSingleStaff(schoolId, params.staffId);
  const attachmentId = getSingleStaff.data?.data.photo?.attachmentId;
  const { data: imageUrl } = useViewAttachment(schoolId, attachmentId);
  useEffect(() => {
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  }, [imageUrl]);
  if (getSingleStaff.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSingleStaff.isError) {
    return <h1>Something went wrong...</h1>;
  }

  return (
    <div className="mt-5">
      {/* {JSON.stringify(getSingleCustomer.data.data)} */}
      {/* Titlebar */}

      <TitleBar title="Staff Details" />
      {/* Page banner */}
      <PageDetailsImageCard
        title={getSingleStaff.data.data.firstName}
        email={getSingleStaff.data.data.email}
        phone={getSingleStaff.data.data.mobileNumber}
        profileUrl={profileImageUrl}
      />
      <div className="flex my-5 gap-5">
        {/* Basic Customer Details */}
        <div className="w-1/3">
          <Card>
            <CardHeader className="pb-0 mb-0">
              <CardTitle classNmae="text-md text-xl">About</CardTitle>
              <CardDescription className="text-xs">
                <span className="font-semibold">Staff Id: </span>
                {getSingleStaff.data.data.staffId}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <IconsListItemBasic
                email={getSingleStaff.data.data.email}
                phone={getSingleStaff.data.data.mobileNumber}
                address={getSingleStaff.data.data.currentAddress.streetName}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-2/3">
          <div key={getSingleStaff.data.data.staffId}>
            <Card className="p-0 mb-10">
              <CardHead
                btnLink={`/admin/staffs/create?schoolId=${getSingleStaff.data.data.schoolId}&staffId=${getSingleStaff.data.data.staffId}`}
                btnName="Edit Staffs"
                image={getSingleStaff.data.data?.logoUrl}
                title={getSingleStaff.data.data.firstName}
                description={getSingleStaff.data.data.currentAddress.city}
              />
              <Separator className="my-4" />
              <div className="p-4 pt-0">
                <Image
                  src={getSingleStaff.data.data?.bannerUrl}
                  width="1500"
                  height="1500"
                  alt="Eduflow"
                  className="rounded-lg w-100 h-[300px] object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
