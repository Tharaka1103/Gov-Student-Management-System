'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Edit, 
  Trash, 
  Plus, 
  Users, 
  BookOpen, 
  MessageSquare, 
  UserCheck, 
  Crown, 
  Search,
  AlertCircle,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  GraduationCap,
  User,
  Award,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BookMarked,
  Clock,
  DollarSign
} from 'lucide-react';
import DeleteConfirm from '@/components/DeleteConfirm';

// TypeScript Interfaces
interface User {
  _id: string;
  email: string;
  username: string;
  contact?: string;
  nic?: string;
  work?: string;
  address?: string;
  role: 'admin' | 'director' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
  duration: string;
  description: string;
  price: number;
  availableSeats: number;
  enrolledStudents?: number;
  instructor?: string;
  category?: string;
  createdAt?: string;
}

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  nic: string;
  guardianName?: string;
  guardianPhone?: string;
  enrolledCourses: Array<{
    courseId: {
      _id: string;
      title: string;
      duration: string;
      price: number;
    };
    enrollmentDate: string;
    status: 'active' | 'completed' | 'suspended' | 'dropped';
    progress: number;
    completionDate?: string;
  }>;
  academicInfo: {
    previousEducation?: string;
    previousInstitution?: string;
  };
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: string;
  notes?: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [directors, setDirectors] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [regularUsers, setRegularUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error' | ''; message: string }>({ 
    show: false, 
    type: '', 
    message: '' 
  });
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [directorSearch, setDirectorSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Dialog states
  const [studentDialog, setStudentDialog] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [directorDialog, setDirectorDialog] = useState(false);
  const [adminDialog, setAdminDialog] = useState(false);
  const [courseDialog, setCourseDialog] = useState(false);
  const [contactDialog, setContactDialog] = useState(false);
  const [studentDetailDialog, setStudentDetailDialog] = useState(false);
  const [contactDetailDialog, setContactDetailDialog] = useState(false);

  // Form states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDirector, setEditingDirector] = useState<User | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form data states
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nic: '',
    guardianName: '',
    guardianPhone: '',
    courseIds: [] as string[],
    previousEducation: '',
    previousInstitution: '',
    notes: '',
    status: 'active'
  });

  const [userForm, setUserForm] = useState({
    email: '',
    username: '',
    contact: '',
    nic: '',
    work: '',
    address: '',
    password: ''
  });

  const [directorForm, setDirectorForm] = useState({
    email: '',
    username: '',
    contact: '',
    nic: '',
    work: '',
    address: '',
    password: ''
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    username: '',
    contact: '',
    nic: '',
    work: '',
    address: '',
    password: ''
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    duration: '',
    description: '',
    price: 0,
    availableSeats: 0,
    instructor: '',
    category: ''
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    read: false
  });

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(data);
        await fetchData();
      } catch (error) {
        router.push('/login');
      }
    };

    initializeAdmin();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, userRes, couRes, conRes] = await Promise.all([
        fetch('/api/students', { credentials: 'include' }),
        fetch('/api/users', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' }),
        fetch('/api/contacts', { credentials: 'include' })
      ]);
      
      if (stuRes.ok) {
        const studentsData = await stuRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      }
      
      if (userRes.ok) {
        const usersData = await userRes.json();
        if (Array.isArray(usersData)) {
          setDirectors(usersData.filter(u => u.role === 'director'));
          setAdmins(usersData.filter(u => u.role === 'admin'));
          setRegularUsers(usersData.filter(u => u.role === 'user'));
        }
      }
      
      if (couRes.ok) {
        const coursesData = await couRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      }
      
      if (conRes.ok) {
        const contactsData = await conRes.json();
        setContacts(Array.isArray(contactsData) ? contactsData : []);
      }
    } catch (error) {
      showAlert('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    showAlert('success', 'Data refreshed successfully');
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'dropped': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-3 h-3" />;
      case 'inactive': return <XCircle className="w-3 h-3" />;
      case 'graduated': return <GraduationCap className="w-3 h-3" />;
      case 'suspended': return <AlertTriangle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'dropped': return <XCircle className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  // Student Management Functions
  const handleStudentSubmit = async () => {
    try {
      const method = editingStudent ? 'PUT' : 'POST';
      const url = editingStudent ? `/api/students/${editingStudent._id}` : '/api/students';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `Student ${editingStudent ? 'updated' : 'created'} successfully`);
        await fetchData();
        setStudentDialog(false);
        resetStudentForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleStudentDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/students/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'Student deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openStudentForm = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        address: student.address,
        dateOfBirth: student.dateOfBirth.split('T')[0],
        nic: student.nic,
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        courseIds: student.enrolledCourses.map(ec => ec.courseId._id),
        previousEducation: student.academicInfo.previousEducation || '',
        previousInstitution: student.academicInfo.previousInstitution || '',
        notes: student.notes || '',
        status: student.status
      });
    } else {
      setEditingStudent(null);
      resetStudentForm();
    }
    setStudentDialog(true);
  };

  const resetStudentForm = () => {
    setStudentForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      nic: '',
      guardianName: '',
      guardianPhone: '',
      courseIds: [],
      previousEducation: '',
      previousInstitution: '',
      notes: '',
      status: 'active'
    });
    setEditingStudent(null);
  };

  // User Management Functions
  const handleUserSubmit = async () => {
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userForm, role: 'user' }),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `User ${editingUser ? 'updated' : 'created'} successfully`);
        await fetchData();
        setUserDialog(false);
        resetUserForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleUserDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'User deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openUserForm = (userItem?: User) => {
    if (userItem) {
      setEditingUser(userItem);
      setUserForm({
        email: userItem.email,
        username: userItem.username,
        contact: userItem.contact || '',
        nic: userItem.nic || '',
        work: userItem.work || '',
        address: userItem.address || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      resetUserForm();
    }
    setUserDialog(true);
  };

  const resetUserForm = () => {
    setUserForm({
      email: '',
      username: '',
      contact: '',
      nic: '',
      work: '',
      address: '',
      password: ''
    });
    setEditingUser(null);
  };

  // Director Management Functions
  const handleDirectorSubmit = async () => {
    try {
      const method = editingDirector ? 'PUT' : 'POST';
      const url = editingDirector ? `/api/users/${editingDirector._id}` : '/api/users';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...directorForm, role: 'director' }),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `Director ${editingDirector ? 'updated' : 'created'} successfully`);
        await fetchData();
        setDirectorDialog(false);
        resetDirectorForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleDirectorDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'Director deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openDirectorForm = (director?: User) => {
    if (director) {
      setEditingDirector(director);
      setDirectorForm({
        email: director.email,
        username: director.username,
        contact: director.contact || '',
        nic: director.nic || '',
        work: director.work || '',
        address: director.address || '',
        password: ''
      });
    } else {
      setEditingDirector(null);
      resetDirectorForm();
    }
    setDirectorDialog(true);
  };

  const resetDirectorForm = () => {
    setDirectorForm({
      email: '',
      username: '',
      contact: '',
      nic: '',
      work: '',
      address: '',
      password: ''
    });
    setEditingDirector(null);
  };

  // Admin Management Functions
  const handleAdminSubmit = async () => {
    try {
      const method = editingAdmin ? 'PUT' : 'POST';
      const url = editingAdmin ? `/api/users/${editingAdmin._id}` : '/api/users';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...adminForm, role: 'admin' }),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `Admin ${editingAdmin ? 'updated' : 'created'} successfully`);
        await fetchData();
        setAdminDialog(false);
        resetAdminForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleAdminDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'Admin deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openAdminForm = (admin?: User) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminForm({
        email: admin.email,
        username: admin.username,
        contact: admin.contact || '',
        nic: admin.nic || '',
        work: admin.work || '',
        address: admin.address || '',
        password: ''
      });
    } else {
      setEditingAdmin(null);
      resetAdminForm();
    }
    setAdminDialog(true);
  };

  const resetAdminForm = () => {
    setAdminForm({
      email: '',
      username: '',
      contact: '',
      nic: '',
      work: '',
      address: '',
      password: ''
    });
    setEditingAdmin(null);
  };

  // Course Management Functions
  const handleCourseSubmit = async () => {
    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `Course ${editingCourse ? 'updated' : 'created'} successfully`);
        await fetchData();
        setCourseDialog(false);
        resetCourseForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleCourseDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'Course deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openCourseForm = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        duration: course.duration,
        description: course.description,
        price: course.price,
        availableSeats: course.availableSeats,
        instructor: course.instructor || '',
        category: course.category || ''
      });
    } else {
      setEditingCourse(null);
      resetCourseForm();
    }
    setCourseDialog(true);
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      duration: '',
      description: '',
      price: 0,
      availableSeats: 0,
      instructor: '',
      category: ''
    });
    setEditingCourse(null);
  };

  // Contact Management Functions
  const handleContactSubmit = async () => {
    try {
      const method = editingContact ? 'PUT' : 'POST';
      const url = editingContact ? `/api/contacts/${editingContact._id}` : '/api/contacts';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
        credentials: 'include'
      });

      if (response.ok) {
        showAlert('success', `Contact ${editingContact ? 'updated' : 'created'} successfully`);
        await fetchData();
        setContactDialog(false);
        resetContactForm();
      } else {
        const errorData = await response.json();
        showAlert('error', errorData.message || 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleContactDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (response.ok) {
        showAlert('success', 'Contact deleted successfully');
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openContactForm = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setContactForm({
        name: contact.name,
        email: contact.email,
        message: contact.message,
        read: contact.read
      });
    } else {
      setEditingContact(null);
      resetContactForm();
    }
    setContactDialog(true);
  };

  const resetContactForm = () => {
    setContactForm({
      name: '',
      email: '',
      message: '',
      read: false
    });
    setEditingContact(null);
  };

  // Filter functions
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredUsers = regularUsers.filter(user =>
    user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredDirectors = directors.filter(director =>
    director.username.toLowerCase().includes(directorSearch.toLowerCase()) ||
    director.email.toLowerCase().includes(directorSearch.toLowerCase())
  );

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(adminSearch.toLowerCase()) ||
    admin.email.toLowerCase().includes(adminSearch.toLowerCase())
  ).filter(admin => admin._id !== user?._id);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.category?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const stats = {
    totalStudents: students.length,
    totalDirectors: directors.length,
    totalAdmins: admins.length,
    totalUsers: regularUsers.length,
    totalCourses: courses.length,
    totalContacts: contacts.length,
    unreadContacts: contacts.filter(contact => !contact.read).length,
    activeStudents: students.filter(student => student.status === 'active').length,
    totalEnrollments: students.reduce((sum, student) => sum + student.enrolledCourses.length, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Alert */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Alert className={`${alert.type === 'error' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'} backdrop-blur-xl`}>
            {alert.type === 'error' ? 
              <AlertCircle className="h-4 w-4 text-red-600" /> : 
              <CheckCircle className="h-4 w-4 text-green-600" />
            }
            <AlertDescription className={alert.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-grow p-4 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-lg text-gray-600">Comprehensive system management and oversight</p>
            </div>
            <Button 
              onClick={refreshData} 
              disabled={refreshing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

          {/* Admin Profile Card */}
          <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-20 w-20 ring-4 ring-white/50">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                  <AvatarFallback className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xl">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <CardTitle className="text-2xl">{user.username}</CardTitle>
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Super Admin
                    </Badge>
                  </div>
                  <CardDescription className="text-lg mb-4">{user.email}</CardDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {user.contact && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.contact}
                      </div>
                    )}
                    {user.nic && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        {user.nic}
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {user.address}
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-gray-600">Active: {stats.activeStudents}</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-gray-600">Regular users</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-gray-600">Available courses</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-gray-600">Unread: {stats.unreadContacts}</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/50 backdrop-blur-sm">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="students" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Students
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="directors" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Directors
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
                      <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Students:</span>
                          <Badge>{stats.totalStudents}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <Badge>{stats.totalUsers}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Directors:</span>
                          <Badge>{stats.totalDirectors}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Admins:</span>
                          <Badge>{stats.totalAdmins}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Courses:</span>
                          <Badge>{stats.totalCourses}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Enrollments:</span>
                          <Badge>{stats.totalEnrollments}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button onClick={() => openStudentForm()} className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Student
                        </Button>
                        <Button onClick={() => openUserForm()} className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New User
                        </Button>
                        <Button onClick={() => openDirectorForm()} className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Director
                        </Button>
                        <Button onClick={() => openCourseForm()} className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Course
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <Button onClick={() => openStudentForm()} className="bg-blue-500">
                      <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                  </div>

                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Courses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map((student) => (
                            <TableRow key={student._id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}${student.lastName}`} />
                                    <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.fullName}</div>
                                    <div className="text-xs text-gray-500">{student.studentId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.phone}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(student.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(student.status)}
                                    {student.status}
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell>{student.enrolledCourses.length}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setStudentDetailDialog(true);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openStudentForm(student)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <DeleteConfirm onConfirm={() => handleStudentDelete(student._id)}>
                                    <Trash className="h-4 w-4" />
                                  </DeleteConfirm>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <Button onClick={() => openUserForm()} className="bg-blue-500">
                      <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                  </div>

                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>NIC</TableHead>
                            <TableHead>Work</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((userItem) => (
                            <TableRow key={userItem._id}>
                              <TableCell className="font-medium">{userItem.username}</TableCell>
                              <TableCell>{userItem.email}</TableCell>
                              <TableCell>{userItem.contact || 'N/A'}</TableCell>
                              <TableCell>{userItem.nic || 'N/A'}</TableCell>
                              <TableCell>{userItem.work || 'N/A'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openUserForm(userItem)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <DeleteConfirm onConfirm={() => handleUserDelete(userItem._id)}>
                                    <Trash className="h-4 w-4" />
                                  </DeleteConfirm>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>

                {/* Directors Tab */}
                <TabsContent value="directors" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search directors..."
                            value={directorSearch}
                            onChange={(e) => setDirectorSearch(e.target.value)}
                            className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                          />
                        </div>
                        <Button onClick={() => openDirectorForm()} className="bg-gradient-to-r from-purple-500 to-pink-600">
                          <Plus className="mr-2 h-4 w-4" /> Add Director
                        </Button>
                      </div>

                      <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                        <ScrollArea className="h-[300px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>NIC</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredDirectors.map((director) => (
                                <TableRow key={director._id}>
                                  <TableCell className="font-medium">{director.username}</TableCell>
                                  <TableCell>{director.email}</TableCell>
                                  <TableCell>{director.contact || 'N/A'}</TableCell>
                                  <TableCell>{director.nic || 'N/A'}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => openDirectorForm(director)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <DeleteConfirm onConfirm={() => handleDirectorDelete(director._id)}>
                                        <Trash className="h-4 w-4" />
                                      </DeleteConfirm>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </Card>
                    </div>

                    {/* Admins Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Administrators</h3>
                        <Button onClick={() => openAdminForm()} className="bg-gradient-to-r from-red-500 to-orange-600">
                          <Plus className="mr-2 h-4 w-4" /> Add Admin
                        </Button>
                      </div>

                      <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                        <ScrollArea className="h-[300px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>NIC</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredAdmins.map((admin) => (
                                <TableRow key={admin._id}>
                                  <TableCell className="font-medium">{admin.username}</TableCell>
                                  <TableCell>{admin.email}</TableCell>
                                  <TableCell>{admin.contact || 'N/A'}</TableCell>
                                  <TableCell>{admin.nic || 'N/A'}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => openAdminForm(admin)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <DeleteConfirm onConfirm={() => handleAdminDelete(admin._id)}>
                                        <Trash className="h-4 w-4" />
                                      </DeleteConfirm>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <Button onClick={() => openCourseForm()} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                      <Plus className="mr-2 h-4 w-4" /> Add Course
                    </Button>
                  </div>

                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Available Seats</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCourses.map((course) => (
                            <TableRow key={course._id}>
                              <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.duration}</TableCell>
                              <TableCell>LKR {course.price.toLocaleString()}</TableCell>
                              <TableCell>{course.availableSeats}</TableCell>
                              <TableCell>{course.instructor || 'N/A'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openCourseForm(course)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <DeleteConfirm onConfirm={() => handleCourseDelete(course._id)}>
                                    <Trash className="h-4 w-4" />
                                  </DeleteConfirm>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>

                {/* Contacts Tab */}
                <TabsContent value="contacts" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search contacts..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                      />
                    </div>
                    <Button onClick={() => openContactForm()} className="bg-gradient-to-r from-orange-500 to-red-600">
                      <Plus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                  </div>

                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredContacts.map((contact) => (
                            <TableRow key={contact._id}>
                              <TableCell className="font-medium">{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>
                                <div className="max-w-xs truncate" title={contact.message}>
                                  {contact.message}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={contact.read ? 'default' : 'secondary'}>
                                  {contact.read ? 'Read' : 'Unread'}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(contact.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedContact(contact);
                                      setContactDetailDialog(true);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openContactForm(contact)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <DeleteConfirm onConfirm={() => handleContactDelete(contact._id)}>
                                    <Trash className="h-4 w-4" />
                                  </DeleteConfirm>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer role="admin" />

      {/* Student Form Dialog */}
      <Dialog open={studentDialog} onOpenChange={setStudentDialog}>
        <DialogContent className="max-w-4xl backdrop-blur-xl bg-white/95 border border-white/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              {editingStudent ? 'Edit' : 'Add'} Student
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC *</Label>
                  <Input
                    id="nic"
                    value={studentForm.nic}
                    onChange={(e) => setStudentForm({ ...studentForm, nic: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input
                    id="guardianName"
                    value={studentForm.guardianName}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone</Label>
                  <Input
                    id="guardianPhone"
                    value={studentForm.guardianPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="bg-white/50 border-white/30"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previousEducation">Previous Education</Label>
                  <Input
                    id="previousEducation"
                    value={studentForm.previousEducation}
                    onChange={(e) => setStudentForm({ ...studentForm, previousEducation: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousInstitution">Previous Institution</Label>
                  <Input
                    id="previousInstitution"
                    value={studentForm.previousInstitution}
                    onChange={(e) => setStudentForm({ ...studentForm, previousInstitution: e.target.value })}
                    className="bg-white/50 border-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={studentForm.status} onValueChange={(value) => setStudentForm({ ...studentForm, status: value })}>
                  <SelectTrigger className="bg-white/50 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Courses</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {courses.map((course) => (
                    <div key={course._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`course-${course._id}`}
                        checked={studentForm.courseIds.includes(course._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStudentForm({
                              ...studentForm,
                              courseIds: [...studentForm.courseIds, course._id]
                            });
                          } else {
                            setStudentForm({
                              ...studentForm,
                              courseIds: studentForm.courseIds.filter(id => id !== course._id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`course-${course._id}`} className="text-sm">
                        {course.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={studentForm.notes}
                  onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                  className="bg-white/50 border-white/30"
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStudentSubmit}>
              {editingStudent ? 'Update' : 'Create'} Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-green-600" />
              {editingUser ? 'Edit' : 'Add'} User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={userForm.contact}
                onChange={(e) => setUserForm({ ...userForm, contact: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nic">NIC</Label>
              <Input
                id="nic"
                value={userForm.nic}
                onChange={(e) => setUserForm({ ...userForm, nic: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                value={userForm.work}
                onChange={(e) => setUserForm({ ...userForm, work: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={userForm.address}
                onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                className="bg-white/50 border-white/30"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {editingUser && '(Leave blank to keep current)'}</Label>
              <Input
                id="password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUserSubmit}>
              {editingUser ? 'Update' : 'Create'} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Director Form Dialog */}
      <Dialog open={directorDialog} onOpenChange={setDirectorDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-purple-600" />
              {editingDirector ? 'Edit' : 'Add'} Director
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={directorForm.username}
                onChange={(e) => setDirectorForm({ ...directorForm, username: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={directorForm.email}
                onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={directorForm.contact}
                onChange={(e) => setDirectorForm({ ...directorForm, contact: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nic">NIC</Label>
              <Input
                id="nic"
                value={directorForm.nic}
                onChange={(e) => setDirectorForm({ ...directorForm, nic: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                value={directorForm.work}
                onChange={(e) => setDirectorForm({ ...directorForm, work: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={directorForm.address}
                onChange={(e) => setDirectorForm({ ...directorForm, address: e.target.value })}
                className="bg-white/50 border-white/30"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {editingDirector && '(Leave blank to keep current)'}</Label>
              <Input
                id="password"
                type="password"
                value={directorForm.password}
                onChange={(e) => setDirectorForm({ ...directorForm, password: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDirectorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDirectorSubmit}>
              {editingDirector ? 'Update' : 'Create'} Director
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Form Dialog */}
      <Dialog open={adminDialog} onOpenChange={setAdminDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-6 w-6 text-red-600" />
              {editingAdmin ? 'Edit' : 'Add'} Admin
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={adminForm.username}
                onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={adminForm.contact}
                onChange={(e) => setAdminForm({ ...adminForm, contact: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nic">NIC</Label>
              <Input
                id="nic"
                value={adminForm.nic}
                onChange={(e) => setAdminForm({ ...adminForm, nic: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                value={adminForm.work}
                onChange={(e) => setAdminForm({ ...adminForm, work: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={adminForm.address}
                onChange={(e) => setAdminForm({ ...adminForm, address: e.target.value })}
                className="bg-white/50 border-white/30"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {editingAdmin && '(Leave blank to keep current)'}</Label>
              <Input
                id="password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdminSubmit}>
              {editingAdmin ? 'Update' : 'Create'} Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Form Dialog */}
      <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              {editingCourse ? 'Edit' : 'Add'} Course
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="bg-white/50 border-white/30"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats *</Label>
                <Input
                  id="availableSeats"
                  type="number"
                  value={courseForm.availableSeats}
                  onChange={(e) => setCourseForm({ ...courseForm, availableSeats: Number(e.target.value) })}
                  className="bg-white/50 border-white/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCourseSubmit}>
              {editingCourse ? 'Update' : 'Create'} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Form Dialog */}
      <Dialog open={contactDialog} onOpenChange={setContactDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              {editingContact ? 'Edit' : 'Add'} Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="bg-white/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="bg-white/50 border-white/30"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="read"
                checked={contactForm.read}
                onChange={(e) => setContactForm({ ...contactForm, read: e.target.checked })}
              />
              <Label htmlFor="read">Mark as read</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleContactSubmit}>
              {editingContact ? 'Update' : 'Create'} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Detail Dialog */}
      <Dialog open={studentDetailDialog} onOpenChange={setStudentDetailDialog}>
        <DialogContent className="max-w-4xl backdrop-blur-xl bg-white/95 border border-white/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Student Details
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Avatar className="h-16 w-16 ring-4 ring-white">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedStudent.firstName}${selectedStudent.lastName}`} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {getInitials(selectedStudent.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.fullName}</h3>
                  <p className="text-gray-600">{selectedStudent.studentId}</p>
                  <Badge className={getStatusColor(selectedStudent.status)}>
                    {getStatusIcon(selectedStudent.status)}
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NIC:</span>
                      <span>{selectedStudent.nic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span>{selectedStudent.age}</span>
                    </div>
                    <div className="pt-2">
                      <span>Address:</span>
                      <p className="mt-1">{selectedStudent.address}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Guardian Name:</span>
                      <span>{selectedStudent.guardianName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guardian Phone:</span>
                      <span>{selectedStudent.guardianPhone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrollment Date:</span>
                      <span>{formatDate(selectedStudent.enrollmentDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStudent.enrolledCourses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.enrolledCourses.map((enrollment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{enrollment.courseId.title}</h4>
                            <p className="text-sm text-gray-600">{enrollment.courseId.duration}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(enrollment.status)}>
                              {enrollment.status}
                            </Badge>
                            <p className="text-sm text-gray-600">{enrollment.progress}% Complete</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No courses enrolled</p>
                  )}
                </CardContent>
              </Card>

              {selectedStudent.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedStudent.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Detail Dialog */}
      <Dialog open={contactDetailDialog} onOpenChange={setContactDetailDialog}>
        <DialogContent className="max-w-2xl backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              Contact Details
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Message</Label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-800 leading-relaxed">{selectedContact.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Received: {formatDate(selectedContact.createdAt)}</span>
                </div>
                <Badge variant={selectedContact.read ? 'default' : 'secondary'}>
                  {selectedContact.read ? 'Read' : 'Unread'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}