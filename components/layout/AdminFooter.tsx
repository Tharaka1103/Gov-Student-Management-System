'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  Database,
  Users,
  Clock,
  Activity,
  Shield
} from 'lucide-react';

interface SystemHealth {
  serverStatus: 'online' | 'offline' | 'maintenance';
  databaseStatus: 'connected' | 'disconnected' | 'slow';
  activeUsers: number;
  uptime: string;
  responseTime: number;
  lastUpdated: string;
}

export default function AdminFooter() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    serverStatus: 'online',
    databaseStatus: 'connected',
    activeUsers: 24,
    uptime: '99.9%',
    responseTime: 120,
    lastUpdated: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Update system health every 30 seconds
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        responseTime: Math.floor(Math.random() * 200) + 80,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'bg-green-500';
      case 'slow':
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-900 text-white border-t">
      <div className="container mx-auto px-4 py-6">
        {/* System Health Stats */}
        <Card className="bg-red-800/50 border-red-700 mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                System Health Dashboard
              </h3>
              <Badge variant="outline" className="text-white border-white">
                Administrator Panel
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Server className="w-5 h-5 mr-2" />
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.serverStatus)}`}></div>
                </div>
                <p className="text-sm font-medium">Server</p>
                <p className="text-xs text-red-200 capitalize">{systemHealth.serverStatus}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Database className="w-5 h-5 mr-2" />
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.databaseStatus)}`}></div>
                </div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-red-200 capitalize">{systemHealth.databaseStatus}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 mr-2" />
                </div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-xs text-red-200">{systemHealth.activeUsers}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                </div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-xs text-red-200">{systemHealth.uptime}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 mr-2" />
                </div>
                <p className="text-sm font-medium">Response</p>
                <p className="text-xs text-red-200">{systemHealth.responseTime}ms</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 mr-2" />
                </div>
                <p className="text-sm font-medium">Last Update</p>
                <p className="text-xs text-red-200">{systemHealth.lastUpdated}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Copyright */}
        <div className="text-center border-t border-red-800 pt-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">System Administrator</span>
          </div>
          <p className="text-red-200 text-sm">
            © {currentYear} Directors Management System. All rights reserved.
          </p>
          <p className="text-red-300 text-xs mt-1">
            Admin Dashboard - Full System Control & Management
          </p>
        </div>
      </div>
    </footer>
  );
}