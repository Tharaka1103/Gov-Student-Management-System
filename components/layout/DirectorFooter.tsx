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
    <footer className="bg-yellow-100 text-gray-800 border-t border-yellow-200">
      <div className="container mx-auto px-4 py-6">
        {/* Director Stats */}
        <Card className="bg-yellow-50 border-yellow-300 mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Building className="w-5 h-5 mr-2 text-yellow-600" />
                Director Dashboard Overview
              </h3>
              <Badge className="bg-yellow-400 text-gray-800 hover:bg-yellow-500">
                Department Director
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Total Staff</p>
                <p className="text-lg font-bold text-blue-600">{directorStats.totalEmployees}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Active</p>
                <p className="text-lg font-bold text-green-600">{directorStats.activeEmployees}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Departments</p>
                <p className="text-lg font-bold text-purple-600">{directorStats.departmentCount}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Pending</p>
                <p className="text-lg font-bold text-orange-600">{directorStats.pendingReports}</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className={`w-5 h-5 ${getLoadColor(directorStats.systemLoad)}`} />
                </div>
                <p className="text-sm font-medium text-gray-700">Load</p>
                <p className={`text-sm font-bold ${getLoadColor(directorStats.systemLoad)}`}>
                  {directorStats.systemLoad}
                </p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Last Sync</p>
                <p className="text-xs font-medium text-indigo-600">{directorStats.lastActivity}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Copyright */}
        <div className="text-center border-t border-yellow-300 pt-4">
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