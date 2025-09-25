'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  UserCheck,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  ClipboardCheck,
  ChevronDown,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface AuditorHeaderProps {
  user: User;
}

export default function AuditorHeader({ user }: AuditorHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    toast.success('Take care! 👋', {
      description: 'You have been logged out successfully.',
    });
    router.push('/login');
  };

  const navigationItems = [
    { href: '/auditor/dashboard', label: 'Dashboard', icon: ClipboardCheck },
    { href: '/auditor/workshops', label: 'Workshops', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/20 bg-white shadow-lg">
      <div className="container flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/auditor/dashboard" className="flex items-center space-x-3 group">
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-red-900 group-hover:text-yellow-400 transition-colors duration-200">
                Auditor Panel
              </h1>
              <p className="text-sm text-red-900/60 font-medium">Workshop Management</p>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-900/70 hover:text-red-900 hover:bg-yellow-100 rounded-lg transition-all duration-200 group"
            >
              <item.icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-yellow-100 rounded-xl transition-all duration-200 border border-transparent hover:border-yellow-400/30">
                <Avatar className="w-10 h-10 border-2 border-yellow-400/30">
                  <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-red-900 to-yellow-400 text-white font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-red-900">{user.name}</p>
                  <Badge className="text-xs bg-yellow-100 text-red-900 border border-yellow-400 font-bold hover:bg-yellow-200">
                    Internal Auditor
                  </Badge>
                </div>
                <ChevronDown className="w-4 h-4 text-red-900/60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-red-900/10 shadow-xl rounded-xl p-2">
              <DropdownMenuItem asChild>
                <Link href="/auditor/profile" className="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                  <UserCheck className="w-5 h-5 mr-3 text-red-900" />
                  <span className="text-red-900 font-medium">Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auditor/settings" className="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                  <Settings className="w-5 h-5 mr-3 text-red-900" />
                  <span className="text-red-900 font-medium">Preferences</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-red-900/10" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center px-4 py-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                <LogOut className="w-5 h-5 mr-3 text-red-600" />
                <span className="text-red-600 font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-10 h-10 rounded-lg hover:bg-yellow-100 border border-transparent hover:border-yellow-400/30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5 text-red-900" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-red-900/10 bg-white shadow-lg">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 text-sm font-medium text-red-900/70 hover:text-red-900 p-4 rounded-xl hover:bg-yellow-100 transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}