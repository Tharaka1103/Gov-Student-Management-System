'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Loader2, UserPlus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface CreateEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (employee: Employee) => void;
  directorId: string;
}

interface EmployeeFormData {
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  servicePeriod: string;
  dateOfJoiningService: Date | null;
  degree: string;
  profilePicture?: File;
}

export default function CreateEmployeeDialog({
  isOpen,
  onClose,
  onSuccess,
  directorId
}: CreateEmployeeDialogProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    servicePeriod: '',
    dateOfJoiningService: null,
    degree: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error('Invalid file', { description: validation.error });
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Profile picture selected');
    }
  };

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP files are allowed.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB.' };
    }
    
    return { valid: true };
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: undefined }));
    setPreviewImage(null);
    toast.info('Profile picture removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.dateOfJoiningService) {
      setError('Please select the date of joining service');
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dateOfJoiningService' && value) {
          submitData.append(key, (value as Date).toISOString());
        } else if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key !== 'profilePicture') {
          submitData.append(key, value as string);
        }
      });
      submitData.append('director', directorId);

      const response = await fetch('/api/director/employees', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create employee');
      }

      onSuccess(data.employee);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        nic: '',
        mobile: '',
        address: '',
        servicePeriod: '',
        dateOfJoiningService: null,
        degree: ''
      });
      setPreviewImage(null);

    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to create employee', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setError('');
      setFormData({
        name: '',
        email: '',
        nic: '',
        mobile: '',
        address: '',
        servicePeriod: '',
        dateOfJoiningService: null,
        degree: ''
      });
      setPreviewImage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl backdrop-blur-xl bg-white/95 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Add New Employee</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the employee details to add them to your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Picture Upload */}
          <div className="space-y-4">
            <Label>Profile Picture (Optional)</Label>
            <div className="flex items-center space-x-4">
              {previewImage ? (
                <div className="relative">
                  <Image
                    src={previewImage}
                    alt="Profile preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-white/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 5MB. JPEG, PNG, WebP only.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter employee's full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nic">NIC Number *</Label>
              <Input
                id="nic"
                placeholder="Enter NIC number"
                value={formData.nic}
                onChange={(e) => handleInputChange('nic', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              className="bg-white/50"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servicePeriod">Service Period *</Label>
              <Input
                id="servicePeriod"
                placeholder="e.g., Permanent, Contract, Temporary"
                value={formData.servicePeriod}
                onChange={(e) => handleInputChange('servicePeriod', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Date of Joining Service *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfJoiningService ? format(formData.dateOfJoiningService, 'PPP') : 'Select joining date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfJoiningService || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dateOfJoiningService: date || null }))}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree (Optional)</Label>
            <Input
              id="degree"
              placeholder="Enter degree if applicable"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              className="bg-white/50"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}