'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Upload,
  Save,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { Employee } from '@/types';
import { toast } from 'sonner';

interface EditEmployeeFormProps {
  employeeId: string;
}

export default function EditEmployeeForm({ employeeId }: EditEmployeeFormProps) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    servicePeriod: '',
    dateOfJoiningService: '',
    degree: '',
    isActive: true,
    profilePicture: null as File | null
  });

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/director/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      const data = await response.json();
      setEmployee(data.employee);
      
      // Pre-fill form with existing data
      const emp = data.employee;
      setFormData({
        name: emp.name || '',
        email: emp.email || '',
        nic: emp.nic || '',
        mobile: emp.mobile || '',
        address: emp.address || '',
        servicePeriod: emp.servicePeriod || '',
        dateOfJoiningService: emp.dateOfJoiningService ? new Date(emp.dateOfJoiningService).toISOString().split('T')[0] : '',
        degree: emp.degree || '',
        isActive: emp.isActive ?? true,
        profilePicture: null
      });
      
      if (emp.profilePicture) {
        setPreviewUrl(emp.profilePicture);
      }
    } catch (error) {
      console.error('Fetch employee error:', error);
      toast.error('Failed to fetch employee details');
      router.push('/director/employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size too large. Maximum 5MB allowed.');
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('nic', formData.nic);
      submitData.append('mobile', formData.mobile);
      submitData.append('address', formData.address);
      submitData.append('servicePeriod', formData.servicePeriod);
      submitData.append('dateOfJoiningService', formData.dateOfJoiningService);
      submitData.append('degree', formData.degree);
      submitData.append('isActive', formData.isActive.toString());
      
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch(`/api/director/employees/${employeeId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update employee');
      }

      toast.success('Employee updated successfully! ✨', {
        description: 'Changes have been saved.',
      });
      
      router.push('/director/employees');
    } catch (error) {
      console.error('Update employee error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee not found</h3>
            <p className="text-gray-600 mb-4">The employee you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/director/employees')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Employees
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/director/employees')}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600">Update employee information</p>
        </div>
      </div>

      <Card className="max-w-5xl mx-auto backdrop-blur-xl bg-white/40 border border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Employee Information
          </CardTitle>
          <CardDescription>
            Update the details for {employee.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl} alt={formData.name} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="profilePicture" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </Label>
                <Badge variant={employee.isActive ? "default" : "secondary"}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className='bg-blue-100'
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-green-500" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                  className='bg-blue-100'
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nic" className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                  NIC Number *
                </Label>
                <Input
                  id="nic"
                  value={formData.nic}
                  onChange={(e) => handleInputChange('nic', e.target.value)}
                  placeholder="Enter NIC number"
                  required
                  className='bg-blue-100'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-500" />
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  className='bg-blue-100'
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                  className='bg-blue-100'
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={3}
                required
              />
            </div>

            {/* Service Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfJoiningService" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Date of Joining *
                </Label>
                <Input
                  id="dateOfJoiningService"
                  className='bg-blue-100'
                  type="date"
                  value={formData.dateOfJoiningService}
                  onChange={(e) => handleInputChange('dateOfJoiningService', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicePeriod" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                  Service Period *
                </Label>
                <Input
                id="degree"
                  className='bg-blue-100'
                placeholder="Enter service year"
                  value={formData.servicePeriod}
                  onChange={(e) => handleInputChange('servicePeriod', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree" className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                Degree (Optional)
              </Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                placeholder="Enter degree/qualification"
                  className='bg-blue-100'
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive" className="flex items-center">
                Employee Status: {formData.isActive ? 'Active' : 'Inactive'}
              </Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Employee
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/director/employees')}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}