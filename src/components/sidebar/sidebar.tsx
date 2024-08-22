'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LogOut, KeyRound, ChevronDown, ChevronRight, Crown, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetFeatures } from '@/services/queries/policyRules/policyRules';
import {
  superAdminmenuItems,
  adminMenuItems,
  teacherMenuItems,
  studentMenuItems
} from './menuItem';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

type MobileMenuProps = {
  mobileMenu: boolean;
};

function Sidebar({ mobileMenu }: MobileMenuProps) {
  const pathName = usePathname();

  console.log('pathName', pathName);
  const { schoolId } = useSchoolContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [showPro, setShowPro] = useState(true);
  const { data: featuresData } = useGetFeatures(schoolId, roles);
  const [menuItems, setMenuItems] = useState<unknown[]>([]);
  const [expandedMenu, setExpandedMenu] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const getMenuItemsByRole = () => {
    if (roles.includes('SUPER_ADMIN')) {
      return superAdminmenuItems;
    } else if (roles.includes('ADMIN')) {
      return adminMenuItems;
    } else if (roles.includes('TEACHER')) {
      return teacherMenuItems;
    } else if (roles.includes('STUDENT')) {
      return studentMenuItems;
    }
    return [];
  };

  const menuItemsByRole = getMenuItemsByRole();

  useEffect(() => {
    if (roles.includes('SUPER_ADMIN')) {
      console.log('Setting Super Admin Menu Items');
      setMenuItems(superAdminmenuItems);
    } else if (featuresData) {
      const filteredMenuItems = menuItemsByRole
        .map((menuItem) => {
          const feature = featuresData.find((feature: unknown) => feature.key === menuItem.key);
          if (feature) {
            const filteredSubMenu = menuItem.subMenu?.filter((subItem) =>
              feature.menu.some((fMenu: unknown) => fMenu.key === subItem.key)
            );

            return {
              ...menuItem,
              subMenu: filteredSubMenu
            };
          }
          return null;
        })
        .filter(Boolean);

      setMenuItems(filteredMenuItems);
    }
  }, [featuresData, roles]);

  const roleText = roles.includes('ADMIN')
    ? 'Admin'
    : roles.includes('TEACHER')
      ? 'Teacher'
      : roles.includes('STUDENT')
        ? 'Student'
        : roles.includes('SUPER_ADMIN')
          ? 'Super Admin'
          : null;

  const toggleSubMenu = (key: string) => {
    setExpandedMenu((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleLogout = () => {
    const allCookies = Cookies.get();
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }

    localStorage.clear();
    sessionStorage.clear();
    router.push('/auth/login');
    window.location.reload();
  };

  return (
    <aside
      className={`${mobileMenu ? 'flex' : 'hidden'} w-[250px] lg:flex flex-col h-screen shadow-sm border-r border-t-0 border-l-0 border-b-0 border-r-slate-200 dark:border-r-slate-900 dark:border-b-slate-900 bg-white dark:bg-slate-900`}
    >
      <Link href="/" className="flex items-center justify-start p-4">
        <Image src="/eduflowicon.png" alt="EduFlow" width="40" height="40" className="mr-3" />
        <span className="self-center text-2xl font-semibold tracking-wide whitespace-nowrap text-slate-800 dark:text-white">
          eduflow
        </span>
      </Link>
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="py-2 border border-t-0 border-l-0 border-r-0 border-b-slate-50 dark:border-b-slate-800">
          <h2 className="text-xs tracking-wide uppercase text-slate-500 dark:text-slate-500">
            Overview
          </h2>
        </div>
        <ul>
          {menuItems.map((item) => (
            <li key={item.key} className="py-1">
              {item.path && !item.subMenu ? (
                <Link
                  href={item.path}
                  className={`flex items-center justify-between p-2 border rounded cursor-pointer ${pathName == item.path ? 'bg-blue-100' : 'bg-slate-50'} hover:bg-blue-50 border-slate-50 dark:bg-slate-950 dark:border-slate-950 hover:dark:bg-slate-800 hover:dark:border-slate-800`}
                >
                  <div className="flex items-center text-sm">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                </Link>
              ) : (
                <div
                  className={`flex items-center justify-between p-2 border rounded cursor-pointer  ${expandedMenu.includes(item.key) ? 'bg-blue-100' : 'bg-slate-50'} hover:bg-blue-50 border-slate-50 dark:bg-slate-950 dark:border-slate-950 hover:dark:bg-slate-800 hover:dark:border-slate-800`}
                  onClick={() => toggleSubMenu(item.key)}
                >
                  <div className="flex items-center text-sm">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                  {item.subMenu && expandedMenu.includes(item.key) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              )}
              {item.subMenu && expandedMenu.includes(item.key) && (
                <ul className="ml-4">
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.key} className="py-1">
                      <Link
                        href={subItem.path}
                        className={`flex items-center p-2 text-sm border rounded cursor-pointer ${pathName === subItem.path ? 'bg-blue-100' : 'bg-slate-50'} hover:bg-blue-50 border-slate-50 dark:bg-slate-950 dark:border-slate-950 hover:dark:bg-slate-800 hover:dark:border-slate-800`}
                      >
                        <subItem.icon className="w-4 h-4 mr-2" />
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="py-2 border border-t-0 border-l-0 border-r-0 border-b-slate-50 dark:border-b-slate-800">
          <h2 className="text-xs tracking-wide uppercase text-slate-500">Management</h2>
        </div>
      </div>
      {showPro ? (
        <div className="relative flex flex-col items-center justify-center px-4 py-5 m-4 border rounded-2xl border-slate-50 dark:border-slate-950 bg-gradient-to-r from-cyan-50 to-indigo-100 dark:from-cyan-300 dark:to-indigo-600">
          <div className="absolute right-2 top-2">
            <Button variant="ghost" onClick={() => setShowPro(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Crown className="w-10 h-10" />
          <p className="text-xl">Upgrade to Pro</p>
          <p className="mt-2 mb-4 text-xs text-center ">
            Try your experience for using more features
          </p>

          <Button variant="default">Upgrade Now</Button>
        </div>
      ) : (
        <></>
      )}

      <div className="w-full px-4 py-2 bg-white border-b-0 border-l-0 border-r-0 dark:bg-slate-900 border-t-slate-200">
        <div className="flex items-center justify-center p-2 mb-5 rounded bg-blue-50 dark:bg-slate-800">
          <KeyRound className="w-4 h-4 me-2 text-slate-400 dark:text-slate-500" />
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">{roleText}</p>
        </div>
        <Button className="w-full" variant="outline" onClick={handleLogout}>
          Logout <LogOut className="w-4 h-4 ms-3" />
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
