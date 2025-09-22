'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuditorHeader from '@/components/layout/AuditorHeader';
import StudentManagement from '@/components/workshops/StudentManagement';
import {
  BookOpen,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Edit,
  Download,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, Workshop, Student } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function WorkshopStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const workshopId = params.id as string;
  
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user && user.role === 'internal_auditor') {
      fetchWorkshopDetails();
    }
  }, [user, loading, workshopId]);

  const fetchWorkshopDetails = async () => {
    try {
      const response = await fetch(`/api/auditor/workshops/${workshopId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkshop(data.workshop);
      } else {
        toast.error('Failed to fetch workshop details');
        router.push('/auditor/workshops');
      }
    } catch (error) {
      console.error('Failed to fetch workshop details:', error);
      toast.error('Failed to fetch workshop details');
      router.push('/auditor/workshops');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentAdded = (newStudent: Student) => {
    if (workshop) {
      setWorkshop(prev => ({
        ...prev!,
        students: [...prev!.students, newStudent]
      }));
    }
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    if (workshop) {
      setWorkshop(prev => ({
        ...prev!,
        students: prev!.students.map(student =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      }));
    }
  };

  const handleStudentRemoved = (studentId: string) => {
    if (workshop) {
      setWorkshop(prev => ({
        ...prev!,
        students: prev!.students.filter(student => student._id !== studentId)
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-700', label: 'Upcoming' },
      ongoing: { color: 'bg-green-100 text-green-700', label: 'Ongoing' },
      completed: { color: 'bg-purple-100 text-purple-700', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if user is not internal auditor or not logged in
  if (!user || user.role !== 'internal_auditor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Link href="/login">
            <Button className="bg-red-600 hover:bg-red-700">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <AuditorHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <AuditorHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workshop not found</h3>
              <p className="text-gray-600 mb-6">
                The workshop you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/auditor/workshops">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Workshops
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/auditor/workshops" className="text-gray-500 hover:text-gray-700 transition-colors">
            Workshops
          </Link>
          <span className="text-gray-500">/</span>
          <Link href={`/auditor/workshops/${workshop._id}`} className="text-gray-500 hover:text-gray-700 transition-colors">
            {workshop.title}
          </Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium text-gray-900">Students</span>
        </div>

        {/* Workshop Header */}
        <Card className="backdrop-blur-xl bg-white/40 border border-white/30 mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Link href={`/auditor/workshops/${workshop._id}`}>
                    <Button variant="ghost" size="sm" className="p-2">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{workshop.title}</h1>
                    <p className="text-gray-600">Student Management</p>
                  </div>
                  {getStatusBadge(workshop.status)}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{formatDate(workshop.startDate)} - {formatDate(workshop.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{workshop.students.length} of {workshop.maxParticipants} participants</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <Button variant="outline" onClick={() => toast.info('Export feature coming soon')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
                <Link href={`/auditor/workshops/${workshop._id}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Workshop
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Workshop Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{workshop.students.length}</div>
              <p className="text-sm text-gray-600">Enrolled Students</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{workshop.maxParticipants - workshop.students.length}</div>
              <p className="text-sm text-gray-600">Available Spots</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((workshop.students.length / workshop.maxParticipants) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Capacity</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {workshop.students.filter(s => s.status === 'enrolled').length}
              </div>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Management Component */}
        <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
          <CardContent className="p-8">
            <StudentManagement
              workshopId={workshop._id}
              students={workshop.students}
              maxParticipants={workshop.maxParticipants}
              onStudentAdded={handleStudentAdded}
              onStudentUpdated={handleStudentUpdated}
              onStudentRemoved={handleStudentRemoved}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}