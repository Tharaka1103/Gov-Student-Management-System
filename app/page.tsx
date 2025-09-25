'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
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
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Settings,
  BarChart3,
  Calendar,
  Bell,
  Target,
  Heart,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Gavel,
  TreePine,
  Handshake,
  FileText,
  Clock,
  Map,
  PieChart,
  MessageSquare,
  Lightbulb,
  Trophy,
  GraduationCap,
  Search,
  Filter,
  Eye,
  Plus
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
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
  participants: string;
  rating: number;
  image: string;
  category: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCourseSlide, setCurrentCourseSlide] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Enhanced stats for Local Governance
  const stats: StatItem[] = [
    {
      label: "Local Government Institutions",
      value: "341",
      icon: <Building2 className="w-8 h-8" />,
      description: "Municipal Councils & Pradeshiya Sabhas"
    },
    {
      label: "Trained Officials",
      value: "15,600+",
      icon: <Users className="w-8 h-8" />,
      description: "Local government staff certified"
    },
    {
      label: "Training Programs",
      value: "285+",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Comprehensive governance courses"
    },
    {
      label: "Success Rate",
      value: "96.8%",
      icon: <Award className="w-8 h-8" />,
      description: "Program completion rate"
    }
  ];

  // Enhanced features for Local Governance
  const features: FeatureItem[] = [
    {
      title: "Municipal Administration Training",
      description: "Comprehensive programs for municipal councils, urban councils, and pradeshiya sabhas administration",
      icon: <Building2 className="w-12 h-12" />,
      benefits: ["Financial Management", "Urban Planning", "Service Delivery", "Public Administration"]
    },
    {
      title: "Digital Governance Solutions",
      description: "Modern digital tools and platforms for efficient local government operations and citizen services",
      icon: <Globe className="w-12 h-12" />,
      benefits: ["E-Governance Systems", "Online Services", "Digital Records", "Citizen Portals"]
    },
    {
      title: "Leadership Development",
      description: "Building strong leadership capabilities for mayors, chairpersons, and senior local government officials",
      icon: <Award className="w-12 h-12" />,
      benefits: ["Executive Training", "Decision Making", "Public Speaking", "Strategic Planning"]
    },
    {
      title: "Policy Implementation",
      description: "Training on national policy implementation at local level and compliance management",
      icon: <FileText className="w-12 h-12" />,
      benefits: ["Policy Analysis", "Implementation Strategies", "Compliance Monitoring", "Legal Framework"]
    },
    {
      title: "Financial Management",
      description: "Comprehensive financial planning, budgeting, and resource management for local authorities",
      icon: <PieChart className="w-12 h-12" />,
      benefits: ["Budget Planning", "Revenue Generation", "Financial Controls", "Audit Compliance"]
    },
    {
      title: "Community Engagement",
      description: "Strategies and tools for effective citizen participation and community development initiatives",
      icon: <Handshake className="w-12 h-12" />,
      benefits: ["Public Consultation", "Community Projects", "Stakeholder Engagement", "Participatory Governance"]
    }
  ];

  // Enhanced services for Local Governance
  const services: ServiceItem[] = [
    {
      title: "Local Government Officer Training",
      description: "Comprehensive training programs for all levels of local government staff and officials",
      features: ["Administrative Training", "Technical Skills", "Leadership Development", "Performance Management"],
      icon: <UserCheck className="w-8 h-8" />
    },
    {
      title: "Institutional Capacity Building",
      description: "Strengthening local government institutions through systematic capacity development programs",
      features: ["Organizational Development", "System Implementation", "Process Improvement", "Quality Assurance"],
      icon: <Building2 className="w-8 h-8" />
    },
    {
      title: "Research & Development",
      description: "Continuous research and development initiatives to improve local governance practices",
      features: ["Policy Research", "Best Practices", "Innovation Programs", "Knowledge Management"],
      icon: <Lightbulb className="w-8 h-8" />
    }
  ];

  // Enhanced courses for Local Governance
  const courses: CourseItem[] = [
    {
      id: 1,
      title: "Municipal Administration & Management",
      description: "Comprehensive program covering all aspects of municipal governance, administration, and service delivery",
      duration: "12 weeks",
      level: "Intermediate to Advanced",
      participants: "1,850+",
      rating: 4.8,
      image: "/course-municipal.jpg",
      category: "Administration"
    },
    {
      id: 2,
      title: "Local Government Finance & Budgeting",
      description: "Specialized training on financial management, budgeting, and revenue generation for local authorities",
      duration: "8 weeks",
      level: "Advanced",
      participants: "1,240+",
      rating: 4.9,
      image: "/course-finance.jpg",
      category: "Finance"
    },
    {
      id: 3,
      title: "Urban Planning & Development",
      description: "Modern approaches to urban planning, sustainable development, and infrastructure management",
      duration: "10 weeks",
      level: "Intermediate",
      participants: "980+",
      rating: 4.7,
      image: "/course-planning.jpg",
      category: "Planning"
    },
    {
      id: 4,
      title: "Digital Governance & E-Services",
      description: "Implementation of digital solutions for citizen services and government operations",
      duration: "6 weeks",
      level: "Beginner to Intermediate",
      participants: "2,100+",
      rating: 4.6,
      image: "/course-digital.jpg",
      category: "Technology"
    },
    {
      id: 5,
      title: "Community Development & Engagement",
      description: "Strategies for effective community participation and grassroots development initiatives",
      duration: "9 weeks",
      level: "All Levels",
      participants: "1,560+",
      rating: 4.8,
      image: "/course-community.jpg",
      category: "Community"
    }
  ];

  const heroSlides = [
    {
      title: "Empowering Local Governance",
      subtitle: "Sri Lanka Institute of Local Governance",
      description: "Building capacity and excellence in local government administration through innovative training programs and digital solutions.",
    }
  ];

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    const courseInterval = setInterval(() => {
      setCurrentCourseSlide((prev) => (prev + 1) % courses.length);
    }, 5000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(courseInterval);
    };
  }, [heroSlides.length, courses.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ y }}
          className="relative overflow-hidden py-20 bg-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/group.jpg"
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              className="text-center space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              {/* Institution Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center px-6 py-3 bg-yellow-100 text-red-900 rounded-full text-sm font-semibold border border-yellow-200">
                  <Building2 className="w-4 h-4 mr-2" />
                  Ministry of Public Administration & Management
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-red-900 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
                  {heroSlides[currentSlide].subtitle}
                </h2>

                <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-red-900 hover:bg-red-800 text-white px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <GraduationCap className="w-6 h-6 mr-3" />
                    Start Learning Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-2 border-red-900 text-red-900 hover:bg-red-50 px-10 py-6 text-lg transition-all duration-300">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Overview
                  </Button>
                </motion.div>
              </motion.div>

              
            </motion.div>
          </div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section
          ref={statsRef}
          className="py-20 bg-yellow-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
                Our Impact in Numbers
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strengthening local governance across Sri Lanka through comprehensive training and capacity building programs
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={cardVariants} whileHover="hover">
                  <Card className="bg-white border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-red-900 rounded-xl flex items-center justify-center text-white">
                          {stat.icon}
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-red-900">{stat.value}</p>
                        <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          className="py-24 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-red-900 mb-6">
                Our Core Training Areas
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Comprehensive programs designed to enhance the capabilities of local government institutions and officials
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={cardVariants} whileHover="hover">
                  <Card className="bg-white border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-500 h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-red-900 rounded-2xl mb-6 mx-auto">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl font-bold text-red-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center mb-6 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="space-y-3">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          ref={servicesRef}
          className="py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              variants={containerVariants}
              initial="hidden"
              animate={servicesInView ? "visible" : "hidden"}
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-red-900 mb-6">
                Our Services
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Comprehensive support services for local government institutions and officials
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={containerVariants}
              initial="hidden"
              animate={servicesInView ? "visible" : "hidden"}
            >
              {services.map((service, index) => (
                <motion.div key={index} variants={cardVariants} whileHover="hover">
                  <Card className="bg-white border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-500 h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-red-900 text-white rounded-lg flex items-center justify-center mb-4">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl font-bold text-red-900">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </CardDescription>
                      <div className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Role-based Access Section */}
        <motion.section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-red-900 mb-6">
                Access by Role
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Specialized access and training programs tailored for different levels of local government
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Administrator */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-red-50 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-500">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900 text-white rounded-full mb-6 mx-auto">
                      <Shield className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-900 mb-2">System Administrator</CardTitle>
                    <CardDescription className="text-red-700">Complete system management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {[
                        "Full system access",
                        "User management",
                        "System configuration",
                        "Advanced reporting"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-red-900 hover:bg-red-800 text-lg py-6">
                        <Shield className="w-5 h-5 mr-2" />
                        Admin Login
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Director */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-500">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900 text-white rounded-full mb-6 mx-auto">
                      <Building2 className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-900 mb-2">Institute Directors</CardTitle>
                    <CardDescription className="text-red-700">Institutional management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {[
                        "Program management",
                        "Staff coordination",
                        "Progress monitoring",
                        "Resource allocation"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-red-900 hover:bg-red-800 text-lg py-6">
                        <Building2 className="w-5 h-5 mr-2" />
                        Director Login
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Participants */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-green-50 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-500">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900 text-white rounded-full mb-6 mx-auto">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-900 mb-2">Training Participants</CardTitle>
                    <CardDescription className="text-red-700">Learning and development</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {[
                        "Course enrollment",
                        "Learning materials",
                        "Progress tracking",
                        "Certificate access"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/register">
                      <Button className="w-full bg-red-900 hover:bg-red-800 text-lg py-6">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Register Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}