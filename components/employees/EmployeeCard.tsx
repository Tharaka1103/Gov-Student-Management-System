'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Award,
  Clock
} from 'lucide-react';
import { Employee } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';
import ViewEmployeeDialog from './ViewEmployeeDialog';

interface EmployeeCardProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

export default function EmployeeCard({ employee, onUpdate, onDelete }: EmployeeCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/director/employees/${employee._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      onDelete(employee._id);
      setIsDeleteDialogOpen(false);
      toast.success('Employee removed successfully', {
        description: 'The employee has been removed from your team.',
      });
    } catch (error) {
      console.error('Delete employee error:', error);
      toast.error('Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const serviceYears = employee.servicePeriod;

  return (
    <>
      <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={employee.profilePicture || ''} alt={employee.name} />
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  {employee.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {employee.degree && (
                    <Badge variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Degree
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/director/employees/${employee._id}/edit`} className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Employee
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Employee
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-green-500" />
              <span>{employee.mobile}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-purple-500" />
              <span>Joined {formatDate(employee.dateOfJoiningService)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              <span>{serviceYears} of service</span>
            </div>
            {employee.degree && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="truncate">{employee.degree}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsViewDialogOpen(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Link href={`/director/employees/${employee._id}/edit`} className="flex-1">
              <Button size="sm" className="w-full bg-blue-500">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <ViewEmployeeDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        employeeId={employee._id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{employee.name}" from your team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove Employee'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}