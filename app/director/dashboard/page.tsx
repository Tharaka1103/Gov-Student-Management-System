'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DirectorHeader from '@/components/layout/DirectorHeader';
import DirectorFooter from '@/components/layout/DirectorFooter';
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
import LoadingIndicator from '@/components/LoadingIndicator ';

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
    return <div><LoadingIndicator
        isVisible={isLoading}
        variant="minimal"
        showBackdrop={false}
      /></div>;
  }

  return (
    <div className="min-h-screen bg-white">
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
          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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
                  <Link href="/director/employees">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
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
      <DirectorFooter/>
    </div>
  );
}