import DashboardFooter from '@/components/footer/dashboardFooter';
import DashboardHeader from '@/components/header/dashboardHeader';
import Sidebar from '@/components/sidebar/sidebar';

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex relative flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <DashboardHeader />
          <main>
            <div className="container  pt-0 lg:pt-[100px] px-4 xl:px-8 pb-4 mx-auto">
              {children}
            </div>
          </main>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}
