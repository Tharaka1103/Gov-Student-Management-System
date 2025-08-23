'use client';
import { SetStateAction, useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Clock
} from 'lucide-react';
import DeleteConfirm from '@/components/DeleteConfirm';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [search, setSearch] = useState({ students: '', directors: '', admins: '', courses: '', contacts: '' });
  const [form, setForm] = useState({ id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '', role: '' });
  const [courseForm, setCourseForm] = useState({ id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
  const [openDialog, setOpenDialog] = useState({ type: '', action: '' });
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' }).then(res => {
      if (!res.ok) return router.push('/login');
      return res.json();
    }).then(data => {
      if (data.role !== 'admin') router.push('/'); 
      setUser(data);
      fetchData();
    }).catch(() => router.push('/login'));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, dirRes, admRes, couRes, conRes] = await Promise.all([
        fetch('/api/users?role=user', { credentials: 'include' }),
        fetch('/api/users?role=director', { credentials: 'include' }),
        fetch('/api/users?role=admin', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' }),
        fetch('/api/contacts', { credentials: 'include' })
      ]);
      setStudents(await stuRes.json());
      setDirectors(await dirRes.json());
      setAdmins(await admRes.json());
      setCourses(await couRes.json());
      setContacts(await conRes.json());
    } catch (error) {
      showAlert('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleSubmit = async (type: string) => {
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
        fetchData();
        setOpenDialog({ type: '', action: '' });
      } else {
        showAlert('error', 'Operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      const endpoint = type === 'course' ? `/api/courses?id=${id}` : type === 'contact' ? `/api/contacts?id=${id}` : `/api/users?id=${id}`;
      const response = await fetch(endpoint, { method: 'DELETE', credentials: 'include' });
      
      if (response.ok) {
        showAlert('success', `${type} deleted successfully`);
        fetchData();
      } else {
        showAlert('error', 'Delete operation failed');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
    }
  };

  const openForm = (type: string, action: string, item?: any) => {
    if (type === 'course') {
      setCourseForm(item || { id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
    } else {
      setForm(item ? { ...item, id: item._id, role: type, password: '' } : { 
        id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '', role: type 
      });
    }
    setOpenDialog({ type, action });
  };

  const resetForm = () => {
    setForm({ id: '', email: '', username: '', contact: '', nic: '', work: '', address: '', password: '', role: '' });
    setCourseForm({ id: '', title: '', duration: '', description: '', price: 0, availableSeats: 0 });
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

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  const DataTable = ({ data, searchKey, type, fields, onEdit, onDelete, customActions }: any) => {
    const filtered = data.filter((item: any) => 
      item[searchKey]?.toLowerCase().includes(search[type]?.toLowerCase() || '')
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${type}...`}
              value={search[type] || ''}
              onChange={e => setSearch({ ...search, [type]: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button onClick={() => openForm(type, 'add')} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>

        <Card>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {fields.map((field: string) => (
                    <TableHead key={field} className="font-semibold">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={fields.length + 1} className="text-center py-8 text-muted-foreground">
                      No {type} found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-muted/50">
                      {fields.map((field: string) => (
                        <TableCell key={field}>
                          {field === 'price' ? `LKR ${item[field]}` :
                           field === 'read' ? (
                             <Badge variant={item[field] ? 'default' : 'secondary'}>
                               {item[field] ? 'Read' : 'Unread'}
                             </Badge>
                           ) :
                           field === 'message' ? (
                             <div className="max-w-xs truncate">{item[field]}</div>
                           ) :
                           item[field]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {customActions && customActions(item)}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DeleteConfirm onConfirm={() => onDelete(item._id)}>
                              <Trash className="h-4 w-4" />
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

  const ContactDetailDialog = ({ contact, open, onClose }: any) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Details
          </DialogTitle>
        </DialogHeader>
        {contact && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{contact.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{contact.email}</span>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Message</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                {contact.message}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Received: {new Date(contact.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header role="admin" />
      
      {/* Alert */}
      {alert.show && (
        <Alert className={`mx-4 mt-4 ${alert.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
          {alert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <main className="flex-grow p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your educational platform</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Welcome back, {user.username}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="text-blue-500"
              description="Active learners"
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={BookOpen}
              color="text-green-500"
              description="Available courses"
            />
            <StatCard
              title="Unread Messages"
              value={stats.unreadContacts}
              icon={MessageSquare}
              color="text-orange-500"
              description="Pending responses"
            />
            <StatCard
              title="Available Seats"
              value={stats.availableSeats}
              icon={Table2}
              color="text-purple-500"
              description="Across all courses"
            />
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Students</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Students</span>
                      <Badge variant="secondary">{stats.totalStudents}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Directors</span>
                      <Badge variant="secondary">{stats.totalDirectors}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admins</span>
                      <Badge variant="secondary">{stats.totalAdmins}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Course Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Courses</span>
                      <Badge variant="secondary">{stats.totalCourses}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available Seats</span>
                      <Badge variant="secondary">{stats.availableSeats}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Messages</span>
                      <Badge variant="destructive">{stats.unreadContacts}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <DataTable
                data={students}
                searchKey="username"
                type="user"
                fields={['email', 'username', 'contact', 'nic', 'work', 'address']}
                onEdit={(item: any) => openForm('user', 'edit', item)}
                onDelete={(id: string) => handleDelete('user', id)}
              />
            </TabsContent>

            <TabsContent value="staff">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Directors
                  </h3>
                  <DataTable
                    data={directors}
                    searchKey="username"
                    type="director"
                    fields={['email', 'username', 'contact', 'nic', 'address']}
                    onEdit={(item: any) => openForm('director', 'edit', item)}
                    onDelete={(id: string) => handleDelete('director', id)}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Administrators
                  </h3>
                  <DataTable
                    data={admins}
                    searchKey="username"
                    type="admin"
                    fields={['email', 'username', 'contact', 'nic', 'address']}
                    onEdit={(item: any) => openForm('admin', 'edit', item)}
                    onDelete={(id: string) => handleDelete('admin', id)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <DataTable
                data={courses}
                searchKey="title"
                type="course"
                fields={['title', 'duration', 'price', 'availableSeats']}
                onEdit={(item: any) => openForm('course', 'edit', item)}
                onDelete={(id: string) => handleDelete('course', id)}
              />
            </TabsContent>

            <TabsContent value="contacts">
              <DataTable
                data={contacts}
                searchKey="name"
                type="contact"
                fields={['name', 'email', 'message', 'read']}
                onEdit={() => {}}
                onDelete={(id: string) => handleDelete('contact', id)}
                customActions={(contact: SetStateAction<null>) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedContact(contact)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              />
            </TabsContent>
          </Tabs>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {openDialog.action === 'add' ? 'Add' : 'Edit'} {openDialog.type?.charAt(0).toUpperCase() + openDialog.type?.slice(1)}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  value={form.nic}
                  onChange={e => setForm({ ...form, nic: e.target.value })}
                  placeholder="Enter NIC number"
                />
              </div>
              
              {openDialog.type === 'user' && (
                <div className="space-y-2">
                  <Label htmlFor="work">Work</Label>
                  <Input
                    id="work"
                    value={form.work}
                    onChange={e => setForm({ ...form, work: e.target.value })}
                    placeholder="Enter work details"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password {form.id && '(Leave blank to keep current)'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog({ type: '', action: '' })}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit('user')}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {openDialog.action === 'add' ? 'Add' : 'Edit'} Course
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="Enter course title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </Label>
              <Input
                id="duration"
                value={courseForm.duration}
                onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                placeholder="e.g., 6 months, 1 year"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={courseForm.description}
                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price (LKR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={courseForm.price}
                  onChange={e => setCourseForm({ ...courseForm, price: +e.target.value })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats" className="flex items-center gap-2">
                  <Table2 className="h-4 w-4" />
                  Available Seats
                </Label>
                <Input
                  id="seats"
                  type="number"
                  value={courseForm.availableSeats}
                  onChange={e => setCourseForm({ ...courseForm, availableSeats: +e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog({ type: '', action: '' })}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit('course')}>
              {openDialog.action === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}