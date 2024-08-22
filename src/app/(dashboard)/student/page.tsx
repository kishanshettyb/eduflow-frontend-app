import React from 'react';
import SchoolBannerCard from '@/components/cards/SchoolBannerCard';
import WelcomeCard from '@/components/cards/welcomeCard';
import { NewBarChart } from '@/components/charts/newBarChart';
import { NewPieChart } from '@/components/charts/newPieChart';

function StudentDashboard() {
  return (
    <>
      <div className="mb-5  grid gap-4 grid-cols-2">
        <div>
          <SchoolBannerCard />
        </div>
        <div>
          <WelcomeCard
            title="Hi Karan"
            role="Welcome to Your Learning Dashboard"
            description="Explore your academic journey, track your progress, and stay on top of your assignments all in one place. "
            imageUrl="/other/admin.png"
            cardLink="#"
          />
        </div>
      </div>
      <div className=" grid gap-4 grid-cols-2">
        <div>
          <NewBarChart />
        </div>
        <div>
          <NewPieChart />
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
