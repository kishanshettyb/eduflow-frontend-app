import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('token')?.value;
  const roles = request.cookies.get('roles')?.value;

  let matcherPaths = ['/admin/:path*', '/superadmin/:path*', '/student/:path*', '/teacher/:path*'];
  console.log(matcherPaths);
  if (roles) {
    const userRoles = roles.split(',');

    if (userRoles.includes('ROLE_SUPER_ADMIN')) {
      matcherPaths = ['/superadmin/:path*'];
    } else if (userRoles.includes('ROLE_ADMIN')) {
      matcherPaths = ['/admin/:path*'];
    } else if (userRoles.includes('ROLE_STUDENT')) {
      matcherPaths = ['/student/:path*'];
    } else if (userRoles.includes('ROLE_TEACHER')) {
      matcherPaths = ['/teacher/:path*'];
    }
  }

  if (token) {
    if (roles) {
      const userRoles = roles.split(',');

      if (userRoles.includes('ROLE_SUPER_ADMIN') && url.pathname.startsWith('/superadmin')) {
        return null;
      }

      if (userRoles.includes('ROLE_ADMIN') && url.pathname.startsWith('/admin')) {
        return null;
      }

      if (userRoles.includes('ROLE_STUDENT') && url.pathname.startsWith('/student')) {
        return null;
      }
      if (userRoles.includes('ROLE_TEACHER') && url.pathname.startsWith('/teacher')) {
        return null;
      }
    }

    url.pathname = '/noaccess';
    return NextResponse.redirect(url);
  } else {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/superadmin/:path*', '/student/:path*', '/teacher/:path*']
};
