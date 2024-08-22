'use client';
import React, { useState } from 'react';
import ImageCard from '@/components/cards/imageCard';
import TitleBar from '@/components/header/titleBar';
import { useGetAllSchools } from '@/services/queries/superadmin/schools';
import CustomPagination from '@/components/pagination/custompagination';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

function ViewAllSchools() {
  const getSchools = useGetAllSchools();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 9;

  const schoolsPerPage = 9;
  if (getSchools.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSchools.isError) {
    return <h1>Something went wrong...</h1>;
  }

  const filteredSchools = getSchools.data.data.filter((school) =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    const nameA = a.schoolName.toLowerCase();
    const nameB = b.schoolName.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = sortedSchools.slice(indexOfFirstSchool, indexOfLastSchool);

  const handleSearch = (term: string) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  const handleSort = (sortOrder: 'asc' | 'desc') => {
    setSortOrder(sortOrder);
  };

  const totalItems = sortedSchools.length;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const ImageCardWithAttachment = ({ school }) => {
    const attachmentData = useViewAttachment(school.schoolId, school.photo?.attachmentId);
    const bgImageSrc = attachmentData.isSuccess ? attachmentData.data : null;

    return (
      <ImageCard
        id={school.schoolId}
        title={school.schoolName}
        description={school.address.place}
        logoSrc={bgImageSrc}
        bgImageSrc={bgImageSrc}
        name={school.contactPerson}
        email={school.emailId}
        phone={school.contactNumber}
        place={school.address.city}
        uniqueCode={school.uniqueCode}
        cardLink={process.env.NEXT_PUBLIC_SCHOOLS_URL}
        listTitle="Customer Info"
      />
    );
  };

  return (
    <div className="mt-5">
      <TitleBar
        title="Schools"
        search={true}
        placeholder="Search schools"
        onSearch={handleSearch}
        sort={true}
        onSort={handleSort}
      />
      <div className="flex flex-row flex-wrap justify-start gap-y-10 gap-x-5 md:gap-x-10">
        {currentSchools.map((school) => (
          <div
            key={school.schoolId}
            className="basis-full md:basis-[215px] lg:basis-[230px] xl:basis-60 2xl:basis-64"
          >
            <ImageCardWithAttachment school={school} />
          </div>
        ))}
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

export default ViewAllSchools;
