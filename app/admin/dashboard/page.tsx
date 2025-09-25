'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminHeader from '@/components/layout/AdminHeader';
import {
  Shield,
  Users,
  UserCheck,
  TrendingUp,
  Activity,
  Crown,
  Building,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalDirectors: 0,
    totalAdmins: 0,
    totalEmployees: 0,
    totalWorkshops: 0,
    activeUsers: 0,
    systemHealth: 'Excellent'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👑
          </h1>
          <p className="text-gray-600">
            Manage your system with complete administrative control.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Directors</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalDirectors}</div>
              <p className="text-xs text-gray-600">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Admins</CardTitle>
              <Crown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalAdmins}</div>
              <p className="text-xs text-gray-600">
                Active administrators
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalEmployees}</div>
              <p className="text-xs text-gray-600">
                Across all departments
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-100 border-l-8 border-red-900 hover:bg-yellow-400/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.systemHealth}</div>
              <p className="text-xs text-gray-600">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className=" bg-white/40 border-l-8 border-red-900 hover:bg-white/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Directors</span>
              </CardTitle>
              <CardDescription>
                Manage institutional directors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-blue-600">{stats.totalDirectors}</div>
                <div className="flex space-x-2">
                  <Link href="/admin/directors">
                    <Button size="sm" variant="outline" className='border border-yellow-400 text-yellow-600'>
                      <Eye className="w-4 h-4 mr-1" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/admin/directors/create">
                    <Button size="sm" className='bg-red-900 hover:bg-red-800'>
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" bg-white/40 border-l-8 border-red-900 hover:bg-white/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-red-600" />
                <span>Administrators</span>
              </CardTitle>
              <CardDescription>
                Manage system administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-red-600">{stats.totalAdmins}</div>
                <div className="flex space-x-2">
                  <Link href="/admin/admins">
                    <Button size="sm" variant="outline" className='border border-yellow-400 text-yellow-600'>
                      <Eye className="w-4 h-4 mr-1" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/admin/admins/create">
                    <Button size="sm" className='bg-red-900 hover:bg-red-800'>
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" bg-white/40 border-l-8 border-red-900 hover:bg-white/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>Analytics</span>
              </CardTitle>
              <CardDescription>
                System performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-purple-600">98.5%</div>
                <div className="flex space-x-2">
                  <Link href="/admin/analytics">
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