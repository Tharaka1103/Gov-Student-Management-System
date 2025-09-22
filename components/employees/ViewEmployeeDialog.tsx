'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  User,
  CreditCard,
  Edit,
  X,
  Eye
} from 'lucide-react';
import { Employee } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface ViewEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
}

export default function ViewEmployeeDialog({
  isOpen,
  onClose,
  employeeId
}: ViewEmployeeDialogProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployee();
    }
  }, [isOpen, employeeId]);

  const fetchEmployee = async () => {
    if (!employeeId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/director/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      const data = await response.json();
      setEmployee(data.employee);
    } catch (error) {
      console.error('Fetch employee error:', error);
      toast.error('Failed to fetch employee details');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateServicePeriod = () => {
    if (!employee) return '0 years';
    return employee.servicePeriod;
  };

  if (isLoading) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Loading Employee Details
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading employee information...</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className=" p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              Employee Details
            </AlertDialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogDescription className="text-base">
            Complete information about <span className="font-semibold text-gray-900">{employee.name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[50vh] px-6">
          <div className="space-y-6 py-4">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={employee.profilePicture || ''} alt={employee.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-3xl">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge 
                      variant={employee.isActive ? "default" : "secondary"} 
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {employee.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </Badge>
                    {employee.degree && (
                      <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-yellow-300 text-yellow-700">
                        <Award className="w-4 h-4 mr-1" />
                        Has Degree
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-center lg:text-left flex-1 space-y-3">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                    <p className="text-gray-600 font-mono text-sm bg-white px-3 py-1 rounded-md inline-block">
                      ID: {employee._id}
                    </p>
                  </div>
                  
                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">Joined</span>
                      </div>
                      <p className="text-gray-900 text-xs font-semibold">{formatDate(employee.dateOfJoiningService)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-600">Service</span>
                      </div>
                      <p className="text-gray-900 text-xs font-semibold">{calculateServicePeriod()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Information
                </h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">Email Address:</span>
                    </div>
                    <p className="text-gray-900 font-medium break-all">{employee.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm font-medium">Mobile Number:</span>
                    </div>
                    <p className="text-gray-900 font-medium">{employee.mobile}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm font-medium">Address:</span>
                    </div>
                    <p className="text-gray-900 font-medium leading-relaxed">{employee.address}</p>
                  </div>
                </div>
              </div>

              {/* Personal & Service Information */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-600 mb-2">
                        <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">NIC Number:</span>
                      </div>
                      <p className="text-gray-900 font-mono font-bold text-lg">{employee.nic}</p>
                    </div>
                    {employee.degree && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center text-gray-600 mb-2">
                          <Award className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="text-sm font-medium">Educational Qualification:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.degree}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Service Information
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Date of Joining Service:</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">{formatDate(employee.dateOfJoiningService)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">Total Service Period:</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">{calculateServicePeriod()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-600" />
                Employment Status & Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {employee.isActive ? '✅' : '❌'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Status</p>
                  <p className="font-semibold">{employee.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {employee.degree ? '🎓' : '📚'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Education</p>
                  <p className="font-semibold">{employee.degree ? 'Degree Holder' : 'No Degree'}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">⏱️</div>
                  <p className="text-sm text-gray-600 mt-1">Experience</p>
                  <p className="font-semibold">{calculateServicePeriod()}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <AlertDialogFooter className="p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/director/employees/${employee._id}/edit`} className="flex-1">
                <Button className="w-full bg-blue-500">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Employee
                </Button>
              </Link>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}