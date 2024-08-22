import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const USERNAME = process.env.NEXT_PUBLIC_USERNAME;
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

// eslint-disable-next-line no-unused-vars
export const useLoginMutation = (setError: (error: string | null) => void) => {
  const router = useRouter();
  const { setSchoolId, setUserName, setUserType } = useSchoolContext();

  return useMutation({
    mutationFn: async (loginData) => {
      const response = await axios.post(LOGIN_URL, loginData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
        }
      });
      return response.data;
    },
    onSuccess: async (data) => {
      const { roles, token, userType, schoolId, usersDto, userName } = data;
      const roleName = roles || usersDto.roles;
      localStorage.setItem('roles', roleName ? JSON.stringify(roleName) : '');
      Cookies.set('roles', roleName);
      Cookies.set('token', token);
      setSchoolId(schoolId);
      setUserName(userName);
      setUserType(userType);

      if (roleName) {
        if (roleName.includes('ROLE_SUPER_ADMIN')) {
          router.push('/superadmin/');
        } else if (roleName.includes('ROLE_ADMIN')) {
          router.push('/admin/');
        } else if (roleName.includes('ROLE_TEACHER')) {
          router.push('/teacher/');
        } else if (roleName.includes('ROLE_STUDENT')) {
          router.push('/student/');
        }
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || error.message);
    }
  });
};
