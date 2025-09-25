'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DirectorHeader from '@/components/layout/DirectorHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import { Loader2, Building2 } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DirectorFooter from '@/components/layout/DirectorFooter';

export default function DirectorProfilePage() {
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && authUser && authUser.role === 'director') {
      fetchProfile();
    }
  }, [authUser, loading]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        toast.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser || authUser.role !== 'director' || !user) {
    return (
      <div className="min-h-screen">
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DirectorHeader user={authUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-sm">
          <Link href="/director/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Profile</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and department information</p>
          </div>
          
          <Button variant="outline" asChild>
            <Link href="/director/departments">
              <Building2 className="h-4 w-4 mr-2" />
              Manage Departments
            </Link>
          </Button>
        </div>

        <ProfileForm user={user} onUserUpdate={handleUserUpdate} />

        {/* Director-specific information */}
        {user.managingDepartments && user.managingDepartments.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Managing Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.managingDepartments.map((dept, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{dept}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <DirectorFooter/>
    </div>
  );
}