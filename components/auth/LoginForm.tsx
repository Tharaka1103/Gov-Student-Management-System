'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2, 
  Shield, 
  Heart, 
  Users, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Mail,
  Lock,
  Star,
  Award,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { LoginCredentials } from '@/types';

export default function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Submitting login for:', credentials.email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (credentials.rememberMe) {
        toast.success('We\'ll remember you!', {
          description: 'You won\'t need to login again for 7 days.',
        });
      }

      toast.success(`Welcome back, ${data.user.name}!`, {
        description: 'Redirecting to your dashboard...',
      });

      console.log('Redirecting to:', data.redirectTo);
      setTimeout(() => {
        window.location.href = data.redirectTo;
      }, 1500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      toast.error('Login failed', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setCredentials(prev => ({ ...prev, rememberMe: checked }));
    if (checked) {
      toast.info('Remember me enabled', {
        description: 'We\'ll keep you logged in for 7 days',
        icon: <Heart className="w-4 h-4 text-red-500" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Information Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-red-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-yellow-500 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-12">
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
                  Directors Management System
                </h1>
                <p className="text-red-100 text-lg leading-relaxed">
                  Streamline your organization's leadership with our comprehensive director management platform.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">500+</div>
                  <div className="text-red-200 text-sm">Organizations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">50K+</div>
                  <div className="text-red-200 text-sm">Directors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">99.9%</div>
                  <div className="text-red-200 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
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
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Please sign in to your account to continue</p>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="pl-12 h-14 border-2 border-gray-200 focus:border-red-900 focus:ring-red-900 rounded-xl text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-red-900 focus:ring-red-900 rounded-xl text-base"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="rememberMe"
                        checked={credentials.rememberMe}
                        onCheckedChange={handleRememberMeChange}
                        className="border-2 border-gray-300 data-[state=checked]:bg-red-900 data-[state=checked]:border-red-900"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm text-gray-600 cursor-pointer font-medium"
                      >
                        Remember me for 7 days
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-900 hover:text-red-700 font-semibold transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-14 bg-red-900 hover:bg-red-800 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-3" />
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Internal Auditor? 
                    <a href="/register" className="ml-1 text-red-900 hover:text-red-700 font-semibold transition-colors">
                      Register here
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Info */}
            <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-600" />
                <h3 className="text-sm font-semibold text-yellow-900">Quick Access Roles</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-900 rounded-full"></div>
                  <p className="text-xs text-yellow-800">Admin: Full system access and control</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-900 rounded-full"></div>
                  <p className="text-xs text-yellow-800">Director: Department management</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-900 rounded-full"></div>
                  <p className="text-xs text-yellow-800">Internal Auditor: Audit & workshops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}