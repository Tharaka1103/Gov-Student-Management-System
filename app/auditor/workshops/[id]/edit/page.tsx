'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuditorHeader from '@/components/layout/AuditorHeader';
import EmployeeFooter from '@/components/layout/EmployeeFooter';
import EditWorkshopForm from '@/components/workshops/EditWorkshopForm';
import {
  ArrowLeft,
  BookOpen,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Workshop } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '@/components/LoadingIndicator ';

export default function EditWorkshopPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const workshopId = params.id as string;
  
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && user.role === 'employee') {
      fetchWorkshopDetails();
    }
  }, [user, loading, workshopId]);

  const fetchWorkshopDetails = async () => {
    try {
      const response = await fetch(`/api/auditor/workshops/${workshopId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkshop(data.workshop);
      } else if (response.status === 404) {
        setError('Workshop not found');
      } else {
        setError('Failed to fetch workshop details');
      }
    } catch (error) {
      console.error('Failed to fetch workshop details:', error);
      setError('Failed to fetch workshop details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedWorkshop: Workshop) => {
    toast.success('Workshop updated successfully!');
    router.push(`/auditor/workshops/${workshopId}`);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground"><LoadingIndicator
        isVisible={isLoading}
        variant="minimal"
        showBackdrop={false}
      /></p>
        </div>
      </div>
    );
  }

  // Show error if user is not internal auditor or not logged in
  if (!user || user.role !== 'employee') {
    return (
      <div className="min-h-screen">
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AuditorHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          </div>
        </main>
        <EmployeeFooter/>
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-background">
        <AuditorHeader user={user} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {error || 'Workshop not found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                The workshop you're trying to edit doesn't exist or you don't have permission to edit it.
              </p>
              <Link href="/auditor/workshops">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
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

  return (
    <div className="min-h-screen bg-background">
      <AuditorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-sm">
          <Link href="/auditor/workshops" className="text-muted-foreground hover:text-foreground transition-colors">
            Workshops
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/auditor/workshops/${workshop._id}`} className="text-muted-foreground hover:text-foreground transition-colors">
            {workshop.title}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Edit</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/auditor/workshops/${workshop._id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Workshop</h1>
            <p className="text-muted-foreground">Update the workshop information below</p>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Workshop Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditWorkshopForm
              workshop={workshop}
              onSuccess={handleUpdateSuccess}
              onCancel={() => router.push(`/auditor/workshops/${workshopId}`)}
            />
          </CardContent>
        </Card>
      </main>
      <EmployeeFooter/>
    </div>
  );
}