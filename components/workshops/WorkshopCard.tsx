'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Users,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Download
} from 'lucide-react';
import { Workshop } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface WorkshopCardProps {
  workshop: Workshop;
  onUpdate: (workshop: Workshop) => void;
  onDelete: (workshopId: string) => void;
}

export default function WorkshopCard({ workshop, onUpdate, onDelete }: WorkshopCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-700', label: 'Upcoming' },
      ongoing: { color: 'bg-green-100 text-green-700', label: 'Ongoing' },
      completed: { color: 'bg-purple-100 text-purple-700', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/auditor/workshops/${workshop._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workshop');
      }

      onDelete(workshop._id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete workshop error:', error);
      toast.error('Failed to delete workshop');
    } finally {
      setIsDeleting(false);
    }
  };

  const getProgress = () => {
    const now = new Date();
    const start = new Date(workshop.startDate);
    const end = new Date(workshop.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  const progress = getProgress();

  return (
    <>
      <Card className="backdrop-blur-xl bg-yellow-100/40 border border-red-900 hover:bg-yellow-200/50 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold mb-2 group-hover:text-green-600 transition-colors">
                {workshop.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusBadge(workshop.status)}
                <Badge variant="outline" className="text-xs">
                  {workshop.students.length}/{workshop.maxParticipants} Students
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/auditor/workshops/${workshop._id}`} className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/auditor/workshops/${workshop._id}/edit`} className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Workshop
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/auditor/workshops/${workshop._id}/students`} className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Students
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Workshop
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="mb-4 line-clamp-2">
            {workshop.description}
          </CardDescription>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>{formatDate(workshop.startDate)} - {formatDate(workshop.endDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span>{workshop.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              <span>{workshop.students.length} of {workshop.maxParticipants} participants</span>
            </div>
          </div>

          {/* Progress Bar */}
          {workshop.status === 'ongoing' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Link href={`/auditor/workshops/${workshop._id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/auditor/workshops/${workshop._id}/students`} className="flex-1">
              <Button size="sm" className="w-full bg-red-900 hover:bg-red-700">
                <Users className="w-4 h-4 mr-1" />
                Students
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{workshop.title}"? This action cannot be undone.
              All associated student data will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Workshop'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}