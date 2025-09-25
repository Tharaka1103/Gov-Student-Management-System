'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  Menu,
  X,
  UserCheck,
  Phone
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: 'View our home page'
    },
    {
      title: 'About Us',
      href: '/about',
      description: 'Learn about our mission and vision'
    },
    {
      title: 'Contact Us',
      href: '/contact',
      description: 'Get in touch with us'
    }
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full bg-white border-b-2 border-yellow-400 shadow-lg"
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover="hover"
          >
            <Link href="/" className="flex items-center space-x-4">
              {/* Logo Image */}
              <div className="relative">
                <div className="w-14 h-14 bg-white shadow-lg">
                  <Image
                    src="/newlogo1.png" // You'll need to add this logo image to your public folder
                    alt="SILG Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain rounded-full"
                    priority
                  />
                </div>
              </div>
              
              {/* Logo Text */}
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-red-900 leading-tight">
                  SLILG
                </h1>
                <p className="text-sm text-gray-600 font-medium leading-tight">
                  Sri Lanka Institute of Local Governance
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
              >
                <Link href={item.href}>
                  <Button 
                    variant="ghost" 
                    className="h-12 px-6 text-base font-medium text-gray-700 hover:text-red-900 hover:bg-yellow-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-200"
                  >
                    {item.title}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="bg-red-900 text-white px-6 py-3 font-medium transition-all duration-300"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              
            </div>

            {/* Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden"
            >
              <Button
                variant="ghost"
                size="lg"
                className="text-red-900 hover:bg-yellow-50 rounded-xl p-3"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? 
                  <X className="w-6 h-6" /> : 
                  <Menu className="w-6 h-6" />
                }
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="lg:hidden border-t border-yellow-200 bg-white"
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <nav className="py-6 space-y-2">
                {/* Mobile Navigation Items */}
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={mobileItemVariants}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-4 px-4 py-4 text-base font-medium text-gray-700 hover:text-red-900 hover:bg-yellow-50 rounded-xl mx-2 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.title}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="pt-6 px-2 space-y-3 border-t border-yellow-200">
                  <motion.div variants={mobileItemVariants}>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        size="lg" 
                    className="bg-red-900 text-white px-6 py-3 font-medium transition-all duration-300"
                      >
                        <Shield className="w-5 h-5 mr-3" />
                        Sign In
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}