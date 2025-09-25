'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuditorHeader from '@/components/layout/AuditorHeader';
import DivisionDetailsCard from '@/components/employees/DivisionDetailsCard';
import {
  ClipboardCheck,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  BarChart3,
  Target,
  Award,
  Building,
  User,
  Shield,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType } from '@/types';
import Link from 'next/link';

export default function EmployeeDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [division, setDivision] = useState<any>(null);
  const [stats, setStats] = useState({
    divisionAssigned: false,
    divisionName: null,
    totalDivisionMembers: 0,
    activeDivisionMembers: 0,
    isOfficer: false,
    officerRole: null,
    joiningDate: null,
    servicePeriod: '',
    council: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchDivisionData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const fetchDivisionData = async () => {
    try {
      const response = await fetch('/api/employee/division');
      if (response.ok) {
        const data = await response.json();
        setDivision(data.division);
      }
    } catch (error) {
      console.error('Failed to fetch division data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/employee/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            {user.role === 'employee' ? 'Manage your tasks and view your division information.' : 'Manage your workshops and track student progress efficiently.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-700">
              {user.role === 'employee' ? `Council: ${user.council}` : `Managing ${user.managingDepartments?.length || 0} Departments`}
            </Badge>
            {user.role === 'employee' && stats.isOfficer && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                {stats.officerRole}
              </Badge>
            )}
            {division && (
              <Badge className="bg-green-100 text-green-700">
                <Building className="w-3 h-3 mr-1" />
                {division.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.role === 'employee' ? (
            // Employee Stats
            <>
              <Card className="backdrop-blur-xl bg-yellow-100/40 border-l-8 border-red-900 hover:bg-yellow-200/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Division Status</CardTitle>
                  <Building className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.divisionAssigned ? 'Assigned' : 'Unassigned'}
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.divisionAssigned ? stats.divisionName : 'No division assigned'}
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-yellow-100/40 border-l-8 border-red-900 hover:bg-yellow-200/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalDivisionMembers}</div>
                  <p className="text-xs text-gray-600">
                    {stats.activeDivisionMembers} active members
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-yellow-100/40 border-l-8 border-red-900 hover:bg-yellow-200/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Period</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.servicePeriod}</div>
                  <p className="text-xs text-gray-600">
                    {stats.joiningDate && `Since ${formatDate(stats.joiningDate)}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-yellow-100/40 border-l-8 border-red-900 hover:bg-yellow-200/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Role Status</CardTitle>
                  {stats.isOfficer ? <Crown className="h-4 w-4 text-yellow-600" /> : <User className="h-4 w-4 text-gray-600" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.isOfficer ? 'Officer' : 'Member'}
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.isOfficer ? stats.officerRole : 'Division Member'}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            // Internal Auditor Stats (existing)
            <>
              <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
                  <BookOpen className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <p className="text-xs text-gray-600">All time workshops</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Workshops</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <p className="text-xs text-gray-600">Currently running</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <p className="text-xs text-gray-600">Across all workshops</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Award className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">0%</div>
                  <p className="text-xs text-gray-600">Workshop completion</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Division Details Card (for employees) */}
          {user.role === 'employee' && (
            <DivisionDetailsCard division={division} />
          )}          

          {/* Personal Info Card (for employees) */}
          {user.role === 'employee' && (
            <Card className="backdrop-blur-xl bg-white/40 border border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Your employment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Council</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{user.council}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Service Period</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{user.servicePeriod}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Joining Date</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.dateOfJoiningService && formatDate(user.dateOfJoiningService)}
                  </Badge>
                </div>
                {user.degree && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Degree</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{user.degree}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Management Grid (for internal auditors) */}
        {user.role === 'internal_auditor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span>Workshops</span>
                </CardTitle>
                <CardDescription>
                  Manage your workshops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <div className="flex space-x-2">
                    <Link href="/auditor/workshops">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View All
                      </Button>
                    </Link>
                    <Link href="/auditor/workshops/create">
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Students</span>
                </CardTitle>
                <CardDescription>
                  Student management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="flex space-x-2">
                    <Link href="/auditor/students">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>
                  Performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-blue-600">0%</div>
                  <div className="flex space-x-2">
                    <Link href="/auditor/analytics">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}