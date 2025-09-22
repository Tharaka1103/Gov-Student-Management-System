'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminHeader from '@/components/layout/AdminHeader';
import DirectorCard from '@/components/directors/DirectorCard';
import CreateDirectorDialog from '@/components/directors/CreateDirectorDialog';
import DirectorDetailsModal from '@/components/directors/DirectorDetailsModal';
import {
  Building,
  Plus,
  Search,
  Download,
  UserPlus,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { User, Director } from '@/types';

export default function DirectorsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchDirectors();
  }, []);

  useEffect(() => {
    filterDirectors();
  }, [directors, searchTerm]);

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

  const fetchDirectors = async () => {
    try {
      const response = await fetch('/api/admin/directors');
      if (response.ok) {
        const data = await response.json();
        setDirectors(data.directors);
      } else {
        toast.error('Failed to fetch directors');
      }
    } catch (error) {
      console.error('Failed to fetch directors:', error);
      toast.error('Failed to fetch directors');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDirectors = () => {
    let filtered = [...directors];

    if (searchTerm) {
      filtered = filtered.filter(director =>
        director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.nic.includes(searchTerm) ||
        director.managingDepartments.some(dept => 
          dept.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredDirectors(filtered);
  };

  const handleDirectorCreated = (newDirector: Director) => {
    setDirectors(prev => [newDirector, ...prev]);
    setIsCreateDialogOpen(false);
    toast.success('Director created successfully!');
  };

  const handleDirectorUpdated = (updatedDirector: Director) => {
    setDirectors(prev =>
      prev.map(director =>
        director._id === updatedDirector._id ? updatedDirector : director
      )
    );
    toast.success('Director updated successfully!');
  };

  const handleDirectorDeleted = (directorId: string) => {
    setDirectors(prev => prev.filter(director => director._id !== directorId));
    toast.success('Director deleted successfully!');
  };

  const handleViewDirector = (director: Director) => {
    setSelectedDirector(director);
    setIsDetailsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getDirectorStats = () => {
    const totalDirectors = directors.length;
    const activeDirectors = directors.filter(d => d.isActive).length;
    const totalDepartments = directors.reduce((sum, d) => sum + (d.managingDepartments?.length || 0), 0);
    
    return {
      total: totalDirectors,
      active: activeDirectors,
      inactive: totalDirectors - activeDirectors,
      totalDepartments
    };
  };

  const stats = getDirectorStats();

  // Define stats array with unique keys
  const statsData = [
    {
      key: 'total-directors',
      value: stats.total,
      label: 'Total Directors',
      color: 'bg-blue-200',
      textColor: 'text-blue-600'
    },
    {
      key: 'active-directors',
      value: stats.active,
      label: 'Active',
      color: 'bg-green-200',
      textColor: 'text-green-600'
    },
    {
      key: 'inactive-directors',
      value: stats.inactive,
      label: 'Inactive',
      color: 'bg-red-200',
      textColor: 'text-red-600'
    },
    {
      key: 'total-departments',
      value: stats.totalDepartments,
      label: 'Departments',
      color: 'bg-purple-200',
      textColor: 'text-purple-600'
    }
  ];

  // Loading skeleton data with unique keys
  const loadingSkeletonItems = Array.from({ length: 8 }, (_, index) => ({
    key: `skeleton-${index}`,
    id: index
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Directors Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage institutional directors and their departments
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Director
            </Button>
          </div>
        </div>

        {/* Stats Cards - Fixed with proper keys */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat) => (
            <Card key={stat.key} className={stat.color}>
              <CardContent className="p-4">
                <div className={`text-xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search directors by name, email, NIC, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Directors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loadingSkeletonItems.map((item) => (
              <Card key={item.key}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-300 rounded-full mb-3 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 mx-auto"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3 mx-auto"></div>
                    <div className="h-8 bg-gray-300 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDirectors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No directors found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first director.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First Director
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDirectors.map((director) => (
              <DirectorCard
                key={director._id}
                director={director}
                onUpdate={handleDirectorUpdated}
                onDelete={handleDirectorDeleted}
                onView={handleViewDirector}
              />
            ))}
          </div>
        )}

        <CreateDirectorDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleDirectorCreated}
        />

        <DirectorDetailsModal
          director={selectedDirector}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedDirector(null);
          }}
          onUpdate={handleDirectorUpdated}
          onDelete={handleDirectorDeleted}
        />
      </main>
    </div>
  );
}