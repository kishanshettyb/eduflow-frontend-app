'use client';
import PageDetailsImageCard from '@/components/cards/pageDetailsImageCard';
import TitleBar from '@/components/header/titleBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import IconsListItemBasic from '@/components/cards/iconsListItemBasic';
import CardHead from '@/components/cards/cardHead';
import { useGetSingleSchool } from '@/services/queries/superadmin/schools';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

const SchoolDetails = ({ params }: { params: { slug: string } }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const getSingleSchool = useGetSingleSchool(params.schoolId);

  const attachmentId = getSingleSchool.data?.data.photo?.attachmentId;

  const { data: imageUrl } = useViewAttachment(params.schoolId, attachmentId);

  useEffect(() => {
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  }, [imageUrl]);

  if (getSingleSchool.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSingleSchool.isError) {
    return <h1>Something went wrong...</h1>;
  }

  const schoolData = getSingleSchool.data.data;

  return (
    <div className="mt-5">
      {/* Titlebar */}
      <TitleBar title="School Details" />
      {/* Page banner */}
      <PageDetailsImageCard
        title={schoolData.schoolName}
        email={schoolData.emailId}
        phone={schoolData.contactNumber}
        profileUrl={profileImageUrl || schoolData.logoUrl}
        bgUrl={schoolData?.bannerUrl}
      />
      <div className="flex my-5 gap-5">
        {/* Basic Customer Details */}
        <div className="w-2/3">
          <div key={schoolData.schoolId}>
            <Card className="p-0 mb-10">
              <CardHead
                btnLink={`/superadmin/schools/create?schoolId=${schoolData.schoolId}`}
                btnName="Edit school"
                image={profileImageUrl || schoolData?.logoUrl}
                title={schoolData.schoolName}
                description={schoolData.address.city}
              />
              <Separator className="my-4" />
              <div className="grid grid-cols-2">
                <div className="pb-5 mx-4">
                  <Card>
                    <CardHeader className="pb-0 mb-0">
                      <CardTitle className="font-semibold text-lg">Basic Details:</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-0">
                      <IconsListItemBasic
                        contactPerson={schoolData.contactPerson}
                        schoolcode={schoolData.uniqueCode}
                        email={schoolData.emailId}
                        phone={schoolData.contactNumber}
                        address={schoolData.address.streetName}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="mx-4 mb-4">
                  <Card>
                    <CardHeader className="pb-0 mb-0">
                      <CardTitle className="font-semibold text-lg">School Basic Details:</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-0">
                      <IconsListItemBasic
                        email={schoolData.emailId}
                        phone={schoolData.contactNumber}
                        address={`${schoolData.address.streetName}, ${schoolData.address.city}, ${schoolData.address.pinCode}, ${schoolData.address.state}`}
                        website="https://example.com"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default SchoolDetails;
