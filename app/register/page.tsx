'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, Mail, User, Phone, CreditCard, Briefcase, MapPin, Lock, UserPlus, ArrowRight, Check, X } from 'lucide-react';

interface RegisterForm {
  email: string;
  username: string;
  contact: string;
  nic: string;
  work: string;
  address: string;
  password: string;
}

interface RegisterErrors {
  email?: string;
  username?: string;
  contact?: string;
  nic?: string;
  work?: string;
  address?: string;
  password?: string;
  submit?: string;
}

interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrength {
  checks: PasswordChecks;
  score: number;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ 
    email: '', 
    username: '', 
    contact: '', 
    nic: '', 
    work: '', 
    address: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [step, setStep] = useState<number>(1);

  const getPasswordStrength = (password: string): PasswordStrength => {
    const checks: PasswordChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const validateStep1 = (): boolean => {
    const newErrors: RegisterErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.username) newErrors.username = 'Username is required';
    else if (form.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!form.password) newErrors.password = 'Password is required';
    else if (passwordStrength.score < 3) newErrors.password = 'Password is too weak';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: RegisterErrors = {};
    if (!form.contact) newErrors.contact = 'Contact number is required';
    else if (!/^\d{10,}$/.test(form.contact.replace(/\s/g, ''))) newErrors.contact = 'Invalid contact number';
    if (!form.nic) newErrors.nic = 'NIC is required';
    if (!form.work) newErrors.work = 'Work information is required';
    if (!form.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (): void => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const submit = async (): Promise<void> => {
    if (!validateStep2()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', { 
        method: 'POST', 
        body: JSON.stringify(form), 
        headers: { 'Content-Type': 'application/json' } 
      });
      
      if (res.ok) {
        router.push('/dashboard/user');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-green-100 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
                <UserPlus className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600">Join us today and get started</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                step > 1 ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                  <p className="text-sm text-gray-500">Let's start with your basic details</p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={`pl-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.email ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      className={`pl-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.username ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className={`pl-10 pr-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.password ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.score
                                ? passwordStrength.score <= 2
                                  ? 'bg-red-400'
                                  : passwordStrength.score <= 3
                                  ? 'bg-yellow-400'
                                  : 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(passwordStrength.checks).map(([key, value]) => (
                          <div key={key} className={`flex items-center space-x-1 ${value ? 'text-green-600' : 'text-gray-400'}`}>
                            {value ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>
                              {key === 'length' && '8+ chars'}
                              {key === 'uppercase' && 'Uppercase'}
                              {key === 'lowercase' && 'Lowercase'}
                              {key === 'number' && 'Number'}
                              {key === 'special' && 'Special'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full h-12 bg-green-500 text-white hover:bg-green-500 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
                  <p className="text-sm text-gray-500">Complete your profile information</p>
                </div>

                {/* Contact Field */}
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium text-gray-700">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="contact"
                      placeholder="Your phone number"
                      value={form.contact}
                      onChange={e => setForm({ ...form, contact: e.target.value })}
                      className={`pl-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.contact ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
                </div>

                {/* NIC Field */}
                <div className="space-y-2">
                  <Label htmlFor="nic" className="text-sm font-medium text-gray-700">National ID</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="nic"
                      placeholder="Your national ID number"
                      value={form.nic}
                      onChange={e => setForm({ ...form, nic: e.target.value })}
                      className={`pl-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.nic ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.nic && <p className="text-red-500 text-sm">{errors.nic}</p>}
                </div>

                {/* Work Field */}
                <div className="space-y-2">
                  <Label htmlFor="work" className="text-sm font-medium text-gray-700">Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="work"
                      placeholder="Your occupation"
                      value={form.work}
                      onChange={e => setForm({ ...form, work: e.target.value })}
                      className={`pl-10 h-12 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 ${
                        errors.work ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.work && <p className="text-red-500 text-sm">{errors.work}</p>}
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <Input
                      id="address"
                      placeholder="Your full address"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className={`pl-10 h-20 bg-white/50 border-white/20 backdrop-blur-sm rounded-xl focus:bg-white/70 transition-all duration-300 resize-none ${
                        errors.address ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={submit}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-green-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:bg-green-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Create Account</span>
                        <UserPlus className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/30 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full block text-center py-3 px-4 bg-blue-500 text-white rounded-b-2xl hover:bg-white/50 hover:text-blue-500 transition-all duration-300 font-medium"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}