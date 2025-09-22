'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/layout/AdminHeader';
import {
  ArrowLeft,
  Clock,
  Wrench,
  Calendar,
  Bell,
  Mail,
  Star,
  Rocket
} from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

export default function ComingSoonPage() {
  const [user, setUser] = useState<User | null>(null);
  const featureName = 'This feature';
  const backUrl = '/admin/dashboard';

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {featureName} Will Be Implemented in Future
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                We're working hard to bring you this amazing feature. 
                Stay tuned for updates on our development progress.
              </p>

              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Rocket className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">In Development</h3>
                    <p className="text-sm text-gray-600">
                      Our team is actively working on this feature
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-sm text-gray-600">
                      Expected release in the next few months
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Enhanced Experience</h3>
                    <p className="text-sm text-gray-600">
                      Will improve your workflow significantly
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Want to be notified when this feature is ready?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Get Notified
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Updates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-8">
            <Link href={backUrl}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Thank you for your patience while we build amazing features for you! 🚀
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}