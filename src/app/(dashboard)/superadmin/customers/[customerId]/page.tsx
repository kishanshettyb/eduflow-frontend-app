'use client';

import CardHead from '@/components/cards/cardHead';
import IconsListItemBasic from '@/components/cards/iconsListItemBasic';
// import Image from 'next/image';
import PageDetailsImageCard from '@/components/cards/pageDetailsImageCard';
import React from 'react';
import TitleBar from '@/components/header/titleBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetSingleCustomer } from '@/services/queries/superadmin/cutomer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import NotFound from '@/components/notfound/notfound';

const CustomerDetails = ({ params }: { params: { slug: string } }) => {
  const getSingleCustomer = useGetSingleCustomer(params.customerId);

  if (getSingleCustomer.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSingleCustomer.isError) {
    return <h1>Something went wrong...</h1>;
  }

  return (
    <div className="mt-5">
      {/* Titlebar */}
      <TitleBar title="Institution Details" />
      {/* Page banner */}
      <PageDetailsImageCard
        title={getSingleCustomer.data.data.firstName + ' ' + getSingleCustomer.data.data.lastName}
        email={getSingleCustomer.data.data.email}
        phone={getSingleCustomer.data.data.mobileNumber}
        // profileUrl={getSingleCustomer.data.data.imageUrl}
      />
      <div className="flex my-5 gap-5">
        {/* School Details: Multiple schools will display here  */}
        <div className="w-2/3">
          {getSingleCustomer.data.data.schoolList.length === 0 ? (
            <NotFound
              image="/Nodata.svg"
              title="No Schools found"
              description="Please click below to add school"
              btnLink="/superadmin/schools/create"
              btnName="Create School"
            />
          ) : (
            getSingleCustomer.data.data.schoolList.map(function (item) {
              return (
                <div key={item.schoolId}>
                  <Card className="p-0 mb-10">
                    <CardHead
                      btnLink={`/superadmin/schools/${item.schoolId}`}
                      btnName="More Details"
                      // image={item.logoUrl}
                      title={item.schoolName}
                      description={item.address.city}
                    />
                    <Separator className="my-4" />
                    <div className="p-4 pt-0">
                      {/* <Image
                        src={item.bannerUrl}
                        width="1500"
                        height="1500"
                        alt="Eduflow"
                        className="rounded-lg w-100 h-[300px] object-cover"
                      /> */}
                    </div>
                    <div className="grid grid-cols-2 ">
                      <div className="mx-4 mb-4">
                        <Card>
                          <CardHeader className="pb-0 mb-0">
                            <CardTitle className="font-semibold text-lg">
                              School Basic Details:
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 pb-0">
                            <IconsListItemBasic
                              email={item.emailId}
                              phone={item.contactNumber}
                              address={
                                item.address.streetName +
                                ', ' +
                                item.address.city +
                                ', ' +
                                item.address.pinCode +
                                ', ' +
                                item.address.state
                              }
                            />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="pb-5 mx-4 ">
                        <Card>
                          <CardHeader className="pb-0 mb-0">
                            <CardTitle className="font-semibold text-lg">
                              Advanced Details:
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 pb-0">
                            <IconsListItemBasic
                              gst={item.gstNumber}
                              schoolcode={item.uniqueCode}
                              username={item.uniqueCode}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
        {/* Basic Customer Details */}
        <div className="w-1/3">
          <Card>
            <CardHeader className="pb-0 mb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle classNmae="text-md text-xl">Institutions Info</CardTitle>
                </div>
                <div>
                  <Link
                    href={
                      '/superadmin/customers/create?customerId=' +
                      getSingleCustomer.data.data.customerId
                    }
                  >
                    <Button variant="outline" sie="sm">
                      <Edit className="me-2 w-4 h-4" />
                      Edit{' '}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <IconsListItemBasic
                email={getSingleCustomer.data.data.email}
                phone={getSingleCustomer.data.data.mobileNumber}
                address={getSingleCustomer.data.data.currentAddress.streetName}
                dob={getSingleCustomer.data.data.dateOfBirth}
                id={getSingleCustomer.data.data.customerId}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
