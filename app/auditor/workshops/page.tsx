'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AuditorHeader from '@/components/layout/AuditorHeader';
import EmployeeFooter from '@/components/layout/EmployeeFooter';
import WorkshopCard from '@/components/workshops/WorkshopCard';
import CreateWorkshopDialog from '@/components/workshops/CreateWorkshopDialog';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { User, Workshop } from '@/types';
import LoadingIndicator from '@/components/LoadingIndicator ';

export default function WorkshopsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [workshops, searchTerm, statusFilter]);

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

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/auditor/workshops');
      if (response.ok) {
        const data = await response.json();
        setWorkshops(data.workshops);
      } else {
        toast.error('Failed to fetch workshops');
      }
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
      toast.error('Failed to fetch workshops');
    } finally {
      setIsLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = [...workshops];

    if (searchTerm) {
      filtered = filtered.filter(workshop =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(workshop => workshop.status === statusFilter);
    }

    setFilteredWorkshops(filtered);
  };

  const handleWorkshopCreated = (newWorkshop: Workshop) => {
    setWorkshops(prev => [newWorkshop, ...prev]);
    setIsCreateDialogOpen(false);
    toast.success('Workshop created successfully! 🎉', {
      description: 'Your new workshop has been added to the system.',
    });
  };

  const handleWorkshopUpdated = (updatedWorkshop: Workshop) => {
    setWorkshops(prev =>
      prev.map(workshop =>
        workshop._id === updatedWorkshop._id ? updatedWorkshop : workshop
      )
    );
    toast.success('Workshop updated successfully! ✨', {
      description: 'Changes have been saved.',
    });
  };

  const handleWorkshopDeleted = (workshopId: string) => {
    setWorkshops(prev => prev.filter(workshop => workshop._id !== workshopId));
    toast.success('Workshop deleted successfully', {
      description: 'The workshop has been removed from the system.',
    });
  };

  if (!user) {
    return <div><LoadingIndicator
        isVisible={isLoading}
        variant="minimal"
        showBackdrop={false}
      /></div>;
  }

  const statusOptions = [
    { value: 'all', label: 'All Workshops' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusStats = () => {
    return {
      total: workshops.length,
      upcoming: workshops.filter(w => w.status === 'upcoming').length,
      ongoing: workshops.filter(w => w.status === 'ongoing').length,
      completed: workshops.filter(w => w.status === 'completed').length,
      cancelled: workshops.filter(w => w.status === 'cancelled').length
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-white">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Workshop Management 📚
            </h1>
            <p className="text-gray-600">
              Create, manage, and track your educational workshops
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="mt-4 lg:mt-0 bg-red-900 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workshop
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Workshops</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
              <p className="text-sm text-gray-600">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
              <p className="text-sm text-gray-600">Ongoing</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <p className="text-sm text-gray-600">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="backdrop-blur-xl bg-white/40 border border-white/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search workshops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-col md:flex-row">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? "bg-red-900 hover:bg-red-700" : ""}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workshops Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="backdrop-blur-xl bg-white/40 border border-white/30">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first workshop.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-red-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Workshop
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id}
                workshop={workshop}
                onUpdate={handleWorkshopUpdated}
                onDelete={handleWorkshopDeleted}
              />
            ))}
          </div>
        )}

        {/* Create Workshop Dialog */}
        <CreateWorkshopDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleWorkshopCreated}
          auditorId={user._id}
        />
      </main>
      <EmployeeFooter/>
    </div>
  );
}