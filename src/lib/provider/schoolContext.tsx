'use client';

import useStorage from '@/hooks/storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

type SchoolContextProps = {
  schoolId: number | null;
  // eslint-disable-next-line no-unused-vars
  setSchoolId: (id: number | null) => void;
  attachmentId: number | null;
  // eslint-disable-next-line no-unused-vars
  setAttachmentId: (id: number | null) => void;
  staffId: number | null;
  // eslint-disable-next-line no-unused-vars
  setStaffId: (id: number | null) => void;
  studentId: number | null;
  // eslint-disable-next-line no-unused-vars
  setStudentId: (id: number | null) => void;
  enrollmentId: number | null;
  // eslint-disable-next-line no-unused-vars
  setEnrollmentId: (id: number | null) => void;
  academicYearId: number | null;
  // eslint-disable-next-line no-unused-vars
  setAcademicYearId: (id: number | null) => void;
  standardId: number | null;
  // eslint-disable-next-line no-unused-vars
  setStandardId: (id: number | null) => void;
  userName: string | null;
  // eslint-disable-next-line no-unused-vars
  setUserName: (name: string | null) => void;
  firstName: string | null;
  // eslint-disable-next-line no-unused-vars
  setFirstName: (name: string | null) => void;
  lastName: string | null;
  // eslint-disable-next-line no-unused-vars
  setLastName: (name: string | null) => void;
  roles: string[];
  // eslint-disable-next-line no-unused-vars
  setRoles: (roles: string[]) => void;
  announcementActions: string[];
  // eslint-disable-next-line no-unused-vars
  setAnnouncementActions: (actions: string[]) => void;
  userType: string | null;
  // eslint-disable-next-line no-unused-vars
  setUserType: (type: string | null) => void;
};

const SchoolContext = createContext<SchoolContextProps>({
  attachmentId: null,
  setAttachmentId: () => {},
  schoolId: null,
  setSchoolId: () => {},
  staffId: null,
  setStaffId: () => {},
  studentId: null,
  setStudentId: () => {},
  enrollmentId: null,
  setEnrollmentId: () => {},
  academicYearId: null,
  setAcademicYearId: () => {},
  standardId: null,
  setStandardId: () => {},
  userName: null,
  setUserName: () => {},
  firstName: null,
  setFirstName: () => {},
  lastName: null,
  setLastName: () => {},
  roles: [],
  setRoles: () => {},
  announcementActions: [],
  setAnnouncementActions: () => {},
  userType: null,
  setUserType: () => {}
});

export const useSchoolContext = () => useContext(SchoolContext);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const SchoolProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storage = useStorage();

  const getInitialValue = <T extends string | number | null>(
    key: string,
    type: 'number' | 'string'
  ): T => {
    const value = storage.getItem(key, 'local');
    if (type === 'number') {
      return value ? (Number(value) as T) : (null as T);
    }
    return value ? (String(value) as T) : (null as T);
  };

  const [schoolId, setSchoolId] = useState<number | null>(
    getInitialValue<number | null>('schoolId', 'number')
  );
  const [attachmentId, setAttachmentId] = useState<number | null>(
    getInitialValue<number | null>('attachmentId', 'number')
  );
  const [staffId, setStaffId] = useState<number | null>(
    getInitialValue<number | null>('staffId', 'number')
  );
  const [studentId, setStudentId] = useState<number | null>(
    getInitialValue<number | null>('studentId', 'number')
  );
  const [enrollmentId, setEnrollmentId] = useState<number | null>(
    getInitialValue<number | null>('enrollmentId', 'number')
  );
  const [academicYearId, setAcademicYearId] = useState<number | null>(
    getInitialValue<number | null>('academicYearId', 'number')
  );
  const [standardId, setStandardId] = useState<number | null>(
    getInitialValue<number | null>('standardId', 'number')
  );
  const [userName, setUserName] = useState<string | null>(
    getInitialValue<string | null>('userName', 'string')
  );
  const [firstName, setFirstName] = useState<string | null>(
    getInitialValue<string | null>('firstName', 'string')
  );
  const [lastName, setLastName] = useState<string | null>(
    getInitialValue<string | null>('lastName', 'string')
  );
  const [roles, setRoles] = useState<string[]>([]);
  const [announcementActions, setAnnouncementActions] = useState<string[]>([]);

  const [userType, setUserType] = useState<string | null>(
    getInitialValue<string | null>('userType', 'string')
  );

  const handleSetItem = <T extends string | number | null>(
    key: string,
    setState: React.Dispatch<React.SetStateAction<T>>,
    value: T
  ) => {
    setState(value);
    storage.setItem(key, String(value), 'local');
  };

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  return (
    <SchoolContext.Provider
      value={{
        schoolId,
        setSchoolId: (id) => handleSetItem<number | null>('schoolId', setSchoolId, id),
        attachmentId,
        setAttachmentId: (id) => handleSetItem<number | null>('attachmentId', setAttachmentId, id),
        staffId,
        setStaffId: (id) => handleSetItem<number | null>('staffId', setStaffId, id),
        studentId,
        setStudentId: (id) => handleSetItem<number | null>('studentId', setStudentId, id),
        enrollmentId,
        setEnrollmentId: (id) => handleSetItem<number | null>('enrollmentId', setEnrollmentId, id),
        academicYearId,
        setAcademicYearId: (id) =>
          handleSetItem<number | null>('academicYearId', setAcademicYearId, id),
        standardId,
        setStandardId: (id) => handleSetItem<number | null>('standardId', setStandardId, id),
        userName,
        setUserName: (name) => handleSetItem<string | null>('userName', setUserName, name),
        firstName,
        setFirstName: (name) => handleSetItem<string | null>('firstName', setFirstName, name),
        lastName,
        setLastName: (name) => handleSetItem<string | null>('lastName', setLastName, name),
        roles,
        setRoles,
        announcementActions,
        setAnnouncementActions,
        userType,
        setUserType: (name) => handleSetItem<string | null>('userType', setUserType, name)
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};
