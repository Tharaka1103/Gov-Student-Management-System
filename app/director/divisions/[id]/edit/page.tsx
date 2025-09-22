'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DirectorHeader from '@/components/layout/DirectorHeader';
import EditDivisionForm from '@/components/divisions/EditDivisionForm';
import { User } from '@/types';

interface EditDivisionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDivisionPage({ params }: EditDivisionPageProps) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData();
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DirectorHeader user={user} />
      <main className="py-8">
        <EditDivisionForm divisionId={id} />
      </main>
    </div>
  );
}