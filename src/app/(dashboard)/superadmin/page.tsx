'use client';
import { BasicSlider } from '@/components/sliders/basicSlider';
import React from 'react';
import adminImage from '../../../../public/other/admin.png';
import Image from 'next/image';
import { useGetAllCustomers } from '@/services/queries/superadmin/cutomer';
import { useGetAllSchools } from '@/services/queries/superadmin/schools';
// import { useGetAllAdmins } from '@/services/queries/admins';
import InfoCountCard from '@/components/cards/infoCountCard';

const Dashboard = () => {
  const customers = useGetAllCustomers();
  const schools = useGetAllSchools();
  // const admins = useGetAllAdmins();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mt-5  ">
        <div className="w-full  md:w-2/3 lg:w-3/5">
          <div className="bg-blue-50 p-10 h-full md:h-64  w-full flex flex-col  md:flex-row justify-center items-center rounded-lg">
            <div className="w-full md:w-1/2">
              <h1 className="font-semibold text-slate-900 text-2xl">
                Welcome back 👋 <br />
                Super Admin
              </h1>
              <p className="pt-2 pb-4 text-sm text-slate-500">
                Eduflow SaaS super admin! Total control, seamless operation across schools.
              </p>
            </div>
            <div className="hidden md:block w-1/2">
              <Image
                src={adminImage}
                alt="EduFLow"
                className="md:w-60 md:h-60 object-cover md:object-contain transform scale-x-[-1]"
              />
            </div>
          </div>
        </div>
        <div className="w-full   md:w-1/3 lg:w-2/5 text-lg font-semibold  ">
          <BasicSlider />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-10">
        <div>
          <InfoCountCard
            blueBg={true}
            title={customers.data?.data.length == undefined ? '0' : customers.data.data.length}
            description="Institutions"
            imageUrl="/icons/users.svg"
            cardLink={'superadmin/customers'}
          />
        </div>
        <div>
          <InfoCountCard
            greenBg={true}
            title={schools.data?.data.length == undefined ? '0' : schools.data.data.length}
            description="Schools"
            imageUrl="/icons/school.svg"
            cardLink={'superadmin/schools'}
          />
        </div>
        <div>
          <InfoCountCard
            blueBg={true}
            title={customers.data?.data.length == undefined ? '0' : customers.data.data.length}
            description="Admins"
            imageUrl="/icons/userCog.svg"
            cardLink={'superadmin/admins'}
          />
        </div>
        <div>
          <InfoCountCard
            title={customers.data?.data.length == undefined ? '0' : customers.data.data.length}
            description="Admins"
            imageUrl="/icons/userCog.svg"
            cardLink={'superadmin/admins'}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
