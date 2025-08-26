'use client';
import { useState, useEffect } from 'react';
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
  image: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentCourseSlide, setCurrentCourseSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats: StatItem[] = [
    {
      label: "ලියාපදිංචි ශිෂ්‍යයන්",
      value: "25,847+",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "පාඨමාලා ගණන",
      value: "1,250+",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      label: "අධ්‍යාපන ආයතන",
      value: "480+",
      icon: <School className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "සාර්ථකත්ව අනුපාතය",
      value: "94.2%",
      icon: <Award className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const features: FeatureItem[] = [
    {
      title: "ආරක්ෂිත ප්‍රවේශ පාලනය",
      description: "දත්ත ආරක්ෂාව සහ පරිපාලකයින්, අධ්‍යක්ෂවරුන් සහ පරිශීලකයින් සඳහා භූමිකා මත පදනම් වූ ප්‍රවේශය සහතික කරන බහු-මට්ටම් සත්‍යාපන පද්ධතියක්.",
      icon: <Shield className="w-12 h-12" />,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "තත්‍ය කාලීන විශ්ලේෂණ",
      description: "වඩා හොඳ තීරණ ගැනීම සඳහා සජීව සංඛ්‍යාලේඛන, ප්‍රගති ලුහුබැඳීම සහ සවිස්තරාත්මක වාර්තාකරණය සහිත විස්තීර්ණ උපකරණ පුවරුව.",
      icon: <BarChart3 className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "ඩිජිටල් සහතික කිරීම",
      description: "රජයේ දත්ත සමුදායන් සමඟ ඒකාබද්ධ කරන ලද ස්වයංක්‍රීය සහතික ජනනය සහ සත්‍යාපන පද්ධතිය.",
      icon: <Award className="w-12 h-12" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "ජංගම ප්‍රතිචාරාත්මක",
      description: "ස්මාර්ට් ෆෝන් සහ ටැබ්ලට් ඇතුළු සියලුම උපකරණ හරහා බාධාවකින් තොරව ප්‍රවේශ වීම සහතික කරන සම්පූර්ණයෙන්ම ප්‍රතිචාරාත්මක සැලසුම.",
      icon: <Globe className="w-12 h-12" />,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "ස්වයංක්‍රීය දැනුම්දීම්",
      description: "පාඨමාලා යාවත්කාලීන කිරීම්, ලියාපදිංචි කිරීමේ අවසාන දිනයන් සහ වැදගත් නිවේදන සඳහා ස්මාර්ට් දැනුම්දීම් පද්ධතිය.",
      icon: <Bell className="w-12 h-12" />,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "ප්‍රගති ලුහුබැඳීම",
      description: "අඛණ්ඩ වැඩිදියුණු කිරීම සඳහා සන්ධිස්ථාන ලුහුබැඳීම සහ කාර්ය සාධන විශ්ලේෂණ සහිත සවිස්තරාත්මක ප්‍රගති නිරීක්ෂණය.",
      icon: <Target className="w-12 h-12" />,
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const services: ServiceItem[] = [
    {
      title: "ශිෂ්‍ය ලියාපදිංචි කිරීම සහ කළමනාකරණය",
      description: "ප්‍රවේශයේ සිට උපාධිය දක්වා සම්පූර්ණ ශිෂ්‍ය ජීවන චක්‍ර කළමනාකরණය.",
      features: ["ඔන්ලයින් ලියාපදිංචි කිරීම", "පැතිකඩ කළමනාකරණය", "අකාදමික වාර්තා", "ප්‍රගති ලුහුබැඳීම"],
      icon: <UserCheck className="w-8 h-8" />
    },
    {
      title: "පාඨමාලා සහ විෂය නිර්දේශ කළමනාකරණය",
      description: "විෂය නිර්දේශ සැලසුම් කිරීම සහ සම්පත් වෙන් කිරීම සමඟ සම්පූර්ණ පාඨමාලා පරිපාලනය.",
      features: ["පාඨමාලා නිර්මාණය", "විෂය නිර්දේශ සැලසුම්", "සම්පත් කළමනාකරණය", "ඇගයීමේ මෙවලම්"],
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: "පරිපාලන පාලන පුවරුව",
      description: "පද්ධති කළමනාකරණය සහ අධීක්ෂණය සඳහා බලගතු පරිපාලන මෙවලම්.",
      features: ["පරිශීලක කළමනාකරණය", "පද්ධති සැකසුම්", "වාර්තා ජනනය", "ඕඩිට් මාර්ග"],
      icon: <Settings className="w-8 h-8" />
    }
  ];

  const courses: CourseItem[] = [
    {
      id: 1,
      title: "පරිගණක විද්‍යා මූලික කරුණු",
      description: "පරිගණක විද්‍යාවේ මූලික සංකල්ප සහ ක්‍රමලේඛනය ඉගෙන ගන්න",
      duration: "6 මාස",
      level: "ආරම්භක",
      image: "/course1j.jpg"
    },
    {
      id: 2,
      title: "ව්‍යාපාර කළමනාකරණය",
      description: "ව්‍යාපාරික අධ්‍යයනයන් සහ කළමනාකරණ කුසලතා",
      duration: "8 මාස",
      level: "මධ්‍යම",
      image: "/course2j.jpg"
    },
    {
      id: 3,
      title: "ඉංග්‍රීසි භාෂා කුසලතා",
      description: "ඉංග්‍රීසි කථන සහ ලේඛන කුසලතා වර්ධනය",
      duration: "4 මාස",
      level: "සියලු මට්ටම්",
      image: "/course3j.jpg"
    },
    {
      id: 4,
      title: "ගණිත සහ විද්‍යාව",
      description: "උසස් ගණිත සහ විද්‍යාව පාඨමාලා",
      duration: "10 මාස",
      level: "උසස්",
      image: "/course4j.jpg"
    },
    {
      id: 5,
      title: "කලා සහ සංස්කෘතිය",
      description: "ශ්‍රී ලංකාවේ කලා සහ සංස්කෘතික උරුමය",
      duration: "5 මාස",
      level: "ආරම්භක",
      image: "/course5j.jpg"
    }
  ];

  const heroSlides = [
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
  ];

  const nextCourseSlide = () => {
    setCurrentCourseSlide((prev) => (prev + 1) % courses.length);
  };

  const prevCourseSlide = () => {
    setCurrentCourseSlide((prev) => (prev - 1 + courses.length) % courses.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
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

        {/* Courses Section */}
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
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentCourseSlide * 100}%)` }}>
                  {courses.map((course, index) => (
                    <div key={course.id} className="w-full flex-shrink-0">
                      <Card className="backdrop-blur-xl bg-white/40 border border-white/30 hover:bg-white/50 transition-all duration-300 mx-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-blue-600 text-white">
                                {course.level}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center space-y-6">
                            <div>
                              <h3 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h3>
                              <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-700">කාලසීමාව: {course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-700">මට්ටම: {course.level}</span>
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                                <BookOpen className="w-4 h-4 mr-2" />
                                වැඩි විස්තර
                              </Button>
                              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                                <Play className="w-4 h-4 mr-2" />
                                පෙරදසුන
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextCourseSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
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
                බලවත් විශේෂාංග
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                අධ්‍යාපන පරිපාලනය විධිමත් කිරීමට සහ ඉගෙනුම් අත්දැකීම් වැඩිදියුණු කිරීමට නිර්මාණය කරන ලද උසස් හැකියාවන්
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
                අපගේ සේවා
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                නවීන අධ්‍යාපන පරිපාලනය සඳහා සම්පූර්ණ විසඳුම්
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
                      වැඩි විස්තර
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
                ප්‍රවේශ මට්ටම්
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                අධ්‍යාපන පද්ධතිය තුළ විවිධ පරිශීලක භූමිකාවන් සඳහා අභිරුචි කරන ලද අත්දැකීම්
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white mb-4 mx-auto">
                    <Shield className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-red-700">පරිපාලක පාලනය</CardTitle>
                  <CardDescription>සම්පූර්ණ පද්ධති පරිපාලනය</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">සම්පූර්ණ පද්ධති ප්‍රවේශය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">පරිශීලක කළමනාකරණය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">පද්ධති වින්‍යාසය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">උසස් වාර්තාකරණය</span>
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                      පරිපාලක ප්‍රවේශය
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700">අධ්‍යක්ෂ මෙවලම්</CardTitle>
                  <CardDescription>ආයතනික කළමනාකරණය</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">පාඨමාලා කළමනාකරණය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ශිෂ්‍ය ලියාපදිංචි කිරීම</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ප්‍රගති නිරීක්ෂණය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">සම්පත් වෙන් කිරීම</span>
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                      අධ්‍යක්ෂ ප්‍රවේශය
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4 mx-auto">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-700">පරිශීලක දසුන</CardTitle>
                  <CardDescription>ශිෂ්‍ය සහ මහජන ප්‍රවේශය</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">පාඨමාලා බැලීම</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ශිෂ්‍ය පැතිකඩ බැලීම</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">සම්පත් වලට ප්‍රවේශය</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ප්‍රගති ලුහුබැඳීම</span>
                    </div>
                  </div>
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      දැන් ලියාපදිංචි වන්න
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
                  රජයේ මුලපිරීම
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  මෙම ශිෂ්‍ය කළමනාකරණ පද්ධතිය ශ්‍රී ලංකා අධ්‍යාපන අමාත්‍යාංශයේ නිල මුලපිරීමකි. සියලුම රජයේ ආයතන හරහා අධ්‍යාපන පරිපාලනය ඩිජිටල්කරණය කිරීම සහ විධිමත් කිරීම සඳහා නිර්මාණය කර ඇත. නව්‍ය තාක්ෂණික විසඳුම් හරහා ගුණාත්මක අධ්‍යාපනයට සාධාරණ ප්‍රවේශය ලබා දීම අපගේ මූලික ඉලක්කයයි.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">ඩිජිටල් ශ්‍රී ලංකා මුලපිරීම</h4>
                      <p className="text-gray-600">ජාතික ඩිජිටල්කරණ වැඩසටහනේ කොටසකි</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">සියලු දෙනා සඳහා ගුණාත්මක අධ්‍යාපනය</h4>
                      <p className="text-gray-600">අධ්‍යාපන සම්පත් වලට ඇතුළත් ප්‍රවේශය සහතික කිරීම</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">තිරසාර සංවර්ධන ඉලක්ක</h4>
                      <p className="text-gray-600">UN SDG 4 සමඟ සමපාත: ගුණාත්මක අධ්‍යාපනය</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="backdrop-blur-xl bg-white/40 border border-white/30 p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold text-lg">අධ්‍යාපන අමාත්‍යාංශය</h3>
                        <p className="text-gray-600">ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">ඉසුරුපාය, බත්තරමුල්ල, ශ්‍රී ලංකාව</span>
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
                    ආරම්භ කිරීමට සූදානම්ද?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    දැනටමත් අපගේ වේදිකාව භාවිතා කරමින් ඔවුන්ගේ අධ්‍යාපනික ගමන වැඩිදියුණු කරන ගන්නා දහස් ගණන් ශිෂ්‍යයන්, අධ්‍යාපකයන් සහ ආයතන වලට එක්වන්න.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-primary text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <UserCheck className="w-6 h-6 mr-2" />
                      ගිණුමක් සාදන්න
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="backdrop-blur-xl bg-white/30 border px-8 py-6 text-lg rounded-xl shadow-lg">
                      <Shield className="w-6 h-6 mr-2" />
                      පුරනය වන්න
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