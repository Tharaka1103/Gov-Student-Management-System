'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdminHeader from '@/components/layout/AdminHeader';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  User,
  Mail,
  Phone,
  IdCard,
  MapPin,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, Director } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const departments = [
  'Information Technology',
  'Human Resources',
  'Finance',
  'Operations',
  'Marketing',
  'Administration',
  'Research & Development',
  'Legal Affairs',
  'Public Relations',
  'Quality Assurance'
];

export default function EditDirectorPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [director, setDirector] = useState<Director | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    isActive: true,
    managingDepartments: [] as string[],
    profilePicture: null as File | null
  });

  useEffect(() => {
    fetchUserData();
    fetchDirector();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchDirector = async () => {
    try {
      const response = await fetch(`/api/admin/directors/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const directorData = data.director;
        setDirector(directorData);
        setFormData({
          name: directorData.name,
          email: directorData.email,
          nic: directorData.nic,
          mobile: directorData.mobile,
          address: directorData.address,
          isActive: directorData.isActive,
          managingDepartments: directorData.managingDepartments || [],
          profilePicture: null
        });
        setPreviewImage(directorData.profilePicture);
      } else {
        toast.error('Director not found');
        router.push('/admin/directors');
      }
    } catch (error) {
      console.error('Failed to fetch director:', error);
      toast.error('Failed to fetch director');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (department: string) => {
    setFormData(prev => ({
      ...prev,
      managingDepartments: prev.managingDepartments.includes(department)
        ? prev.managingDepartments.filter(d => d !== department)
        : [...prev.managingDepartments, department]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setPreviewImage(director?.profilePicture || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    if (formData.managingDepartments.length === 0) {
      setError('Please select at least one managing department');
      setIsSaving(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'managingDepartments') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key === 'isActive') {
          submitData.append(key, value as string);
        } else if (key !== 'profilePicture') {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch(`/api/admin/directors/${params.id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update director');
      }

      toast.success('Director updated successfully!');
      router.push('/admin/directors');

    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to update director');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/admin/directors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directors
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Director</h1>
            <p className="text-gray-600 text-sm">Update director information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Picture */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                {previewImage ? (
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={previewImage} alt="Profile" />
                      <AvatarFallback>
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {formData.profilePicture && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
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
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5MB. JPEG, PNG, WebP only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number *</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="nic"
                      placeholder="Enter NIC number"
                      value={formData.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="mobile"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Status</Label>
              </div>
            </CardContent>
          </Card>

          {/* Managing Departments */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Managing Departments *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {departments.map((dept) => (
                  <label key={dept} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.managingDepartments.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{dept}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/directors">
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Director
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}