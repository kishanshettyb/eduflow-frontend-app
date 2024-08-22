'use client';

import Autoplay from 'embla-carousel-autoplay';
import ImageCard from '@/components/cards/imageCard';
import React, { useState, useEffect, useRef } from 'react';
import TitleBar from '@/components/header/titleBar';
import { Carousel } from '@/components/ui/carousel';
import { useGetAllAdmins } from '@/services/queries/superadmin/admins';
import GetAdminForm from '@/components/forms/getAdminForm';
import NotFound from '@/components/notfound/notfound';
import { useGetAllSchools } from '@/services/queries/superadmin/schools';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import CustomPagination from '@/components/pagination/custompagination';

function Admins() {
  const plugin = useRef(Autoplay({ delay: 3000, duration: 5000, stopOnInteraction: true }));
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [admins, setAdmins] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 9;
  const adminsPerPage = 9;

  useEffect(() => {
    const storedSchoolId = localStorage.getItem('selectedSchoolId');
    if (storedSchoolId) {
      setSelectedSchoolId(storedSchoolId);
    }
  }, []);

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchoolId(schoolId);
    setAdmins(null);
    localStorage.setItem('selectedSchoolId', schoolId);
  };

  const getAdmins = useGetAllAdmins(selectedSchoolId);

  useEffect(() => {
    if (getAdmins.isSuccess) {
      setAdmins(getAdmins.data.data);
    }
  }, [getAdmins.isSuccess, getAdmins.data]);

  const createAdminLink = selectedSchoolId
    ? `/superadmin/admins/create?schoolId=${selectedSchoolId}`
    : '/superadmin/admins/create';
  const getSchools = useGetAllSchools();

  if (getSchools.isPending) {
    return <h1>Loading...</h1>;
  }
  if (getSchools.isError) {
    return <h1>Something went wrong...</h1>;
  }
  const schoolsAvailable =
    getSchools.data && Array.isArray(getSchools.data.data) && getSchools.data.data.length > 0;

  const filteredAdmins = admins
    ? admins.filter((admin) => admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    const nameA = a.firstName.toLowerCase();
    const nameB = b.firstName.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = sortedAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const totalItems = sortedAdmins.length;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const ImageCardWithAttachment = ({ admin }) => {
    const attachmentData = useViewAttachment(admin.schoolId, admin.photo?.attachmentId);
    const bgImageSrc = attachmentData.isSuccess ? attachmentData.data : null;

    return (
      <ImageCard
        id={admin.staffId}
        title={admin.firstName}
        description={admin.currentAddress.place}
        bgImageSrc={bgImageSrc}
        logoSrc={bgImageSrc}
        name={admin.firstName}
        email={admin.email}
        phone={admin.contactNumber}
        place={admin.currentAddress.city}
        cardLink={`${process.env.NEXT_PUBLIC_ADMINS_URL}${admin.staffId}?schoolId=${admin.schoolId}&`}
      />
    );
  };

  const handleSearch = (term: string) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  const handleSort = (sortOrder: 'asc' | 'desc') => {
    setSortOrder(sortOrder);
  };

  return (
    <div className="mt-5">
      <TitleBar
        title="Admins"
        onSearch={handleSearch}
        onSort={handleSort}
        search={true}
        btnLink={createAdminLink}
        btnName="Create Admin"
        placeholder="Search Admins"
        sort={true}
      />
      {!schoolsAvailable && (
        <NotFound
          image="/Nodata.svg"
          title="No Schools found"
          description="Please click below to add school"
          btnLink="/superadmin/schools/create"
          btnName="Create School"
        />
      )}

      {schoolsAvailable && <GetAdminForm onSchoolSelect={handleSchoolSelect} />}

      <div className="mt-20">
        {selectedSchoolId && (
          <div className="mb-10">
            <Carousel
              opts={{
                align: 'start',
                loop: true
              }}
              plugins={[plugin.current]}
            >
              <div className="flex flex-row flex-wrap justify-between gap-y-10 gap-x-5 md:gap-x-10">
                {currentAdmins.length > 0 ? (
                  currentAdmins.map((admin) => (
                    <div
                      key={admin.staffId}
                      className="basis-full md:basis-[215px] lg:basis-[230px] xl:basis-60 2xl:basis-60"
                    >
                      <ImageCardWithAttachment admin={admin} />
                    </div>
                  ))
                ) : (
                  <div className="flex text-center justify-center w-full">
                    <NotFound
                      image="/Nodata.svg"
                      title="No admins found !"
                      description="Please click below button to add admin"
                      btnLink={`/superadmin/admins/create?schoolId=${selectedSchoolId}`}
                      btnName="Create Admin"
                    />
                  </div>
                )}
              </div>
            </Carousel>
          </div>
        )}
      </div>
      {totalItems > pageSize && (
        <div className="flex justify-center my-10">
          <div className="w-1/4">
            <CustomPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={Math.ceil(totalItems / adminsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Admins;
