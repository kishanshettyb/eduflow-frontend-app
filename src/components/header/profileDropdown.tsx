import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { LogOut, Settings, User } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';

export function ProfileDropdown() {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);
  const { attachmentId, schoolId, firstName, lastName } = useSchoolContext();
  const { data: imageUrl } = useViewAttachment(schoolId, attachmentId);

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

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles.map((role: string) =>
      role.replace('ROLE_', '').toLowerCase()
    );
    setRoles(formattedRoles);
  }, []);

  const getAccountLink = () => {
    if (roles.includes('admin')) return '/admin/account';
    if (roles.includes('student')) return '/student/account';
    if (roles.includes('teacher')) return '/teacher/account';
    return '/account'; // Default path if role doesn't match
  };

  const isSuperAdmin = roles.includes('super_admin');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            width="40"
            height="40"
            className="w-[40px] h-[40px] rounded-full object-cover"
            src={imageUrl || '/default-profile-pic.jpg'}
            alt={`${firstName} ${lastName}`}
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {firstName} {lastName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!isSuperAdmin && (
          <>
            <Link href={getAccountLink()} className="cursor-pointer">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={getAccountLink()} className="cursor-pointer">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="m-2">
          <Button variant="default" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
