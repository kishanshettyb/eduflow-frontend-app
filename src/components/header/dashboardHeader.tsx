'use client';
import React, { useState, useEffect } from 'react';
import { ModeToggle } from '../theme/switchTheme';
import { AlignJustify, Search } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useViewAcademicYear } from '@/services/queries/admin/academicYear';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import Sidebar from '../sidebar/sidebar';
import { ProfileDropdown } from './profileDropdown';
import NotificationCard from '../cards/notificationCard';

function DashboardHeader() {
  const router = useRouter();
  const [mobileMenuOpen, SetMobileMenuOpen] = useState(false);
  const { schoolId, setAcademicYearId } = useSchoolContext();

  const { data, isLoading, isError } = useViewAcademicYear(schoolId);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null);
  const [isAdminOrTeacher, setIsAdminOrTeacher] = useState<boolean>(false);
  const [, setIsStudent] = useState<boolean>(false);

  useEffect(() => {
    const roleName = localStorage.getItem('roles');
    if (roleName) {
      const roles = JSON.parse(roleName);
      setIsAdminOrTeacher(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_TEACHER'));
      setIsStudent(roles.includes('ROLE_STUDENT'));
    }

    if (data) {
      const defaultYear = data?.data.find((year) => year.isDefault);
      if (defaultYear) {
        setAcademicYearId(defaultYear.academicYearId);
        setSelectedAcademicYear(defaultYear.title);
      } else {
        setAcademicYearId(null);
        setSelectedAcademicYear(null);
      }
    }
  }, [data]);

  const handleSelectAcademicYear = (id: number, title: string) => {
    setAcademicYearId(id);
    setSelectedAcademicYear(title);
  };

  const handleAddAcademic = () => {
    router.push('/admin/academic-years');
  };

  const onRequestClose = () => {
    SetMobileMenuOpen(false);
  };

  const allDefaultFalse = data?.data.every((year) => !year.isDefault);

  return (
    <div>
      {/* ----- Start Mobile Navbar ----- */}
      <div className="lg:hidden flex justify-between items-center px-4 py-0 shadow">
        <div className="flex justify-start items-center">
          <Drawer direction="left" onClose={onRequestClose}>
            <DrawerTrigger>
              <div className="border rounded p-1" onClick={() => SetMobileMenuOpen(true)}>
                <AlignJustify className="text-slate-600" />
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[250px] border-1 border-r-slate-700 rounded-tl-none rounded-bl-none">
              <Sidebar mobileMenu={mobileMenuOpen} />
            </DrawerContent>
          </Drawer>
          <div>
            <Link href="/" className="flex justify-start items-center p-4">
              <Image src="/eduflowicon.png" alt="EduFlow" width="30" height="30" className="mr-3" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-800 dark:text-white tracking-wide">
                eduflow
              </span>
            </Link>
          </div>
        </div>
        <div>
          <ProfileDropdown />
        </div>
      </div>
      {/* ----- End Mobile Navbar ----- */}

      <div className="fixed z-50 w-webkit-fill-available backdrop-filter backdrop-blur-lg bg-opacity-30 hidden lg:block md:px-4 xl:px-8 top-0 mx-auto py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="w-1/4">
            <div className="relative flex justify-start items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 " />
              <Input type="text" placeholder="Search" className="pl-10" />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            {isAdminOrTeacher && (
              <div className="flex items-center gap-2">
                {data?.data.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {selectedAcademicYear ? (
                        <Button size="sm" variant="outline" className="mr-4 px-4 py-2">
                          Academic Year: {selectedAcademicYear}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className={allDefaultFalse ? 'bg-yellow-300' : ''}
                        >
                          Select Academic Year
                        </Button>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuSeparator />
                      {isLoading ? (
                        <DropdownMenuItem>Loading...</DropdownMenuItem>
                      ) : isError ? (
                        <DropdownMenuItem>Error loading data</DropdownMenuItem>
                      ) : (
                        data?.data.map((year) => (
                          <DropdownMenuItem
                            key={year.academicYearId}
                            onClick={() =>
                              handleSelectAcademicYear(year.academicYearId, year.title)
                            }
                          >
                            {year.title}
                          </DropdownMenuItem>
                        ))
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleAddAcademic}>
                        Add Academic Year
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className={allDefaultFalse ? 'bg-yellow-300' : ''}
                    onClick={handleAddAcademic}
                  >
                    Add Academic Year
                  </Button>
                )}
              </div>
            )}
            <NotificationCard />

            <ModeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
