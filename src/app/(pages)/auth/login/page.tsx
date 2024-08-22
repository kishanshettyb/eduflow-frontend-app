'use client';
import DashboardFooter from '@/components/footer/dashboardFooter';
import { LoginForm } from '@/components/forms/loginForm';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function Login() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles');

    if (token && roles) {
      const userRoles = roles.split(',');

      if (userRoles.includes('ROLE_SUPER_ADMIN')) {
        router.push('/superadmin/');
      } else if (userRoles.includes('ROLE_ADMIN')) {
        router.push('/admin/');
      } else if (userRoles.includes('ROLE_STUDENT')) {
        router.push('/student/');
      } else if (userRoles.includes('ROLE_TEACHER')) {
        router.push('/teacher/');
      }
    }
  }, [router]);

  return (
    <div className="bg-white dark:bg-slate-950 w-screen h-screen relative">
      <div className="flex items-center h-screen justify-center flex-col flex-col-reverse lg:flex-row ">
        <div className="w-full lg:w-1/2 flex md:justify-center lg:justify-end">
          <div className="w-full md:w-1/2 lg:w-3/5 xl:w-1/2">
            <div className="border m-4 lg:m-0 p-5 rounded-2xl">
              <h2 className="text-2xl mb-1 font-bold text-slate-700 dark:text-white ">
                Sign in to Eduflow
              </h2>
              <p className="mb-10 text-md">
                New User?{' '}
                <Link href="/" className="text-blue-600 font-semibold">
                  Contact Eduflow
                </Link>
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-auto">
          <div className="flex justify-center items-center flex-col my-5 h-full lg:my-20">
            <div>
              <h1 className="text-3xl mb-10 font-bold text-slate-700 dark:text-white">
                Hi Welcome Back
              </h1>
            </div>
            <div>
              <Image
                width="500"
                height="500"
                alt="eduflow"
                src="/other/login-img-1.png"
                className="w-auto h-[150px] lg:h-[350px] xxl:h-[650px]"
              />
            </div>
            <div>
              <h2 className="text-md mt-5 text-sm mb-10 lg:mb-0 text-center">
                Transforming Education Management with{' '}
                <a href="http://inflowsol.com" target="_blank">
                  <span className="font-semibold text-blue-600">Eduflow</span>
                </a>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 hidden lg:block">
        <DashboardFooter />
      </div>
    </div>
  );
}

export default Login;
