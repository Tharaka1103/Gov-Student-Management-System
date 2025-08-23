'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Users, 
  BookOpen, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Briefcase, 
  MapPin, 
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
  GraduationCap,
  Award,
  TrendingUp,
  Eye,
  Filter,
  Download
} from 'lucide-react';

// Interfaces
interface User {
  _id: string;
  email: string;
  username: string;
  contact?: string;
  nic?: string;
  work?: string;
  address?: string;
  role: string;
  createdAt?: string;
}

interface Course {
  _id: string;
  title: string;
  duration: string;
  description: string;
  price: number;
  availableSeats: number;
  instructor?: string;
  category?: string;
  createdAt?: string;
}

interface SearchState {
  students: string;
  courses: string;
}

interface SectionProps {
  title: 'students' | 'courses';
  data: User[] | Course[];
  searchKey: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<SearchState>({ students: '', courses: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.role !== 'user') {
          router.push('/');
          return;
        }
        setUser(data);
        await fetchData();
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [router]);

  const fetchData = async (): Promise<void> => {
    try {
      const [stuRes, couRes] = await Promise.all([
        fetch('/api/users?role=user', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' })
      ]);
      
      if (stuRes.ok) {
        const studentsData = await stuRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      }
      
      if (couRes.ok) {
        const coursesData = await couRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
      setCourses([]);
    }
  };

  const handleSearchChange = (type: keyof SearchState, value: string): void => {
    setSearch(prev => ({ ...prev, [type]: value }));
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const StudentsSection: React.FC<SectionProps> = ({ searchValue, onSearchChange }) => {
    const filteredStudents = students.filter(student => 
      student.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.email.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
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
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student._id} className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.username}`} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(student.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{student.username}</CardTitle>
                    <CardDescription className="text-sm">{student.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.contact && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {student.contact}
                  </div>
                )}
                {student.work && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {student.work}
                  </div>
                )}
                {student.nic && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {student.nic}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Student
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No students found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    );
  };

  const CoursesSection: React.FC<SectionProps> = ({ searchValue, onSearchChange }) => {
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchValue.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
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
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${course.price}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserCheck className="w-4 h-4 mr-2" />
                    {course.availableSeats} seats
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(course.createdAt)}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header role="user" />

      <main className="flex-grow p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome back, {user.username}!
            </h1>
            <p className="text-xl text-gray-600">Manage your learning journey from your personalized dashboard</p>
          </div>

          {/* User Profile Card */}
          <Card className="backdrop-blur-xl bg-blue-100 border border-primary shadow-2xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <CardTitle className="text-2xl mb-2">{user.username}</CardTitle>
                  <CardDescription className="text-lg mb-4">{user.email}</CardDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.contact && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.contact}
                      </div>
                    )}
                    {user.work && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {user.work}
                      </div>
                    )}
                    {user.nic && (
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {user.nic}
                      </div>
                    )}
                  </div>
                  {user.address && (
                    <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.address}
                    </div>
                  )}
                </div>
                <Badge className="bg-primary text-white px-4 py-2">
                  User Dashboard
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Active learners</span>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Courses</p>
                    <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Learning paths</span>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Seats</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {courses.reduce((sum, course) => sum + course.availableSeats, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span>Opportunities</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="students" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white/50"
                  >
                    <Users className="w-4 h-4" />
                    <span>Students ({students.length})</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="courses" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white/50"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Courses ({courses.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-6">
                  <StudentsSection
                    title="students"
                    data={students}
                    searchKey="username"
                    searchValue={search.students}
                    onSearchChange={(value) => handleSearchChange('students', value)}
                  />
                </TabsContent>

                <TabsContent value="courses" className="space-y-6">
                  <CoursesSection
                    title="courses"
                    data={courses}
                    searchKey="title"
                    searchValue={search.courses}
                    onSearchChange={(value) => handleSearchChange('courses', value)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer role="user" />
    </div>
  );
}