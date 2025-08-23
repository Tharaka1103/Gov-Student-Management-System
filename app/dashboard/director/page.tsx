'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  User, 
  Users, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Calendar,
  Award,
  Sparkles,
  Coffee,
  TrendingUp,
  Clock,
  DollarSign,
  UserCheck,
  Briefcase,
  Shield,
  Home,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';
import DeleteConfirm from '@/components/DeleteConfirm';
import { cn } from '@/lib/utils';

export default function DirectorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ _id: string, email: string, username: string, contact: string, nic: string, address: string } | null>(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState({ students: '', courses: '' });
  const [form, setForm] = useState({ id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '' });
  const [courseForm, setCourseForm] = useState({ id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
  const [openDialog, setOpenDialog] = useState({ type: '', action: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' }).then(res => {
      if (!res.ok) return router.push('/login');
      return res.json();
    }).then(data => {
      if (data.role !== 'director') router.push('/'); 
      setUser(data);
      fetchData();
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, []);

  const fetchData = async () => {
    try {
      const [stuRes, couRes] = await Promise.all([
        fetch('/api/users?role=user', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' })
      ]);
      setStudents(await stuRes.json());
      console.table(stuRes);
      setCourses(await couRes.json());
    } catch (error) {
      showNotification('error', 'Failed to fetch data. Please refresh the page.');
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleSubmit = async (type: string) => {
    setSaving(true);
    try {
      const endpoint = type === 'course' ? '/api/courses' : '/api/users';
      const body = type === 'course' ? courseForm : { ...form, id: user?._id };
      const method = body.id ? 'PUT' : 'POST';
      await fetch(endpoint, { method, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      fetchData();
      setOpenDialog({ type: '', action: '' });
      showNotification('success', `${type === 'course' ? 'Course' : 'User'} ${method === 'PUT' ? 'updated' : 'added'} successfully! 🎉`);
    } catch (error) {
      showNotification('error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      const endpoint = type === 'course' ? `/api/courses?id=${id}` : `/api/users?id=${id}`;
      await fetch(endpoint, { method: 'DELETE', credentials: 'include' });
      fetchData();
      showNotification('success', `${type === 'course' ? 'Course' : 'User'} deleted successfully!`);
    } catch (error) {
      showNotification('error', 'Failed to delete. Please try again.');
    }
  };

  const openForm = (type: string, action: string, item?: any) => {
    if (type === 'course') setCourseForm(item || { id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
    else if (type === 'self') setForm({ id: user?._id || '', email: user?.email || '', username: user?.username || '', contact: user?.contact || '', nic: user?.nic || '', address: user?.address || '', password: '' });
    else setForm(item ? { ...item, id: item._id, password: '' } : { id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '' });
    setOpenDialog({ type, action });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: <Coffee className="w-5 h-5" />, emoji: '☀️' };
    if (hour < 18) return { text: 'Good Afternoon', icon: <Sparkles className="w-5 h-5" />, emoji: '🌤️' };
    return { text: 'Good Evening', icon: <Sparkles className="w-5 h-5" />, emoji: '🌙' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading your awesome dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const greeting = getGreeting();
  const filteredStudents = students.filter((item: any) => item.username.toLowerCase().includes(search.students.toLowerCase()));
  const filteredCourses = courses.filter((item: any) => item.title.toLowerCase().includes(search.courses.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header role="director" />
      
      {/* Notification */}
      {notification.show && (
        <div className={cn(
          "fixed top-20 right-4 z-50 animate-in slide-in-from-top-2",
          "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg",
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in duration-500">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{greeting.text}, {user.username}! {greeting.emoji}</h1>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Shield className="w-4 h-4" />
                      Director Access • Leading the way to success
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Award className="w-5 h-5 mr-2" />
                  Director
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Growing community
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold">{courses.length}</p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    Active programs
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold">95%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <Target className="w-3 h-3" />
                    Excellence achieved
                  </p>
                </div>
                <GraduationCap className="w-10 h-10 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 animate-in fade-in duration-500">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">My Profile</CardTitle>
                    <CardDescription>Manage your personal information and account settings</CardDescription>
                  </div>
                  <Button onClick={() => openForm('self', 'edit')} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 border-4 border-primary/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <p className="text-lg font-medium">{user.username}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </Label>
                      <p className="text-lg font-medium">{user.contact || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        NIC
                      </Label>
                      <p className="text-lg font-medium">{user.nic || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Address
                      </Label>
                      <p className="text-lg font-medium">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Danger Zone:</strong> Deleting your profile will permanently remove all your data.
                  </AlertDescription>
                </Alert>
                
                <DeleteConfirm onConfirm={() => handleDelete('user', user._id)}>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete My Profile
                  </Button>
                </DeleteConfirm>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4 animate-in fade-in duration-500">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Student Management</CardTitle>
                    <CardDescription>View and manage all registered students</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search students..."
                        value={search.students}
                        onChange={e => setSearch({ ...search, students: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={() => openForm('user', 'add')} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead className="hidden md:table-cell">Contact</TableHead>
                          <TableHead className="hidden lg:table-cell">NIC</TableHead>
                          <TableHead className="hidden lg:table-cell">Work</TableHead>
                          <TableHead className="hidden xl:table-cell">Address</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student: any) => (
                          <TableRow key={student._id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} />
                                  <AvatarFallback>{getInitials(student.username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.username}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                {student.contact || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{student.nic || 'N/A'}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant="secondary">
                                <Briefcase className="w-3 h-3 mr-1" />
                                {student.work || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate max-w-[200px]">{student.address || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openForm('user', 'edit', student)}
                                  className="hover:bg-primary/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <DeleteConfirm onConfirm={() => handleDelete('user', student._id)}>
                                  <Button variant="ghost" size="sm" className="hover:bg-red-100">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </DeleteConfirm>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-muted-foreground">Add your first student to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4 animate-in fade-in duration-500">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Course Management</CardTitle>
                    <CardDescription>Manage your educational programs and courses</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search courses..."
                        value={search.courses}
                        onChange={e => setSearch({ ...search, courses: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={() => openForm('course', 'add')} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Course
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map((course: any) => (
                      <Card key={course._id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold">LKR {course.price}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span>{course.availableSeats} seats</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openForm('course', 'edit', course)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DeleteConfirm onConfirm={() => handleDelete('course', course._id)}>
                            <Button variant="ghost" size="sm" className="hover:bg-red-100">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </DeleteConfirm>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No courses found</p>
                    <p className="text-muted-foreground">Create your first course to start teaching!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer role="director" />

      {/* User/Profile Form Dialog */}
      <Dialog open={openDialog.type === 'user' || openDialog.type === 'self'} onOpenChange={() => setOpenDialog({ type: '', action: '' })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {openDialog.type === 'self' ? (
                <>
                  <User className="w-5 h-5" />
                  Edit Profile
                </>
              ) : openDialog.action === 'add' ? (
                <>
                  <Plus className="w-5 h-5" />
                  Add New Student
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Student
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {openDialog.type === 'self' 
                ? 'Update your personal information'
                : openDialog.action === 'add'
                ? 'Enter the details of the new student'
                : 'Update student information'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input 
                id="username"
                value={form.username} 
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact
              </Label>
              <Input 
                id="contact"
                value={form.contact} 
                onChange={e => setForm({ ...form, contact: e.target.value })}
                placeholder="+94 77 123 4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nic" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                NIC
              </Label>
              <Input 
                id="nic"
                value={form.nic} 
                onChange={e => setForm({ ...form, nic: e.target.value })}
                placeholder="200012345678"
              />
            </div>
            {openDialog.type !== 'self' && (
              <div className="grid gap-2">
                <Label htmlFor="work" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Work
                </Label>
                <Input 
                  id="work"
                  value={form.work} 
                  onChange={e => setForm({ ...form, work: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Address
              </Label>
              <Textarea 
                id="address"
                value={form.address} 
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main Street, Colombo"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Password {openDialog.action === 'edit' && '(leave empty to keep current)'}
              </Label>
              <Input 
                id="password"
                type="password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog({ type: '', action: '' })}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit('user')} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Form Dialog */}
      <Dialog open={openDialog.type === 'course'} onOpenChange={() => setOpenDialog({ type: '', action: '' })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {openDialog.action === 'add' ? (
                <>
                  <Plus className="w-5 h-5" />
                  Create New Course
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Course
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {openDialog.action === 'add' 
                ? 'Fill in the details to create a new course'
                : 'Update the course information'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Title
              </Label>
              <Input 
                id="title"
                value={courseForm.title} 
                onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="Advanced Web Development"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration
              </Label>
              <Input 
                id="duration"
                value={courseForm.duration} 
                onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                placeholder="3 months"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Description
              </Label>
              <Textarea 
                id="description"
                value={courseForm.description} 
                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Learn modern web development with React, Node.js, and more..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price (LKR)
                </Label>
                <Input 
                  id="price"
                  type="number" 
                  value={courseForm.price} 
                  onChange={e => setCourseForm({ ...courseForm, price: +e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seats" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Available Seats
                </Label>
                <Input 
                  id="seats"
                  type="number" 
                  value={courseForm.availableSeats} 
                  onChange={e => setCourseForm({ ...courseForm, availableSeats: +e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog({ type: '', action: '' })}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit('course')} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {openDialog.action === 'add' ? 'Create Course' : 'Save Changes'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}