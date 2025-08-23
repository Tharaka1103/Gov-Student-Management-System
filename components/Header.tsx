'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  Shield,
  Clock,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

interface HeaderProps {
  role?: string;
}

type AuthUser = {
  username: string;
  role: string;
};

export default function Header({ role }: HeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch current user
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          signal: controller.signal,
        });

        if (!res.ok) {
          // Not authenticated or server error
          if (isMounted) setUser(null);
          return;
        }

        const data = await res.json();

        // Validate shape to prevent bad state
        if (
          data &&
          typeof data.username === 'string' &&
          typeof data.role === 'string'
        ) {
          if (isMounted) setUser({ username: data.username, role: data.role });
        } else {
          if (isMounted) setUser(null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const logout = async () => {
    try {
      // Ask the server to clear httpOnly cookies (if used)
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors; we'll still clear client-side below
    }

    // Best-effort client-side cleanup (for non-httpOnly cookies)
    deleteCookie('token', { path: '/' });

    // Clear local state/UI
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    // Navigate to home and refresh data
    router.push('/');
    // Optional: ensure any server components revalidate
    if (typeof router.refresh === 'function') router.refresh();
  };

  const navigationItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Courses', icon: BookOpen, href: '/courses' },
    { label: 'Contact', icon: MessageSquare, href: '/contact' },
  ];

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return Shield;
      case 'director':
        return Users;
      default:
        return UserIcon;
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'bg-red-500';
      case 'director':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-primary bg-clip-text text-transparent">
                  EduManage
                </h1>
                {role && (
                  <p className="text-xs text-gray-500 font-medium">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {loadingUser ? (
              // Simple skeleton placeholder while fetching auth state
              <div className="w-28 h-10 rounded-lg bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-primary text-white transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <div className="relative">
                    {React.createElement(getRoleIcon(user.role), {
                      className: 'w-5 h-5',
                    })}
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 ${getRoleColor(
                        user.role
                      )} rounded-full border-2 border-white`}
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-sm">{user.username}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                      <p className="font-semibold text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {currentTime.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          router.push(`/dashboard/${user.role}`);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">Dashboard</span>
                      </button>

                      <button
                        onClick={logout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-6 py-2 bg-primary rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Time Display */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString()}</span>
                <Clock className="w-4 h-4 ml-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}