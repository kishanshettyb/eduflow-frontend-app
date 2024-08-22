// TeacherDashboard.tsx
'use client';
import React from 'react';
import SchoolBannerCard from '@/components/cards/SchoolBannerCard';
import WelcomeCard from '@/components/cards/welcomeCard';
import AnnouncementCarouselCard from '@/components/cards/announcementCarouselCard';

function TeacherDashboard() {
  return (
    <>
      <div className="mb-[200px]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SchoolBannerCard />
          </div>
          <div>
            <WelcomeCard
              title="Welcome back"
              role="Teacher"
              description="Eduflow SaaS teacher! Total control, seamless operation across schools."
              imageUrl="/other/admin.png"
              cardLink="#"
            />
          </div>
        </div>

        <AnnouncementCarouselCard />
      </div>
    </>
  );
}

export default TeacherDashboard;
