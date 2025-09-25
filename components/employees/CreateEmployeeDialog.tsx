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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, Upload, X, Eye, EyeOff } from 'lucide-react';
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
  council: string;
  password: string;
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
    degree: '',
    council: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const generatePassword = () => {
    const name = formData.name.toLowerCase().replace(/\s+/g, '');
    const generatedPassword = `${name}123`;
    setFormData(prev => ({ ...prev, password: generatedPassword }));
    toast.success('Password generated automatically');
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

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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

      const response = await fetch('/api/director/employees', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create employee');
      }

      onSuccess(data.employee);

      // Show success message with login credentials
      toast.success('Employee created successfully!', {
        description: `Login credentials - NIC: ${formData.nic}, Password: ${formData.password}`,
        duration: 10000,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        nic: '',
        mobile: '',
        address: '',
        servicePeriod: '',
        dateOfJoiningService: null,
        degree: '',
        council: '',
        password: ''
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
        degree: '',
        council: '',
        password: ''
      });
      setPreviewImage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl backdrop-blur-xl bg-white/95 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-red-900" />
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
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
              <Label htmlFor="council">Council Name *</Label>
              <Input
                id="council"
                placeholder="Enter council name"
                value={formData.council}
                onChange={(e) => handleInputChange('council', e.target.value)}
                required
                className="bg-white/50"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfJoiningService">Date of Joining Service *</Label>
              <Input
                id="dateOfJoiningService"
                type="date"
                value={formData.dateOfJoiningService ? format(formData.dateOfJoiningService, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const selectedDate = e.target.value ? new Date(e.target.value) : null;
                  setFormData(prev => ({ ...prev, dateOfJoiningService: selectedDate }));
                }}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full bg-white/50"
                required
              />
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
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                disabled={!formData.name}
              >
                Generate Password
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
                className="bg-white/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Employee will use their NIC and this password to login
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-900 hover:bg-red-700"
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