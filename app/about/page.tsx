'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  Target,
  Award,
  BookOpen,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Shield,
  Lightbulb,
  Handshake,
  GraduationCap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const objectives = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Capacity Building",
      description: "Enhance the administrative and technical capabilities of local government officials through comprehensive training programs."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Professional Development",
      description: "Provide continuous learning opportunities to improve governance skills and knowledge in municipal administration."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Good Governance",
      description: "Promote transparency, accountability, and democratic principles in local government institutions."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation & Research",
      description: "Conduct research and develop innovative solutions for contemporary local governance challenges."
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Stakeholder Engagement",
      description: "Foster collaboration between local authorities, communities, and development partners."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sustainable Development",
      description: "Support local governments in implementing sustainable development practices and achieving SDGs."
    }
  ];

  const achievements = [
    { number: "341", label: "Local Government Institutions", description: "Municipal & Pradeshiya Sabhas" },
    { number: "15,600+", label: "Officials Trained", description: "Certified local government staff" },
    { number: "285+", label: "Training Programs", description: "Comprehensive governance courses" },
    { number: "25+", label: "Years of Service", description: "Building local governance capacity" }
  ];

  const keyPrograms = [
    {
      title: "Municipal Administration Certificate Program",
      description: "Comprehensive training on municipal governance, financial management, and service delivery.",
      duration: "12 weeks",
      participants: "2,500+ annually"
    },
    {
      title: "Leadership Development for Local Government",
      description: "Advanced leadership training for mayors, chairpersons, and senior officials.",
      duration: "8 weeks",
      participants: "500+ annually"
    },
    {
      title: "Financial Management for Local Authorities",
      description: "Specialized training on budgeting, revenue generation, and financial controls.",
      duration: "6 weeks",
      participants: "1,200+ annually"
    },
    {
      title: "Digital Governance Initiative",
      description: "Training on implementing digital solutions for citizen services and administration.",
      duration: "4 weeks",
      participants: "800+ annually"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
        <Header/>
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-red-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-red-900/90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-yellow-400 text-red-900 px-6 py-2 text-sm font-semibold">
                Est. 1999 • Ministry of Public Administration & Management
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight"
              variants={itemVariants}
            >
              About Sri Lanka Institute of Local Governance
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-red-100"
              variants={itemVariants}
            >
              Empowering local leaders and strengthening democratic governance at the grassroots level through 
              comprehensive training, capacity building, and institutional development programs.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section 
        className="py-20 bg-yellow-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
            >
              <Card className="h-full bg-white border-2 border-yellow-200 hover:border-red-200 hover:shadow-xl transition-all duration-500">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-red-900">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed text-center">
                    To be the premier institution for local governance education and capacity building in Sri Lanka, 
                    fostering effective, transparent, and accountable local government institutions that serve 
                    communities with excellence and integrity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
            >
              <Card className="h-full bg-white border-2 border-yellow-200 hover:border-red-200 hover:shadow-xl transition-all duration-500">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-red-900">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed text-center">
                    To strengthen local governance through innovative training programs, research, and institutional 
                    development initiatives that enhance the capabilities of local government officials and promote 
                    democratic participation at the grassroots level.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Background & History */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              A journey of strengthening democratic governance at the local level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-red-900">Establishment & Growth</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The Sri Lanka Institute of Local Governance was established in 1999 under the Ministry of 
                  Public Administration and Management as a specialized institution dedicated to strengthening 
                  local governance capacity in Sri Lanka.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Since its inception, SILG has been at the forefront of local government reform initiatives, 
                  providing comprehensive training and capacity building programs to officials from Municipal 
                  Councils, Urban Councils, and Pradeshiya Sabhas across the country.
                </p>
                <div className="space-y-3">
                  {[
                    "Established as the national center for local governance training",
                    "Developed comprehensive curriculum for municipal administration",
                    "Created partnerships with international development organizations",
                    "Pioneered digital governance training programs"
                  ].map((point, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-200">
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-red-900">Key Milestones</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                          99
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">1999 - Establishment</p>
                          <p className="text-sm text-gray-600">Founded under Ministry of Public Administration</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                          05
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">2005 - Curriculum Development</p>
                          <p className="text-sm text-gray-600">Launched comprehensive training programs</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                          15
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">2015 - Digital Initiative</p>
                          <p className="text-sm text-gray-600">Introduced e-governance training modules</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                          24
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">2024 - Digital Transformation</p>
                          <p className="text-sm text-gray-600">Launched comprehensive online platform</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Objectives Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">Our Objectives</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Strategic goals driving our commitment to excellence in local governance education
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="h-full bg-white border-2 border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-500">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-red-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                      {objective.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-red-900">
                      {objective.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Key Programs */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">Key Training Programs</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive training programs designed to build local governance capacity
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {keyPrograms.map((program, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="h-full bg-yellow-50 border-2 border-yellow-200 hover:border-red-200 hover:shadow-xl transition-all duration-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <GraduationCap className="w-6 h-6 text-red-900" />
                      <Badge className="bg-red-900 text-white">Training Program</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-red-900">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-red-900" />
                        <span className="text-sm font-medium text-gray-700">{program.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-red-900" />
                        <span className="text-sm font-medium text-gray-700">{program.participants}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Achievements Section */}
      <motion.section 
        className="py-20 bg-red-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Achievements</h2>
            <p className="text-xl text-red-100 max-w-4xl mx-auto">
              Building stronger local governance through measurable impact
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="space-y-3">
                    <p className="text-4xl md:text-5xl font-bold text-yellow-300">{achievement.number}</p>
                    <p className="text-lg font-semibold">{achievement.label}</p>
                    <p className="text-sm text-red-100">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-yellow-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Be part of Sri Lanka's local governance transformation. Enhance your skills, 
              strengthen your institution, and serve your community with excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/programs">
                  <Button size="lg" className="bg-red-900 hover:bg-red-800 text-white px-8 py-4 text-lg rounded-xl">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Explore Programs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-red-900 text-red-900 hover:bg-red-50 px-8 py-4 text-lg rounded-xl">
                    <Phone className="w-6 h-6 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      <Footer/>
    </div>
  );
}