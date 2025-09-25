'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Calendar,
  BookOpen,
  Award,
  Activity,
  CheckCircle
} from 'lucide-react';

interface EmployeeStats {
  workshopsAttended: number;
  certificationsEarned: number;
  activeTasks: number;
  completedTasks: number;
  lastLogin: string;
  profileStatus: 'complete' | 'incomplete';
}

export default function EmployeeFooter() {
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats>({
    workshopsAttended: 8,
    certificationsEarned: 3,
    activeTasks: 2,
    completedTasks: 15,
    lastLogin: new Date().toLocaleTimeString(),
    profileStatus: 'complete'
  });

  useEffect(() => {
    // Update stats every 60 seconds
    const interval = setInterval(() => {
      setEmployeeStats(prev => ({
        ...prev,
        activeTasks: Math.floor(Math.random() * 5),
        lastLogin: new Date().toLocaleTimeString(),
        profileStatus: Math.random() > 0.8 ? 'incomplete' : 'complete'
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'complete' ? 'text-green-600' : 'text-orange-600';
  };

  const getStatusIcon = (status: string) => {
    return status === 'complete' ? 'bg-green-500' : 'bg-orange-500';
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yellow-50 text-gray-800 border-t border-red-900">
      <div className="container mx-auto px-4 py-6">
        {/* Copyright */}
        <div className="text-center pt-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <User className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">Employee Portal</span>
          </div>
          <p className="text-gray-600 text-sm">
            © {currentYear} SLILG. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Employee Dashboard - Personal Workspace & Development
          </p>
        </div>
      </div>
    </footer>
  );
}