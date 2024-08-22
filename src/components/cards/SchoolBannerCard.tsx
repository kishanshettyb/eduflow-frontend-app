'use client';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetSchoolSetting } from '@/services/queries/superadmin/schools';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  ViewAttachmentBannnerComponent,
  ViewAttachmentLogoComponent
} from '../viewfiles/viewImage';

function SchoolBannerCard() {
  const { schoolId } = useSchoolContext();
  const { data: schoolSetting } = useGetSchoolSetting(schoolId);
  const [banner] = useState<File | null>(null);
  const [logo] = useState<File | null>(null);

  return (
    <div className="relative overflow-hidden bg-gray-100 shadow-lg mt-5 lg:mt-0 rounded-2xl">
      {banner ? (
        <Image
          width="1000"
          height="500"
          className="w-full h-[255px] object-cover transform transition-transform duration-500 ease-in-out hover:scale-105"
          alt="banner"
          src={URL.createObjectURL(banner)}
        />
      ) : schoolSetting?.data?.schoolSettingDto?.banner?.attachmentId ? (
        <ViewAttachmentBannnerComponent
          schoolId={schoolId}
          attachmentId={schoolSetting.data.schoolSettingDto.banner.attachmentId}
          attachmentName={schoolSetting.data.schoolSettingDto.banner.attachmentName}
          width="1000px"
          height="500px"
          className="w-full h-[255px] object-cover transform transition-transform duration-500 ease-in-out hover:scale-105"
        />
      ) : (
        <Image
          width="1000"
          height="500"
          className="w-full h-[255px] object-cover transform transition-transform duration-500 ease-in-out hover:scale-105"
          alt="banner"
          src="/other/banner.jpg"
        />
      )}
      <div className="absolute p-4 transition-transform duration-500 ease-in-out shadow-lg left-10 top-5 rounded-2xl hover:scale-105">
        <div className="flex items-center space-x-4">
          {logo ? (
            <Image
              width="100"
              height="100"
              className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white shadow-md"
              alt="logo"
              src="/man.png"
            />
          ) : schoolSetting?.data?.schoolSettingDto?.logo?.attachmentId ? (
            <ViewAttachmentLogoComponent
              schoolId={schoolId}
              attachmentId={schoolSetting.data.schoolSettingDto.logo.attachmentId}
              attachmentName={schoolSetting.data.schoolSettingDto.logo.attachmentName}
            />
          ) : (
            <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
              No Logo
            </div>
          )}
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">{schoolSetting?.data.schoolName}</h2>
        </div>
      </div>
    </div>
  );
}

export default SchoolBannerCard;
