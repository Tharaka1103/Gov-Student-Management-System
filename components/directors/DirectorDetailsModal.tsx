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
                    <AvatarImage src={director.profilePicture || ''} alt={director.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {director.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{director.name}</h2>
                    <p className="text-gray-600">Director</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={director.isActive ? "default" : "secondary"}>
                        {director.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {director.managingDepartments?.length || 0} Departments
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
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{director.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{director.mobile}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IdCard className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{director.nic}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm">{director.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Managing Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Managing Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {director.managingDepartments?.map((dept, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Created: {new Date(director.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    Last Updated: {new Date(director.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link href={`/admin/directors/${director._id}/edit`} className="flex-1">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
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
              Are you sure you want to delete "{director.name}"? This action cannot be undone 
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