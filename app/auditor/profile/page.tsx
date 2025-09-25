'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Upload,
  Save,
  CreditCard,
  Building,
  Clock
} from 'lucide-react';
import { Employee } from '@/types';
import { toast } from 'sonner';

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    degree: '',
    profilePicture: null as File | null
  });

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      const response = await fetch('/api/employee/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setEmployee(data.employee);
      
      // Pre-fill form with existing data
      const emp = data.employee;
      setFormData({
        name: emp.name || '',
        email: emp.email || '',
        mobile: emp.mobile || '',
        address: emp.address || '',
        degree: emp.degree || '',
        profilePicture: null
      });
      
      if (emp.profilePicture) {
        setPreviewUrl(emp.profilePicture);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to fetch profile details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
      submitData.append('mobile', formData.mobile);
      submitData.append('address', formData.address);
      submitData.append('degree', formData.degree);
      
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch('/api/employee/profile', {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setEmployee(data.employee);
      setIsEditing(false);
      
      toast.success('Profile updated successfully! ✨', {
        description: 'Your changes have been saved.',
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewUrl || employee.profilePicture} alt={employee.name} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                  <p className="text-gray-600">Employee</p>
                  <Badge variant={employee.isActive ? "default" : "secondary"} className="mt-2">
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="w-full space-y-3 pt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>NIC: {employee.nic}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span>Council: {employee.council}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined: {formatDate(employee.dateOfJoiningService)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Service: {employee.servicePeriod}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={previewUrl} alt={formData.name} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {formData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
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
                        <p className="text-xs text-gray-500 mt-1">Max 5MB. JPEG, PNG, WebP only.</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Editable Fields */}
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
                        className="bg-blue-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-green-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        className="bg-blue-100"
                      />
                    </div>
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
                      className="bg-blue-100"
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      className="bg-blue-100"
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree" className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      Degree
                    </Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      placeholder="Enter degree/qualification"
                      className="bg-blue-100"
                    />
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
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        setFormData({
                          name: employee.name || '',
                          email: employee.email || '',
                          mobile: employee.mobile || '',
                          address: employee.address || '',
                          degree: employee.degree || '',
                          profilePicture: null
                        });
                        setPreviewUrl(employee.profilePicture || '');
                      }}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* View Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm font-medium">Full Name:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.name}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Mail className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-sm font-medium">Email:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Phone className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-sm font-medium">Mobile:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.mobile}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-sm font-medium">NIC Number:</span>
                        </div>
                        <p className="text-gray-900 font-mono font-bold">{employee.nic}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="w-4 h-4 mr-2 text-indigo-500" />
                          <span className="text-sm font-medium">Council:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.council}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Award className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="text-sm font-medium">Degree:</span>
                        </div>
                        <p className="text-gray-900 font-medium">{employee.degree || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm font-medium">Address:</span>
                    </div>
                    <p className="text-gray-900 font-medium leading-relaxed">{employee.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}