'use client';

import { useState, useEffect } from 'react';
import DirectorHeader from '@/components/layout/DirectorHeader';
import DivisionCard from '@/components/divisions/DivisionCard';
import CreateDivisionDialog from '@/components/divisions/CreateDivisionDialog';
import { User, Division } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function DivisionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchDivisions();
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
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/director/divisions');
      if (response.ok) {
        const data = await response.json();
        setDivisions(data.divisions);
      } else {
        toast.error('Failed to fetch divisions');
      }
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
      toast.error('Failed to fetch divisions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDivisionCreated = (newDivision: Division) => {
    setDivisions(prev => [newDivision, ...prev]);
    setIsCreateDialogOpen(false);
    toast.success('Division created successfully! 🎉');
  };

  const handleDivisionUpdated = (updatedDivision: Division) => {
    setDivisions(prev =>
      prev.map(division =>
        division._id === updatedDivision._id ? updatedDivision : division
      )
    );
  };

  const handleDivisionDeleted = (divisionId: string) => {
    setDivisions(prev => prev.filter(division => division._id !== divisionId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectorHeader user={user} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              Division Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage divisions within your organization
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-red-900 text-white font-medium transition-colors flex items-center space-x-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Division</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{divisions.length}</div>
                <p className="text-xs text-gray-600">Total Divisions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">
                  {divisions.reduce((sum, div) => sum + (Array.isArray(div.employees) ? div.employees.length : 0), 0)}
                </div>
                <p className="text-xs text-gray-600">Total Employees</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">
                  {divisions.filter(div => div.headProgramOfficer).length}
                </div>
                <p className="text-xs text-gray-600">Head Officers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">
                  {divisions.filter(div => div.subProgramOfficer).length}
                </div>
                <p className="text-xs text-gray-600">Sub Officers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divisions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-16 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : divisions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No divisions yet</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Get started by creating your first division to organize your team.
            </p>
            < Button
              onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-red-900 text-white font-medium transition-colors flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Your First Division</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {divisions.map((division) => (
              <DivisionCard
                key={division._id}
                division={division}
                onUpdate={handleDivisionUpdated}
                onDelete={handleDivisionDeleted}
              />
            ))}
          </div>
        )}

        {/* Create Division Dialog */}
        <CreateDivisionDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleDivisionCreated}
        />
      </main>
    </div>
  );
}