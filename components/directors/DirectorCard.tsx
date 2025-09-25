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

  // Safe function to get initials
  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== 'string') return 'U'; // Default to 'U' for Unknown
    return name.split(' ')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters
  };

  // Safe function to check if director has valid ID
  const hasValidId = (id: string | undefined | null): boolean => {
    return Boolean(id && typeof id === 'string' && id.trim().length > 0);
  };

  const handleDelete = async () => {
    if (!hasValidId(director._id)) {
      toast.error('Invalid director ID');
      return;
    }

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

  const handleView = () => {
    if (!director) {
      toast.error('Director data not available');
      return;
    }
    onView(director);
  };

  // Safe values with fallbacks
  const directorName = director.name || 'Unknown Director';
  const directorEmail = director.email || 'No email provided';
  const directorMobile = director.mobile || 'No phone provided';
  const isActive = Boolean(director.isActive);
  const profilePicture = director.profilePicture || '';
  const directorId = director._id || '';

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 bg-white shadow-xs shadow-yellow-400">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={profilePicture} 
                  alt={directorName}
                />
                <AvatarFallback className="bg-red-900 text-white text-md">
                  {getInitials(director.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-md text-gray-900 truncate">
                  {directorName}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {hasValidId(directorId) ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/directors/${directorId}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Director
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Director
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={!hasValidId(directorId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Director
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-3 h-3 mr-2 text-red-900" />
              <span className="truncate" title={directorEmail}>
                {directorEmail}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-3 h-3 mr-2 text-green-500" />
              <span title={directorMobile}>
                {directorMobile}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-md bg-yellow-100 border-red-900 hover:bg-yellow-200 text-red-900"
              onClick={handleView}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {hasValidId(directorId) ? (
              <Link href={`/admin/directors/${directorId}/edit`} className="flex-1">
                <Button size="sm" className="w-full bg-yellow-400 hover:bg-yellow-600 text-black text-md">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </Link>
            ) : (
              <Button 
                size="sm" 
                className="flex-1 text-xs" 
                disabled
                variant="outline"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Director</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{directorName}"? This action cannot be undone 
              and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting || !hasValidId(directorId)}
            >
              {isDeleting ? 'Deleting...' : 'Delete Director'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}