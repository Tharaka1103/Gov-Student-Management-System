'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Loader2, 
  Upload, 
  X, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Users, 
  Briefcase, 
  Shield,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  IdCard,
  Building,
  Award,
  Target,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface RegisterFormData {
  name: string;
  email: string;
  nic: string;
  mobile: string;
  address: string;
  password: string;
  confirmPassword: string;
  managingDepartments: string[];
  profilePicture?: File;
}

const departments = [
  'Information Technology',
  'Human Resources',
  'Finance',
  'Operations',
  'Marketing',
  'Administration',
  'Research & Development'
];

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: '',
    managingDepartments: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const router = useRouter();

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
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
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error('Invalid file', { description: validation.error });
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Profile picture selected');
    }
  };

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024;
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.managingDepartments.length === 0) {
      setError('Please select at least one managing department');
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'managingDepartments') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key !== 'confirmPassword' && key !== 'profilePicture') {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful!', {
        description: 'Welcome to the team! You can now login.',
      });

      router.push('/login');
      
    } catch (error: any) {
      setError(error.message);
      toast.error('Registration failed', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Information Panel */}
        <div className="hidden lg:flex lg:w-2/5 bg-yellow-600 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-red-900 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 right-16 w-32 h-32 bg-red-900 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-red-900 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-between px-12 py-12">
            <div className="max-w-md">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="w-96 h-96 relative">
                  <Image
                    src="/newlogo1.png"
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Logo/Brand */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  Join Our Professional Team
                </h1>
                <p className="text-yellow-100 text-lg leading-relaxed">
                  Register as an Internal Auditor and help maintain the highest standards in organizational excellence.
                </p>
              </div>

              {/* Registration Process */}
              <div className="mt-12 p-6 bg-red-900 bg-opacity-20 rounded-2xl border border-red-900 border-opacity-30">
                <h3 className="font-bold text-xl mb-4 text-yellow-100">Simple Registration Process</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-yellow-500 font-bold text-sm">1</span>
                    </div>
                    <span className="text-yellow-100 font-medium">Fill in your personal information</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-yellow-500 font-bold text-sm">2</span>
                    </div>
                    <span className="text-yellow-100 font-medium">Select managing departments</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-yellow-500 font-bold text-sm">3</span>
                    </div>
                    <span className="text-yellow-100 font-medium">Create secure password</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-60 h-60 relative mx-auto mb-4">
                <Image
                  src="/newlogo1.png"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Internal Auditor Registration</h1>
              <p className="text-gray-600 mt-2">Create your professional account</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Fill in the information below to register as an Internal Auditor</p>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Profile Picture Upload */}
                  <div className="text-center">
                    <Label className="text-sm font-semibold text-gray-700 block mb-4">
                      Profile Picture (Optional)
                    </Label>
                    <div className="flex flex-col items-center space-y-4">
                      {previewImage ? (
                        <div className="relative">
                          <Image
                            src={previewImage}
                            alt="Profile preview"
                            width={120}
                            height={120}
                            className="rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-10 h-10 bg-red-900 text-yellow-500 rounded-full flex items-center justify-center hover:bg-red-800 shadow-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-28 h-28 border-3 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                          <Upload className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="max-w-xs"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Max 5MB. JPEG, PNG, WebP only.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="pl-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="pl-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nic" className="text-sm font-semibold text-gray-700">
                        NIC Number *
                      </Label>
                      <div className="relative">
                        <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="nic"
                          placeholder="Enter your NIC"
                          value={formData.nic}
                          onChange={(e) => handleInputChange('nic', e.target.value)}
                          required
                          className="pl-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">
                        Mobile Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="mobile"
                          placeholder="Enter your mobile number"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          required
                          className="pl-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                      Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                        className="pl-12 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  {/* Managing Departments */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Managing Departments *
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                      {departments.map((dept) => (
                        <label key={dept} className="flex items-center space-x-3 cursor-pointer p-4 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-yellow-300">
                          <input
                            type="checkbox"
                            checked={formData.managingDepartments.includes(dept)}
                            onChange={() => handleDepartmentChange(dept)}
                            className="rounded border-2 border-gray-300 text-yellow-600 focus:ring-yellow-600 w-5 h-5"
                          />
                          <span className="text-sm font-medium text-gray-700">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Password Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                          className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 rounded-xl text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-14 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-3" />
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account? 
                    <a href="/login" className="ml-1 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                      Sign in here
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-red-900" />
                <h3 className="text-sm font-semibold text-red-900">Security & Privacy Guaranteed</h3>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                Your information is encrypted using industry-standard security protocols. We follow strict privacy guidelines and never share your personal data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}