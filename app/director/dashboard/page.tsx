'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DirectorHeader from '@/components/layout/DirectorHeader';
import {
  Building,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import Link from 'next/link';

export default function DirectorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    pendingTasks: 0,
    completedProjects: 0,
    departmentPerformance: 'Excellent'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchStats();
    fetchRecentActivities();
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/director/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/director/activities');
      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DirectorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 🏢
          </h1>
          <p className="text-gray-600">
            Manage your departments and track your team's progress.
          </p>
          <div className="mt-4">
            <Badge className="bg-blue-100 text-blue-700">
              Managing {user.managingDepartments?.length || 0} Departments
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
              <p className="text-xs text-gray-600">
                Under your management
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeDepartments}</div>
              <p className="text-xs text-gray-600">
                Operational departments
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
              <p className="text-xs text-gray-600">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.departmentPerformance}</div>
              <p className="text-xs text-gray-600">
                Overall rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/director/employees/create">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Employee
                </Button>
              </Link>
              <Link href="/director/departments">
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Manage Departments
                </Button>
              </Link>
              <Link href="/director/reports">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Department Overview</span>
              </CardTitle>
              <CardDescription>
                Your managed departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.managingDepartments?.length ? (
                user.managingDepartments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">{dept}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">No departments assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Employees</span>
              </CardTitle>
              <CardDescription>
                Manage your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</div>
                <div className="flex space-x-2">
                  <Link href="/director/employees">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/director/employees/create">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-600" />
                <span>Departments</span>
              </CardTitle>
              <CardDescription>
                Department management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600">{stats.activeDepartments}</div>
                <div className="flex space-x-2">
                  <Link href="/director/departments">
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
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>Analytics</span>
              </CardTitle>
              <CardDescription>
                Performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-purple-600">95.2%</div>
                <div className="flex space-x-2">
                  <Link href="/director/analytics">
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
      </main>
    </div>
  );
}