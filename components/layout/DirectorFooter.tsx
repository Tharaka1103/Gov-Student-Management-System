'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building,
  FileText,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';

interface DirectorStats {
  totalEmployees: number;
  activeEmployees: number;
  departmentCount: number;
  pendingReports: number;
  lastActivity: string;
  systemLoad: string;
}

export default function DirectorFooter() {
  const [directorStats, setDirectorStats] = useState<DirectorStats>({
    totalEmployees: 15,
    activeEmployees: 14,
    departmentCount: 3,
    pendingReports: 2,
    lastActivity: new Date().toLocaleTimeString(),
    systemLoad: 'Normal'
  });

  useEffect(() => {
    // Update stats every 45 seconds
    const interval = setInterval(() => {
      setDirectorStats(prev => ({
        ...prev,
        activeEmployees: Math.floor(Math.random() * 20) + 10,
        pendingReports: Math.floor(Math.random() * 5),
        lastActivity: new Date().toLocaleTimeString(),
        systemLoad: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Normal' : 'Low'
      }));
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getLoadColor = (load: string) => {
    switch (load) {
      case 'Low':
        return 'text-green-600';
      case 'Normal':
        return 'text-blue-600';
      case 'High':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yellow-50 text-gray-800 border-t border-red-900">
      <div className="container mx-auto px-4 py-6">
        
        {/* Copyright */}
        <div className="text-center ">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Building className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">Department Director</span>
          </div>
          <p className="text-gray-600 text-sm">
            © {currentYear} Directors Management System. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Director Dashboard - Employee & Department Management
          </p>
        </div>
      </div>
    </footer>
  );
}