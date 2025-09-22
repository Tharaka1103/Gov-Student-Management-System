'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Building,
  Users
} from 'lucide-react';
import { Director } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface DirectorCardProps {
  director: Director;
  onUpdate: (director: Director) => void;
  onDelete: (directorId: string) => void;
  onView: (director: Director) => void;
}

export default function DirectorCard({ director, onUpdate, onDelete, onView }: DirectorCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/directors/${director._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete director');
      }

      onDelete(director._id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete director error:', error);
      toast.error('Failed to delete director');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={director.profilePicture || ''} alt={director.name} />
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {director.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {director.name}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  <Badge variant={director.isActive ? "default" : "secondary"} className="text-xs">
                    {director.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(director)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/directors/${director._id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Director
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Director
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-xs text-gray-600">
              <Mail className="w-3 h-3 mr-2 text-blue-500" />
              <span className="truncate">{director.email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-2 text-green-500" />
              <span>{director.mobile}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Building className="w-3 h-3 mr-2 text-purple-500" />
              <span>{director.managingDepartments?.length || 0} Departments</span>
            </div>
          </div>

          {/* Managing Departments - Fixed key prop issue */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {director.managingDepartments?.slice(0, 2).map((dept) => (
                <Badge key={`${director._id}-${dept}`} variant="outline" className="text-xs">
                  {dept}
                </Badge>
              ))}
              {director.managingDepartments && director.managingDepartments.length > 2 && (
                <Badge key={`${director._id}-more`} variant="outline" className="text-xs">
                  +{director.managingDepartments.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onView(director)}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Link href={`/admin/directors/${director._id}/edit`} className="flex-1">
              <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Director</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{director.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}