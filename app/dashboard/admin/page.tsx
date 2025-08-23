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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Table2,
  Clock,
  Shield,
  Settings,
  BarChart3,
  Award,
  Target,
  Activity,
  Bell,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  Star,
  Zap
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

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SearchState {
  students: string;
  directors: string;
  admins: string;
  courses: string;
  contacts: string;
}

// Define valid search keys as a union type
type SearchKey = keyof SearchState;

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | '';
  message: string;
}

interface UserForm {
  id: string;
  email: string;
  username: string;
  contact: string;
  nic: string;
  work: string;
  address: string;
  password: string;
  role: string;
}

interface CourseForm {
  id: string;
  title: string;
  duration: string;
  description: string;
  price: number;
  availableSeats: number;
}

interface DialogState {
  type: string;
  action: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
  trend?: number;
}

interface DataTableProps {
  data: any[];
  searchKey: string;
  type: SearchKey; // Changed to use SearchKey union type
  fields: string[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  customActions?: (item: any) => React.ReactNode;
  searchState: SearchState; // Added searchState prop
  onSearchChange: (type: SearchKey, value: string) => void; // Added search change handler
}

interface ContactDetailDialogProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [directors, setDirectors] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: '', message: '' });
  const [search, setSearch] = useState<SearchState>({ 
    students: '', 
    directors: '', 
    admins: '', 
    courses: '', 
    contacts: '' 
  });
  const [form, setForm] = useState<UserForm>({ 
    id: '', 
    email: '', 
    username: '', 
    contact: '', 
    nic: '', 
    work: '', 
    address: '', 
    password: '', 
    role: '' 
  });
  const [courseForm, setCourseForm] = useState<CourseForm>({ 
    id: '', 
    title: '', 
    duration: '', 
    description: '', 
    price: 0, 
    availableSeats: 0 
  });
  const [openDialog, setOpenDialog] = useState<DialogState>({ type: '', action: '' });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

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

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [stuRes, dirRes, admRes, couRes, conRes] = await Promise.all([
        fetch('/api/users?role=user', { credentials: 'include' }),
        fetch('/api/users?role=director', { credentials: 'include' }),
        fetch('/api/users?role=admin', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' }),
        fetch('/api/contacts', { credentials: 'include' })
      ]);
      
      if (stuRes.ok) {
        const studentsData = await stuRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      }
      if (dirRes.ok) {
        const directorsData = await dirRes.json();
        setDirectors(Array.isArray(directorsData) ? directorsData : []);
      }
      if (admRes.ok) {
        const adminsData = await admRes.json();
        setAdmins(Array.isArray(adminsData) ? adminsData : []);
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

  const refreshData = async (): Promise<void> => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    showAlert('success', 'Data refreshed successfully');
  };

  const showAlert = (type: 'success' | 'error', message: string): void => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleSubmit = async (type: string): Promise<void> => {
    try {
      const endpoint = type === 'course' ? '/api/courses' : '/api/users';
      const body = type === 'course' ? courseForm : form;
      const method = body.id ? 'PUT' : 'POST';
      const response = await fetch(endpoint, { 
        method, 
        body: JSON.stringify(body), 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include' 
      });
      
      if (response.ok) {
        showAlert('success', `${type} ${body.id ? 'updated' : 'created'} successfully`);
        await fetchData();
        setOpenDialog({ type: '', action: '' });
        resetForm();
      } else {
        showAlert('error', 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleDelete = async (type: string, id: string): Promise<void> => {
    try {
      const endpoint = type === 'course' 
        ? `/api/courses?id=${id}` 
        : type === 'contact' 
        ? `/api/contacts?id=${id}` 
        : `/api/users?id=${id}`;
      const response = await fetch(endpoint, { method: 'DELETE', credentials: 'include' });
      
      if (response.ok) {
        showAlert('success', `${type} deleted successfully`);
        await fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openForm = (type: string, action: string, item?: any): void => {
    if (type === 'course') {
      setCourseForm(item || { id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
    } else {
      setForm(item ? { ...item, id: item._id, role: type, password: '' } : { 
        id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '', role: type 
      });
    }
    setOpenDialog({ type, action });
  };

  const resetForm = (): void => {
    setForm({ id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '', role: '' });
    setCourseForm({ id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
  };

  // Fixed search change handler with proper typing
  const handleSearchChange = (type: SearchKey, value: string): void => {
    setSearch(prev => ({ ...prev, [type]: value }));
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Statistics calculations
  const stats = {
    totalStudents: students.length,
    totalDirectors: directors.length,
    totalAdmins: admins.length,
    totalCourses: courses.length,
    totalContacts: contacts.length,
    totalRevenue: courses.reduce((sum, course) => sum + (course.price * (course.enrolledStudents || 0)), 0),
    unreadContacts: contacts.filter(contact => !contact.read).length,
    availableSeats: courses.reduce((sum, course) => sum + course.availableSeats, 0)
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description, trend }) => (
    <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        {description && (
          <div className="flex items-center text-sm text-gray-600">
            {trend && (
              <div className={`flex items-center mr-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
            <span>{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Fixed DataTable component with proper typing
  const DataTable: React.FC<DataTableProps> = ({ 
    data, 
    searchKey, 
    type, 
    fields, 
    onEdit, 
    onDelete, 
    customActions,
    searchState,
    onSearchChange
  }) => {
    // Now TypeScript knows that searchState[type] is valid because type is SearchKey
    const searchValue = searchState[type];
    const filtered = data.filter((item: any) => {
      const searchableValue = item[searchKey];
      if (typeof searchableValue === 'string') {
        return searchableValue.toLowerCase().includes(searchValue.toLowerCase());
      }
      return false;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${type}...`}
              value={searchValue}
              onChange={(e) => onSearchChange(type, e.target.value)}
              className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => openForm(type, 'add')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/30 border border-white/20">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  {fields.map((field: string) => (
                    <TableHead key={field} className="font-semibold text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={fields.length + 1} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No {type} found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-white/20 transition-colors border-white/10">
                      {fields.map((field: string) => (
                        <TableCell key={field} className="text-gray-700">
                          {field === 'price' ? `LKR ${item[field]?.toLocaleString()}` :
                           field === 'read' ? (
                             <Badge variant={item[field] ? 'default' : 'secondary'} className="font-medium">
                               {item[field] ? 'Read' : 'Unread'}
                             </Badge>
                           ) :
                           field === 'message' ? (
                             <div className="max-w-xs truncate" title={item[field]}>
                               {item[field]}
                             </div>
                           ) :
                           item[field] || 'N/A'}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {customActions && customActions(item)}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <DeleteConfirm onConfirm={() => onDelete(item._id)}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100">
                              <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                          </DeleteConfirm>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    );
  };

  const ContactDetailDialog: React.FC<ContactDetailDialogProps> = ({ contact, open, onClose }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-white/95 border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Contact Details
          </DialogTitle>
        </DialogHeader>
        {contact && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{contact.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Message</Label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-800 leading-relaxed">{contact.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Received: {formatDate(contact.createdAt)}</span>
              </div>
              <Badge variant={contact.read ? 'default' : 'secondary'}>
                {contact.read ? 'Read' : 'Unread'}
              </Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

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
      <Header role="admin" />
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-200 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      
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
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents.toLocaleString()}
              icon={Users}
              color="from-blue-500 to-blue-600"
              description="Active learners"
              trend={12}
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses.toLocaleString()}
              icon={BookOpen}
              color="from-green-500 to-green-600"
              description="Available courses"
              trend={8}
            />
            <StatCard
              title="Unread Messages"
              value={stats.unreadContacts.toLocaleString()}
              icon={MessageSquare}
              color="from-orange-500 to-orange-600"
              description="Pending responses"
              trend={-15}
            />
            <StatCard
              title="Available Seats"
              value={stats.availableSeats.toLocaleString()}
              icon={Target}
              color="from-purple-500 to-purple-600"
              description="Across all courses"
              trend={5}
            />
          </div>

          {/* Management Tabs */}
          <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white/50 backdrop-blur-sm">
                  <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white/70">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="students" className="flex items-center gap-2 data-[state=active]:bg-white/70">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Students</span>
                  </TabsTrigger>
                  <TabsTrigger value="staff" className="flex items-center gap-2 data-[state=active]:bg-white/70">
                    <UserCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Staff</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-white/70">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Courses</span>
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="flex items-center gap-2 data-[state=active]:bg-white/70">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Messages</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          System Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium">Total Users</span>
                          <Badge variant="secondary" className="text-lg">
                            {stats.totalStudents + stats.totalDirectors + stats.totalAdmins}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">Active Courses</span>
                          <Badge variant="secondary" className="text-lg">{stats.totalCourses}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium">Total Revenue</span>
                          <Badge variant="secondary" className="text-lg">
                            LKR {stats.totalRevenue.toLocaleString()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-orange-600" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          onClick={() => openForm('user', 'add')} 
                          className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Student
                        </Button>
                        <Button 
                          onClick={() => openForm('course', 'add')} 
                          className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Course
                        </Button>
                        <Button 
                          onClick={() => openForm('director', 'add')} 
                          className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Director
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="students">
                  <DataTable
                    data={students}
                    searchKey="username"
                    type="students"
                    fields={['email', 'username', 'contact', 'nic', 'work', 'address']}
                    onEdit={(item: User) => openForm('user', 'edit', item)}
                    onDelete={(id: string) => handleDelete('user', id)}
                    searchState={search}
                    onSearchChange={handleSearchChange}
                  />
                </TabsContent>

                <TabsContent value="staff">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Crown className="h-6 w-6 text-purple-600" />
                        Directors ({directors.length})
                      </h3>
                      <DataTable
                        data={directors}
                        searchKey="username"
                        type="directors"
                        fields={['email', 'username', 'contact', 'nic', 'address']}
                        onEdit={(item: User) => openForm('director', 'edit', item)}
                        onDelete={(id: string) => handleDelete('director', id)}
                        searchState={search}
                        onSearchChange={handleSearchChange}
                      />
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-red-600" />
                        Administrators ({admins.length})
                      </h3>
                      <DataTable
                        data={admins}
                        searchKey="username"
                        type="admins"
                        fields={['email', 'username', 'contact', 'nic', 'address']}
                        onEdit={(item: User) => openForm('admin', 'edit', item)}
                        onDelete={(id: string) => handleDelete('admin', id)}
                        searchState={search}
                        onSearchChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="courses">
                  <DataTable
                    data={courses}
                    searchKey="title"
                    type="courses"
                    fields={['title', 'duration', 'price', 'availableSeats']}
                    onEdit={(item: Course) => openForm('course', 'edit', item)}
                    onDelete={(id: string) => handleDelete('course', id)}
                    searchState={search}
                    onSearchChange={handleSearchChange}
                  />
                </TabsContent>

                <TabsContent value="contacts">
                  <DataTable
                    data={contacts}
                    searchKey="name"
                    type="contacts"
                    fields={['name', 'email', 'message', 'read']}
                    onEdit={() => {}}
                    onDelete={(id: string) => handleDelete('contact', id)}
                    searchState={search}
                    onSearchChange={handleSearchChange}
                    customActions={(contact: Contact) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                        className="h-8 w-8 p-0 hover:bg-green-100"
                      >
                        <Eye className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer role="admin" />

      {/* Contact Detail Dialog */}
      <ContactDetailDialog
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      />

      {/* User Form Dialog */}
      <Dialog 
        open={openDialog.type !== 'course' && !!openDialog.type} 
        onOpenChange={(open) => {
          if (!open) {
            setOpenDialog({ type: '', action: '' });
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-blue-600" />
              {openDialog.action === 'add' ? 'Add' : 'Edit'} {openDialog.type?.charAt(0).toUpperCase() + openDialog.type?.slice(1)}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email address"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="font-medium">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-green-600" />
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="Enter contact number"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nic" className="font-medium">National ID</Label>
                <Input
                  id="nic"
                  value={form.nic}
                  onChange={(e) => setForm({ ...form, nic: e.target.value })}
                  placeholder="Enter NIC number"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
              
              {openDialog.type === 'user' && (
                <div className="space-y-2">
                  <Label htmlFor="work" className="font-medium">Occupation</Label>
                  <Input
                    id="work"
                    value={form.work}
                    onChange={(e) => setForm({ ...form, work: e.target.value })}
                    placeholder="Enter occupation"
                    className="bg-white/50 border-white/30 focus:bg-white/70"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter address"
                  rows={3}
                  className="bg-white/50 border-white/30 focus:bg-white/70 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium">
                  Password {form.id && '(Leave blank to keep current)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog({ type: '', action: '' })}
              className="bg-white/50 backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSubmit('user')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {openDialog.action === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Form Dialog */}
      <Dialog 
        open={openDialog.type === 'course'} 
        onOpenChange={(open) => {
          if (!open) {
            setOpenDialog({ type: '', action: '' });
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6 text-green-600" />
              {openDialog.action === 'add' ? 'Add' : 'Edit'} Course
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">Course Title</Label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="Enter course title"
                className="bg-white/50 border-white/30 focus:bg-white/70"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-blue-600" />
                Duration
              </Label>
              <Input
                id="duration"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                placeholder="e.g., 6 months, 1 year"
                className="bg-white/50 border-white/30 focus:bg-white/70"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <Textarea
                id="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Enter course description"
                rows={3}
                className="bg-white/50 border-white/30 focus:bg-white/70 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Price (LKR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: +e.target.value })}
                  placeholder="0"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats" className="flex items-center gap-2 font-medium">
                  <Table2 className="h-4 w-4 text-purple-600" />
                  Available Seats
                </Label>
                <Input
                  id="seats"
                  type="number"
                  value={courseForm.availableSeats}
                  onChange={(e) => setCourseForm({ ...courseForm, availableSeats: +e.target.value })}
                  placeholder="0"
                  className="bg-white/50 border-white/30 focus:bg-white/70"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog({ type: '', action: '' })}
              className="bg-white/50 backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSubmit('course')}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {openDialog.action === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}