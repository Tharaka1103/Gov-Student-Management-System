'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuditorHeader from '@/components/layout/AuditorHeader';
import EmployeeFooter from '@/components/layout/EmployeeFooter';
import {
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Edit,
  UserPlus,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, Workshop, Student } from '@/types';
import Link from 'next/link';
import LoadingIndicator from '@/components/LoadingIndicator ';

export default function WorkshopDetailPage() {
  const params = useParams();
  const workshopId = params.id as string;
  
  const [user, setUser] = useState<UserType | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchWorkshopDetails();
  }, [workshopId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchWorkshopDetails = async () => {
    try {
      const response = await fetch(`/api/auditor/workshops/${workshopId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkshop(data.workshop);
      } else {
        toast.error('Failed to fetch workshop details');
      }
    } catch (error) {
      console.error('Failed to fetch workshop details:', error);
      toast.error('Failed to fetch workshop details');
    } finally {
      setIsLoading(false);
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

  const getProgress = () => {
    if (!workshop) return 0;
    const now = new Date();
    const start = new Date(workshop.startDate);
    const end = new Date(workshop.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  if (!user) {
    return <div><LoadingIndicator
        isVisible={isLoading}
        variant="minimal"
        showBackdrop={false}
      /></div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AuditorHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </main>
        <EmployeeFooter/>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-white">
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
        <EmployeeFooter/>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-white">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/auditor/workshops" className="text-gray-500 hover:text-gray-700">
            Workshops
          </Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium text-gray-900">{workshop.title}</span>
        </div>

        {/* Workshop Header */}
        <Card className="backdrop-blur-xl bg-white/40 border border-white/30 mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-gray-900">{workshop.title}</h1>
                  {getStatusBadge(workshop.status)}
                </div>
                <p className="text-gray-600 max-w-3xl">{workshop.description}</p>
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
                <Link href={`/auditor/workshops/${workshop._id}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/auditor/workshops/${workshop._id}/students`}>
                  <Button className="bg-red-900">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          
          {/* Progress Bar for Ongoing Workshops */}
          {workshop.status === 'ongoing' && (
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Workshop Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-900 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workshop Details */}
          <Card className="lg:col-span-2 backdrop-blur-xl bg-white/40 border border-red-900">
            <CardHeader>
              <CardTitle>Workshop Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(workshop.startDate)} to {formatDate(workshop.endDate)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{workshop.location}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capacity</h4>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{workshop.maxParticipants} participants maximum</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  {getStatusBadge(workshop.status)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-white/40 border border-red-900">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{workshop.students.length}</div>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                </div>
                <div className="text-center p-4 bg-white/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{workshop.maxParticipants - workshop.students.length}</div>
                  <p className="text-sm text-gray-600">Available Spots</p>
                </div>
                <div className="text-center p-4 bg-white/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((workshop.students.length / workshop.maxParticipants) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Capacity Filled</p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/40 border border-red-900">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/auditor/workshops/${workshop._id}/students`}>
                  <Button className="w-full bg-red-900 mb-2 hover:bg-red-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                </Link>
                <Link href={`/auditor/workshops/${workshop._id}/edit`}>
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Workshop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enrolled Students */}
        <Card className="mt-8 backdrop-blur-xl bg-white/40 border border-white/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>
                  {workshop.students.length} students enrolled in this workshop
                </CardDescription>
              </div>
              <Link href={`/auditor/workshops/${workshop._id}/students`}>
                <Button className='bg-red-900'>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {workshop.students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students enrolled</h3>
                <p className="text-gray-600 mb-6">
                  Start building your workshop by adding students.
                </p>
                <Link href={`/auditor/workshops/${workshop._id}/students`}>
                  <Button className='bg-red-900'>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First Student
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {workshop.students.map((student, index) => (
                  <Card key={index} className="bg-white/30 border border-red-900">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.profilePicture || ''} alt={student.name} />
                          <AvatarFallback className="bg-red-900 text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.enrollmentNumber}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Badge 
                              variant={student.status === 'enrolled' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {student.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{student.mobile}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <EmployeeFooter/>
    </div>
  );
}