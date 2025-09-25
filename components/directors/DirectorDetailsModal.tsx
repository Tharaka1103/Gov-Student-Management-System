'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Edit,
  Trash2,
  Building,
  Users,
  Calendar,
  IdCard,
  X
} from 'lucide-react';
import { Director } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface DirectorDetailsModalProps {
  director: Director | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (director: Director) => void;
  onDelete: (directorId: string) => void;
}

export default function DirectorDetailsModal({
  director,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: DirectorDetailsModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!director) return null;

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

  // Safe function to get unique departments with proper keys
  const getDepartmentsWithKeys = (departments: string[] | undefined | null) => {
    if (!departments || !Array.isArray(departments)) return [];
    
    return departments
      .filter(dept => dept && typeof dept === 'string' && dept.trim().length > 0)
      .map((dept, index) => ({
        id: `dept-${director._id}-${index}-${dept.replace(/\s+/g, '-').toLowerCase()}`,
        name: dept.trim()
      }));
  };

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
      onClose();
    } catch (error) {
      console.error('Delete director error:', error);
      toast.error('Failed to delete director');
    } finally {
      setIsDeleting(false);
    }
  };


  // Contact information items with unique keys
  const contactItems = [
    {
      id: `contact-email-${director._id}`,
      icon: Mail,
      iconColor: 'text-red-900',
      value: director.email || 'Not provided'
    },
    {
      id: `contact-mobile-${director._id}`,
      icon: Phone,
      iconColor: 'text-green-500',
      value: director.mobile || 'Not provided'
    },
    {
      id: `contact-nic-${director._id}`,
      icon: IdCard,
      iconColor: 'text-purple-500',
      value: director.nic || 'Not provided'
    },
    {
      id: `contact-address-${director._id}`,
      icon: MapPin,
      iconColor: 'text-red-500',
      value: director.address || 'Not provided',
      isAddress: true
    }
  ];

  // Account information items with unique keys
  const accountItems = [
    {
      id: `account-created-${director._id}`,
      icon: Calendar,
      iconColor: 'text-red-900',
      label: 'Created',
      value: director.createdAt ? new Date(director.createdAt).toLocaleDateString() : 'Unknown'
    },
    {
      id: `account-updated-${director._id}`,
      icon: Calendar,
      iconColor: 'text-green-500',
      label: 'Last Updated',
      value: director.updatedAt ? new Date(director.updatedAt).toLocaleDateString() : 'Unknown'
    }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Director Details</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={director.profilePicture || ''} alt={director.name || 'Director'} />
                    <AvatarFallback className="bg-red-900 text-white text-lg">
                      {getInitials(director.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{director.name || 'Unknown Director'}</h2>
                    <p className="text-gray-600">Director</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        key={`status-badge-${director._id}`}
                        variant={director.isActive ? "default" : "secondary"}
                      >
                        {director.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contactItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="flex items-start space-x-3">
                      <IconComponent className={`w-4 h-4 ${item.iconColor} ${item.isAddress ? 'mt-0.5' : ''}`} />
                      <span className="text-sm">{item.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {accountItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                      <span className="text-sm">
                        {item.label}: {item.value}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link href={`/admin/directors/${director._id}/edit`} className="flex-1">
                <Button className="w-full bg-yellow-400 text-black hover:bg-blue-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Director
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Director
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Director</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{director.name || 'this director'}"? This action cannot be undone 
              and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Director'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}