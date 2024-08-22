import {
  Gauge,
  School,
  BookType,
  CalendarRange,
  CalendarCheck,
  UserPlus,
  UserRoundCog,
  Users,
  BookUser,
  UserSearch,
  BookHeart,
  Settings,
  UserCog,
  ClipboardPlus,
  IndianRupee,
  GraduationCap,
  CalendarPlus,
  Volume2,
  ReceiptIndianRupee,
  ReceiptText,
  CreditCard,
  NotepadText,
  NotebookPenIcon,
  Mic
} from 'lucide-react';
export const superAdminmenuItems = [
  { path: '/superadmin', icon: Gauge, label: 'Dashboard' },
  { path: '/superadmin/customers', icon: Users, label: 'Institutions' },
  { path: '/superadmin/schools', icon: School, label: 'Schools' },
  { path: '/superadmin/admins', icon: UserRoundCog, label: 'Admins' }
];
export const adminMenuItems = [
  { key: 'academics', path: '/admin', icon: Gauge, label: 'Dashboard' },
  {
    key: 'academics',
    label: 'Academics',
    icon: BookUser,
    path: '',
    subMenu: [
      {
        key: 'academic-years',
        label: 'Academic Years',
        path: '/admin/academic-years',
        icon: CalendarRange
      },
      {
        key: 'standards',
        label: 'Standards',
        path: '/admin/standards',
        icon: GraduationCap
      },
      {
        key: 'subjects',
        label: 'Subjects',
        path: '/admin/subjects',
        icon: School
      },
      {
        key: 'standard-subjects',
        label: 'Map Std. Subjects',
        path: '/admin/standard-subject',
        icon: BookType
      },
      {
        key: 'periods',
        label: 'Periods',
        path: '/admin/periods',
        icon: CalendarRange
      },
      {
        key: 'exam-types',
        label: 'Exam Types',
        path: '/admin/exam-types',
        icon: NotepadText
      },
      {
        key: 'exams',
        label: 'Exams',
        path: '/admin/exams',
        icon: NotebookPenIcon
      }
    ]
  },
  {
    key: 'student',
    path: '',
    icon: Users,
    label: 'Student',
    subMenu: [
      {
        key: 'students',
        path: '/admin/students/addStudent',
        icon: UserPlus,
        label: 'Add Students'
      },
      {
        key: 'students',
        path: '/admin/students/searchStudent',
        icon: UserSearch,
        label: 'Search Student'
      }
    ]
  },
  {
    key: 'attendance',
    path: '',
    icon: Users,
    label: 'Attendance',
    subMenu: [
      {
        key: 'staff-attendances',
        label: 'Staff Attendance',
        path: '/admin/attendance/staff-attendances',
        icon: CalendarPlus
      },
      {
        key: 'student-attendance',
        label: 'Student  Management',
        path: '/admin/attendance/student-management',
        icon: ClipboardPlus
      },
      {
        key: 'staff-attendances',
        label: 'Staff Management',
        path: '/admin/attendance/staff-management',
        icon: CreditCard
      }
    ]
  },
  {
    key: 'announcements',
    path: '/admin/announcements',
    icon: Mic,
    label: 'Announcements'
  },
  {
    key: 'staff',
    label: 'Staffs',
    icon: CalendarCheck,
    path: '',
    subMenu: [
      {
        key: 'staffs',
        path: '/admin/staffs',
        icon: BookHeart,
        label: 'Add Staffs'
      }
    ]
  },
  {
    key: 'finance',
    label: ' Finance',
    icon: IndianRupee,
    path: '',
    subMenu: [
      {
        key: 'fee-components',
        label: 'Fees Component',
        path: '/admin/finance/fee-components',
        icon: ReceiptIndianRupee
      },
      {
        key: 'fee-structures',
        label: 'Fees Structure',
        path: '/admin/finance/fee-structures',
        icon: ReceiptText
      },
      {
        key: 'fee-payments',
        label: 'Fees Payment',
        path: '/admin/finance/fee-payments',
        icon: CreditCard
      },
      {
        key: 'cheque-details',
        label: 'Payment History',
        path: '/admin/finance/cheque-details',
        icon: ClipboardPlus
      }
    ]
  },

  {
    key: 'privilege',
    label: 'Privilege',
    icon: Settings,
    path: '',
    subMenu: [
      {
        key: 'roles',
        label: 'Add Role',
        path: '/admin/setting/addRole',
        icon: UserCog
      },
      {
        key: 'roles',
        label: 'Assign Role',
        path: '/admin/setting/assignRole',
        icon: NotebookPenIcon
      },
      {
        key: 'roles',
        label: 'Permission',
        path: '/admin/setting/permission',
        icon: Users
      },
      {
        key: 'roles',
        label: 'Features',
        path: '/admin/setting/features',
        icon: ClipboardPlus
      },
      {
        key: 'roles',
        label: 'Upload Summary',
        path: '/admin/setting/uploadSummary',
        icon: UserCog
      }
    ]
  },
  {
    key: 'privilege',
    label: 'Reports',
    icon: ClipboardPlus,
    path: '/admin/reports'
  }
];

export const teacherMenuItems = [
  { key: 'results', path: '/teacher', icon: Gauge, label: 'Dashboard' },

  {
    key: 'results',
    path: '/teacher/results',
    icon: CreditCard,
    label: 'Result'
  },
  {
    key: 'announcements',
    path: '/teacher/announcements',
    icon: Volume2,
    label: 'Announcements'
  },

  {
    key: 'assignments',
    label: 'Add Assignment',
    path: '/teacher/assignments',
    icon: ReceiptText
  },
  {
    key: 'attendance',
    label: 'Attendances',
    icon: Settings,
    path: '',
    subMenu: [
      {
        key: 'student-attendance',
        label: 'Student Attendances',
        path: '/teacher/attendances/studentAttendance',
        icon: UserCog
      },
      {
        key: 'staff-attendances',
        label: 'My Attendances',
        path: '/teacher/attendances/my-attendance',
        icon: UserCog
      }
    ]
  }
];

export const studentMenuItems = [
  { key: 'student', path: '/student', icon: Gauge, label: 'Dashboard' },
  {
    key: 'assignments',
    path: '/student/assignments',
    icon: BookHeart,
    label: 'Assignment'
  },

  {
    key: 'announcements',
    path: '/student/announcements',
    icon: Mic,
    label: 'Announcements'
  },
  {
    key: 'student',
    label: 'Student Attendances',
    icon: CalendarPlus,
    path: '/student/attendances'
  },
  {
    key: 'student',
    label: 'Results',
    icon: BookType,
    path: '/student/results'
  },
  {
    key: 'student',
    label: 'Exams',
    icon: NotebookPenIcon,
    path: '/student/exams'
  },
  {
    key: 'student',
    label: 'Fees',
    icon: CreditCard,
    path: '/student/finance'
  }
];
