'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Shield, 
  Award, 
  TrendingUp,
  School,
  UserCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  Bell,
  Target,
  Zap,
  Heart,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

interface CourseItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  students: string;
  rating: number;
  image: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentCourseSlide, setCurrentCourseSlide] = useState(0);

  // Memoized data to prevent recreation on each render
  const stats: StatItem[] = useMemo(() => [
    {
      label: "Registered Students",
      value: "25,847+",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Available Courses",
      value: "1,250+",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      label: "Educational Institutions",
      value: "480+",
      icon: <School className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Success Rate",
      value: "94.2%",
      icon: <Award className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ], []);

  const features: FeatureItem[] = useMemo(() => [
    {
      title: "Secure Access Control",
      description: "Multi-level authentication system ensuring data security and role-based access for administrators, directors, and users.",
      icon: <Shield className="w-12 h-12" />,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Real-time Analytics",
      description: "Comprehensive dashboard with live statistics, progress tracking, and detailed reporting for better decision making.",
      icon: <BarChart3 className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Digital Certification",
      description: "Automated certificate generation and verification system integrated with government databases.",
      icon: <Award className="w-12 h-12" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Mobile Responsive",
      description: "Fully responsive design ensuring seamless access across all devices including smartphones and tablets.",
      icon: <Globe className="w-12 h-12" />,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Automated Notifications",
      description: "Smart notification system for course updates, registration deadlines, and important announcements.",
      icon: <Bell className="w-12 h-12" />,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Progress Tracking",
      description: "Detailed progress monitoring with milestone tracking and performance analytics for continuous improvement.",
      icon: <Target className="w-12 h-12" />,
      color: "from-indigo-500 to-blue-600"
    }
  ], []);

  const services: ServiceItem[] = useMemo(() => [
    {
      title: "Student Registration & Management",
      description: "Comprehensive student lifecycle management from admission to graduation.",
      features: ["Online Registration", "Profile Management", "Academic Records", "Progress Tracking"],
      icon: <UserCheck className="w-8 h-8" />
    },
    {
      title: "Course & Curriculum Management",
      description: "Complete course administration with curriculum planning and resource allocation.",
      features: ["Course Creation", "Curriculum Planning", "Resource Management", "Assessment Tools"],
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: "Administrative Control Panel",
      description: "Powerful administrative tools for system management and oversight.",
      features: ["User Management", "System Settings", "Report Generation", "Audit Trails"],
      icon: <Settings className="w-8 h-8" />
    }
  ], []);

  const courses: CourseItem[] = useMemo(() => [
    {
      id: 1,
      title: "පරිගණක විද්‍යා මූලික කරුණු",
      description: "පරිගණක විද්‍යාවේ මූලික සංකල්ප, ක්‍රමලේඛනය සහ සෝෆ්ට්වෙයර් සංවර්ධනය ඉගෙන ගන්න",
      duration: "6 මාස",
      level: "ආරම්භක",
      students: "2,450+",
      rating: 4.8,
      image: "/course1j.jpg"
    },
    {
      id: 2,
      title: "ව්‍යාපාර කළමනාකරණය",
      description: "ව්‍යාපාරික අධ්‍යයනයන්, කළමනාකරණ කුසලතා සහ ව්‍යවසායකත්වය පිළිබඳ සම්පූර්ණ පාඨමාලාව",
      duration: "8 මාස",
      level: "මධ්‍යම",
      students: "1,840+",
      rating: 4.7,
      image: "/course2j.jpg"
    },
    {
      id: 3,
      title: "ඉංග්‍රීසි භාෂා කුසලතා",
      description: "ඉංග්‍රීසි කථන, ලේඛන, අසන සහ කියවීමේ කුසලතා වර්ධනය කරන විශේෂ පාඨමාලාව",
      duration: "4 මාස",
      level: "සියලු මට්ටම්",
      students: "3,120+",
      rating: 4.9,
      image: "/course3j.jpg"
    },
    {
      id: 4,
      title: "ගණිත සහ විද්‍යාව",
      description: "උසස් ගණිත, භෞතික විද්‍යාව, රසායන විද්‍යාව සහ ජීව විද්‍යාව පාඨමාලා",
      duration: "10 මාස",
      level: "උසස්",
      students: "1,680+",
      rating: 4.6,
      image: "/course4j.jpg"
    },
    {
      id: 5,
      title: "කලා සහ සංස්කෘතිය",
      description: "ශ්‍රී ලංකාවේ සාම්ප්‍රදායික කලා, සංස්කෘතික උරුමය සහ නවීන කලාකරණය",
      duration: "5 මාස",
      level: "ආරම්භක",
      students: "920+",
      rating: 4.5,
      image: "/course5j.jpg"
    }
  ], []);

  const heroSlides = useMemo(() => [
    {
      title: "පළාත් පාලනය පිළිබඳ ශ්‍රී ලංකා ආයතනය",
      subtitle: "ශ්‍රී ලංකාවේ අධ්‍යාපනික භූමිකාව පරිවර්තනය කිරීම",
      description: "නව්‍ය තාක්ෂණික විසඳුම් හරහා ශිෂ්‍යයන්, අධ්‍යාපකයන් සහ ආයතන සවිබල ගැන්වීම."
    },
    {
      title: "පළාත් පාලනය පිළිබඳ ශ්‍රී ලංකා ආයතනය",
      subtitle: "අධ්‍යාපන අමාත්‍යාංශය - ශ්‍රී ලංකාව",
      description: "විධිමත් අධ්‍යාපන පරිපාලනය සහ කළමනාකරණය සඳහා නිල රජයේ වේදිකාව."
    },
    {
      title: "පළාත් පාලනය පිළිබඳ ශ්‍රී ලංකා ආයතනය",
      subtitle: "අද හෙටේ නායකයින් ගොඩනැගීම",
      description: "සියලුම ශ්‍රී ලාංකික ශිෂ්‍යයන් සඳහා ගුණාත්මක අධ්‍යාපනයට සහාය වන විස්තීර්ණ ඩිජිටල් යටිතල පහසුකම්."
    }
  ], []);

  // Optimized callbacks
  const nextCourseSlide = useCallback(() => {
    setCurrentCourseSlide((prev) => (prev + 1) % courses.length);
  }, [courses.length]);

  const prevCourseSlide = useCallback(() => {
    setCurrentCourseSlide((prev) => (prev - 1 + courses.length) % courses.length);
  }, [courses.length]);

  // Optimized useEffect with proper cleanup
  useEffect(() => {
    setIsVisible(true);
    
    const heroInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const courseInterval = setInterval(() => {
      setCurrentCourseSlide((prev) => (prev + 1) % courses.length);
    }, 4000);
    
    return () => {
      clearInterval(heroInterval);
      clearInterval(courseInterval);
    };
  }, [heroSlides.length, courses.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-grow relative z-10">
        {/* Hero Section - Sinhala */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              {/* Dynamic Hero Content */}
              <div className="space-y-6 min-h-[300px] flex flex-col justify-center">
                <h1 className={`text-2xl md:text-5xl lg:text-6xl font-extrabold bg-primary bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {heroSlides[currentSlide].title}
                </h1>
                <h2 className={`text-2xl md:text-3xl font-bold text-gray-700 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {heroSlides[currentSlide].subtitle}
                </h2>
                <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Button size="lg" className="bg-primary text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <UserCheck className="w-5 h-5 mr-2" />
                  අද පටන් ගන්න
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary w-8' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                        {stat.icon}
                      </div>
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section - New Slider */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/10 to-purple-900/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                ජනප්‍රිය පාඨමාලා
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                අපගේ සම්පූර්ණ පාඨමාලා පරාසයෙන් තෝරාගත් ප්‍රධාන අධ්‍යාපන වැඩසටහන්
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentCourseSlide * 100}%)` }}
                >
                  {courses.map((course, index) => (
                    <div key={course.id} className="w-full flex-shrink-0">
                      <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 mx-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden group">
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={index === 0}
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-blue-600 text-white">
                                {course.level}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-green-600 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                {course.rating}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white">
                                <Play className="w-4 h-4 mr-2" />
                                පෙරදසුන
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-center space-y-6">
                            <div>
                              <h3 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h3>
                              <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-700">{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700">{course.students}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-purple-500" />
                                <span className="text-gray-700">{course.level}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-700">{course.rating} අගය</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-4">
                              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                                <BookOpen className="w-4 h-4 mr-2" />
                                ලියාපදිංචි වන්න
                              </Button>
                              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                                <Download className="w-4 h-4 mr-2" />
                                විස්තර
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevCourseSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous course"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextCourseSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next course"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>

              {/* Course Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {courses.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentCourseSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentCourseSlide(index)}
                    aria-label={`Go to course ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced capabilities designed to streamline educational administration and enhance learning experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-500 hover:scale-105 group">
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive solutions for modern educational administration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Role-based Access Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Access Levels
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tailored experiences for different user roles within the education system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white mb-4 mx-auto">
                    <Shield className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-red-700">Admin Control</CardTitle>
                  <CardDescription>Complete system administration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Full system access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">User management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">System configuration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Advanced reporting</span>
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                      Admin Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700">Director Tools</CardTitle>
                  <CardDescription>Institutional management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Course management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Student enrollment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Progress monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Resource allocation</span>
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                      Director Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4 mx-auto">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-700">User View</CardTitle>
                  <CardDescription>Student & public access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Browse courses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">View student profiles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Access resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Track progress</span>
                    </div>
                  </div>
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      Register Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Government Information Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/10 to-blue-900/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Government Initiative
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  This Student Management System is an official initiative by the Ministry of Education, Sri Lanka, 
                  designed to digitize and streamline educational administration across all government institutions. 
                  Our mission is to provide equitable access to quality education through innovative technology solutions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Digital Sri Lanka Initiative</h4>
                      <p className="text-gray-600">Part of the national digitization program</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Quality Education for All</h4>
                      <p className="text-gray-600">Ensuring inclusive access to educational resources</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Sustainable Development Goals</h4>
                      <p className="text-gray-600">Aligned with UN SDG 4: Quality Education</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="backdrop-blur-xl bg-white/40 border border-white/30 p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold text-lg">Ministry of Education</h3>
                        <p className="text-gray-600">Democratic Socialist Republic of Sri Lanka</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">Isurupaya, Battaramulla, Sri Lanka</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">+94 11 2785 141</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">info@moe.gov.lk</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <a href="https://www.moe.gov.lk" className="text-blue-600 hover:underline">
                          www.moe.gov.lk
                          <ExternalLink className="w-4 h-4 inline ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="backdrop-blur-xl bg-blue-100 border border-primary p-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold bg-primary bg-clip-text text-transparent">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Join thousands of students, educators, and institutions already using our platform to enhance their educational journey.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-primary text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <UserCheck className="w-6 h-6 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="backdrop-blur-xl bg-white/30 border px-8 py-6 text-lg rounded-xl shadow-lg">
                      <Shield className="w-6 h-6 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}