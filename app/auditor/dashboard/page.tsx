'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuditorHeader from '@/components/layout/AuditorHeader';
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
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import Link from 'next/link';

export default function AuditorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalWorkshops: 0,
    activeWorkshops: 0,
    totalStudents: 0,
    completedWorkshops: 0,
    upcomingWorkshops: 0,
    workshopSuccessRate: '0%'
  });
  const [recentWorkshops, setRecentWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchStats();
    fetchRecentWorkshops();
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
      const response = await fetch('/api/auditor/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentWorkshops = async () => {
    try {
      const response = await fetch('/api/auditor/workshops?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentWorkshops(data.workshops);
      }
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 📋
          </h1>
          <p className="text-gray-600">
            Manage your workshops and track student progress efficiently.
          </p>
          <div className="mt-4">
            <Badge className="bg-green-100 text-green-700">
              Managing {user.managingDepartments?.length || 0} Departments
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalWorkshops}</div>
              <p className="text-xs text-gray-600">
                All time workshops
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workshops</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeWorkshops}</div>
              <p className="text-xs text-gray-600">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
              <p className="text-xs text-gray-600">
                Across all workshops
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.workshopSuccessRate}</div>
              <p className="text-xs text-gray-600">
                Workshop completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common workshop management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/auditor/workshops/create">
                <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Workshop
                </Button>
              </Link>
              <Link href="/auditor/students">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
              </Link>
              <Link href="/auditor/reports">
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
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Workshop Overview</span>
              </CardTitle>
              <CardDescription>
                Your workshop statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <Badge variant="secondary" className="text-xs">{stats.completedWorkshops}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Upcoming</span>
                </div>
                <Badge variant="secondary" className="text-xs">{stats.upcomingWorkshops}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <Badge variant="secondary" className="text-xs">{stats.activeWorkshops}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Grid */}
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
                <div className="text-3xl font-bold text-green-600">{stats.totalWorkshops}</div>
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
                <div className="text-3xl font-bold text-purple-600">{stats.totalStudents}</div>
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
                <div className="text-3xl font-bold text-blue-600">{stats.workshopSuccessRate}</div>
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
      </main>
    </div>
  );
}