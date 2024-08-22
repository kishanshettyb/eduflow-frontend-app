'use client';
import Autoplay from 'embla-carousel-autoplay';
import ImageCard from '@/components/cards/imageCard';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Eye } from 'lucide-react';
import TitleBar from '@/components/header/titleBar';
import { useGetAllCustomers } from '@/services/queries/superadmin/cutomer';
import Link from 'next/link';
import {
  // BarChart,
  // Bar,
  // XAxis,
  // YAxis,
  Tooltip,
  // Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';
import NotFound from '@/components/notfound/notfound';
// import { NewBarChart } from '@/components/charts/newBarChart';

function Institutions() {
  const plugin = React.useRef(Autoplay({ delay: 3000, duration: 5000, stopOnInteraction: true }));
  const getCustomers = useGetAllCustomers();

  const chartData =
    getCustomers.data && Array.isArray(getCustomers.data.data)
      ? getCustomers.data.data.map((customer) => ({
          name: `${customer.firstName} ${customer.lastName}`,
          schools: customer.schoolList.length
        }))
      : [];

  if (getCustomers.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getCustomers.isError) {
    return <h1>Something went wrong...</h1>;
  }

  let sortedData: string | unknown[] = [];
  if (getCustomers.data && Array.isArray(getCustomers.data.data)) {
    sortedData = [...getCustomers.data.data].sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
    );
  }
  const customerAvailable =
    getCustomers.data && Array.isArray(getCustomers.data.data) && getCustomers.data.data.length > 0;

  const customersToShow = sortedData.slice(0, 10);

  chartData.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="my-5">
      <TitleBar
        title="Institutions"
        btnLink="/superadmin/customers/create"
        btnName="Create Institution"
      />
      <div className="mb-0">
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent className="mb-10">
            {Array.isArray(getCustomers.data.data) &&
              customersToShow.map(function (item) {
                return (
                  <CarouselItem
                    className="basis-full md:basis-1/3 xl:basis-1/4 2xl:basis-1/4"
                    key={item.customerId}
                  >
                    <ImageCard
                      id={item.customerId}
                      title={
                        item.schoolList.length > 1
                          ? item.schoolList.length > 0 &&
                            `${item.schoolList[0].schoolName} (${item.schoolList.length - 1}+ schools)`
                          : item.schoolList.length > 0 && item.schoolList[0].schoolName
                      }
                      description={item.place}
                      // bgImageSrc={item.schoolList.map(function (school) {
                      //   return school.bannerUrl;
                      // })}
                      // logoSrc={item.schoolList.map(function (school) {
                      //   return school.logoUrl;
                      // })}
                      name={item.firstName}
                      email={item.email}
                      phone={item.mobileNumber}
                      place={item.schoolList.length > 0 && [item.schoolList[0].address.city]}
                      cardLink={process.env.NEXT_PUBLIC_CUSTOMERS_URL}
                    />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
        </Carousel>
      </div>
      {!customerAvailable && (
        <NotFound
          image="/Nodata.svg"
          title="Institution"
          description="Please add Institution"
          btnLink="/superadmin/customers/create"
          btnName="Create Institution"
        />
      )}
      {customerAvailable && (
        <div className="text-center">
          <Link href="/superadmin/customers/viewall">
            <Button variant="outline" size="sm">
              <Eye className="w-5 h-5 me-3" />
              View All Instiution
            </Button>
          </Link>
        </div>
      )}
      {chartData.length > 0 && (
        <div className="flex gap-10 justify-between my-20 md:grid-rows-1 hidden ">
          <div className="w-1/2">
            <div className="px-15 py-10 border shadow rounded-2xl p-10">
              <h1 className="text-md font-semibold mb-10 text-slate-600 ">
                Number of Schools per Institution
              </h1>
              {/* <NewBarChart /> */}

              {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="schools" fill="#3f51b5" />
                </BarChart> 
              </ResponsiveContainer> */}
            </div>
          </div>
          <div className="w-1/2">
            <div className="px-15 py-10 border shadow rounded-2xl p-10">
              <h1 className="text-md font-semibold mb-10 text-slate-600 ">
                Percentage of Schools per Institution
              </h1>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="schools"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#3f51b5"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Institutions;
