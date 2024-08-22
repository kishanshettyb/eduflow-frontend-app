'use client';
import ImageCard from '@/components/cards/imageCard';
import React, { useState } from 'react';
import TitleBar from '@/components/header/titleBar';
import { useGetAllCustomers } from '@/services/queries/superadmin/cutomer';
import CustomPagination from '@/components/pagination/custompagination';

function ViewAllCustomers() {
  const getCustomers = useGetAllCustomers();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 9;
  const customersPerPage = 9;

  if (getCustomers.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getCustomers.isError) {
    return <h1>Something went wrong...</h1>;
  }

  const filteredCustomers = getCustomers.data.data.filter((customer) =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const nameA = a.firstName.toLowerCase();
    const nameB = b.firstName.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomer = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handleSearch = (term: string) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  const handleSort = (sortOrder: 'asc' | 'desc') => {
    setSortOrder(sortOrder);
  };

  const totalItems = sortedCustomers.length;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="mt-5 mb-48">
      <TitleBar
        title="Institutions"
        onSearch={handleSearch}
        onSort={handleSort}
        search={true}
        placeholder="Search Institutions"
        sort={true}
      />
      <div className="flex flex-row flex-wrap justify-between gap-y-10 gap-x-5 md:gap-x-10">
        {currentCustomer.map(function (item) {
          return (
            <div
              key={item.customerId}
              className="basis-full md:basis-[215px] lg:basis-[230px] xl:basis-60 2xl:basis-60"
            >
              <ImageCard
                key={item.customerId}
                id={item.customerId}
                title={
                  item.schoolList.length > 1
                    ? item.schoolList.length > 0 &&
                      item.schoolList[0].schoolName +
                        ' (+' +
                        (item.schoolList.length - 1) +
                        ' schools)'
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
            </div>
          );
        })}
      </div>
      {totalItems > pageSize && (
        <div className="flex justify-center my-10">
          <div className="w-1/4">
            <CustomPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllCustomers;
