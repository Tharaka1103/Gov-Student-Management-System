export interface User {
  _id: string;
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  password: string;
  role: 'admin' | 'director' | 'internal_auditor';
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  managingDepartments: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Director extends User {
  role: 'director';
  managingDepartments: string[];
  employees: string[];
}

export interface InternalAuditor extends User {
  role: 'internal_auditor';
  managingDepartments: string[];
  workshops: string[];
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  servicePeriod: string;
  dateOfJoiningService: Date;
  degree?: string;
  profilePicture?: string;
  director: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxParticipants: number;
  students: Student[];
  internalAuditor: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  enrollmentNumber: string;
  profilePicture?: string;
  workshop: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'completed' | 'dropped';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface Division {
  _id: string;
  name: string;
  description?: string;
  director: string | User;
  employees: string[] | Employee[];
  headProgramOfficer?: string | Employee | null;
  subProgramOfficer?: string | Employee | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}