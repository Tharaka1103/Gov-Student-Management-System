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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Building, Upload, X, Eye, EyeOff, User, Mail, Phone, IdCard, MapPin, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';
import { Director } from '@/types';

interface CreateDirectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (director: Director) => void; // Changed: Remove generatedPassword from here
}

interface DirectorFormData {
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  profilePicture?: File;
  password: string;
}

export default function CreateDirectorDialog({
  isOpen,
  onClose,
  onSuccess
}: CreateDirectorDialogProps) {
  const [formData, setFormData] = useState<DirectorFormData>({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordCustom, setIsPasswordCustom] = useState(false);

  // Safe function to get initials
  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field: keyof DirectorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate password when name changes, only if password hasn't been manually customized
    if (field === 'name' && value && !isPasswordCustom) {
      const autoPassword = value.toLowerCase().replace(/\s+/g, '') + '1234';
      setFormData(prev => ({ ...prev, password: autoPassword }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    setIsPasswordCustom(true);
  };

  const handleGenerateRandomPassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    setIsPasswordCustom(true);
    toast.success('Random password generated!');
  };

  const handleGenerateSimplePassword = () => {
    if (formData.name) {
      const simplePassword = formData.name.toLowerCase().replace(/\s+/g, '') + '1234';
      setFormData(prev => ({ ...prev, password: simplePassword }));
      setIsPasswordCustom(false);
      toast.success('Simple password generated!');
    } else {
      toast.error('Please enter the name first');
    }
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
    setFormData(prev => ({ ...prev, profilePicture: undefined }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key !== 'profilePicture') {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch('/api/admin/directors', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create director');
      }

      // Fix: Pass only the director object, not the entire response
      if (data.director) {
        // Show success message with generated password
        if (data.generatedPassword) {
          toast.success(`Director created! Password: ${data.generatedPassword}`, {
            duration: 10000, // Show for 10 seconds
          });
        }
        
        onSuccess(data.director); // Pass only the director object
      } else {
        throw new Error('Invalid response format');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        nic: '',
        mobile: '',
        address: '',
        password: ''
      });
      setPreviewImage(null);
      setIsPasswordCustom(false);

    } catch (error: any) {
      console.error('Create director error:', error);
      setError(error.message);
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
        password: ''
      });
      setPreviewImage(null);
      setIsPasswordCustom(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-red-900" />
            <span>Create New Director</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the director details. You can customize the password as needed.
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
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={previewImage} alt="Profile preview" />
                    <AvatarFallback>
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  placeholder="Enter director's full name"
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

          {/* Password Section */}
          <div className="space-y-4">
            <Label>Password *</Label>
            <div className="space-y-3">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter or generate password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Generation Options */}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSimplePassword}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Simple Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateRandomPassword}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Random Password
                </Button>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <p key="password-help-1">• Simple Password: Uses name + "1234" (e.g., "johnsmith1234")</p>
                <p key="password-help-2">• Random Password: Generates a secure 12-character password</p>
                <p key="password-help-3">• You can also type your own custom password</p>
              </div>
            </div>
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
                  Creating...
                </>
              ) : (
                'Create Director'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}