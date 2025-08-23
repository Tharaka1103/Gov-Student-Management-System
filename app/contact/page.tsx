'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Globe,
  Users,
  Award,
  Target,
  Zap,
  Star,
  ChevronDown,
  ExternalLink,
  Calendar,
  Building
} from 'lucide-react';

// TypeScript interfaces
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactMethod {
  icon: React.ReactNode;
  title: string;
  description: string;
  contact: string;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Properly typed submit status
type SubmitStatus = 'success' | 'error' | null;

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null); // Fixed typing
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setForm({ name: '', email: '', message: '' });
        setSubmitStatus('success');
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus(null);
    }
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      description: 'Send us an email anytime',
      contact: 'info@moe.gov.lk',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      description: 'Call us during business hours',
      contact: '+94 11 2785 141',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Office',
      description: 'Visit us at our headquarters',
      contact: 'Isurupaya, Battaramulla, Sri Lanka',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Website',
      description: 'Visit our official website',
      contact: 'www.moe.gov.lk',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We aim to respond to all inquiries within 24-48 hours during business days. For urgent educational matters, please call us directly during office hours."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please provide your full name, contact details, the nature of your inquiry, and any relevant background information. If you're inquiring about a specific educational program or service, please mention it clearly."
    },
    {
      question: "Do you offer support outside business hours?",
      answer: "While our office hours are Monday to Friday, 8:30 AM to 4:15 PM, you can send us a message anytime through this form. We'll respond during our next business day."
    },
    {
      question: "Can I schedule a meeting or consultation?",
      answer: "Yes! Please mention your preferred meeting times and the purpose of your visit in your message. We'll coordinate with you to schedule an appropriate time for your consultation."
    },
    {
      question: "What services does the Ministry of Education provide?",
      answer: "We provide comprehensive educational services including curriculum development, teacher training, student affairs, educational policy implementation, and support for educational institutions across Sri Lanka."
    },
    {
      question: "How can I access educational resources and programs?",
      answer: "Information about educational programs, resources, and application procedures can be found on our official website. You can also contact us directly for specific guidance on available opportunities."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-200 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Government Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/30 border border-white/20">
                <div className="w-6 h-4 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-sm"></div>
                <span className="text-sm font-medium">Ministry of Education - Sri Lanka</span>
                <Badge className="bg-blue-600 text-white">Official</Badge>
              </div>
            </div>

            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're here to help with your educational needs. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Contact Form */}
              <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl">
                <CardHeader className="text-center pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4 mx-auto">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
                  <CardDescription className="text-lg">
                    Fill out the form below and we'll get back to you within 24-48 hours.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="text-green-800 font-medium">Message sent successfully!</p>
                          <p className="text-green-700 text-sm">We'll get back to you within 24-48 hours.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        <div>
                          <p className="text-red-800 font-medium">Something went wrong!</p>
                          <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={submit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="h-12 bg-white/50 border-white/20 backdrop-blur-sm focus:bg-white/70 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="Enter your email"
                          value={form.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-12 bg-white/50 border-white/20 backdrop-blur-sm focus:bg-white/70 transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-white/50 border-white/20 backdrop-blur-sm focus:bg-white/70 transition-all duration-300 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Contact Methods */}
                <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-6 h-6 text-blue-600" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Multiple ways to reach the Ministry of Education
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/40 transition-all duration-300 group hover:scale-[1.02]"
                      >
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {method.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {method.description}
                          </p>
                          <p className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            {method.contact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                      <Clock className="w-6 h-6" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-white">
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span>Monday - Friday</span>
                        <span className="font-semibold">8:30 AM - 4:15 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span>Saturday</span>
                        <span className="font-semibold">Closed</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span>Sunday & Public Holidays</span>
                        <span className="font-semibold">Closed</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed">
                        We typically respond to all inquiries within 24-48 hours during business days. 
                        For urgent educational matters, please call us directly.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">25,000+</div>
                      <div className="text-sm text-gray-600">Students Served</div>
                    </CardContent>
                  </Card>
                  <Card className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">480+</div>
                      <div className="text-sm text-gray-600">Institutions</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions you might have.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-300">
                  <CardContent className="p-0">
                    <button
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/20 transition-colors duration-200"
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    >
                      <h3 className="font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top duration-200">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Visit Our Office
              </h2>
              <p className="text-xl text-gray-600">
                Find us at the heart of Sri Lanka's educational administration.
              </p>
            </div>
            
            <Card className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Map Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-96 md:h-auto flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ministry of Education
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Isurupaya, Battaramulla<br />
                      Sri Lanka
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>

                {/* Office Information */}
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Office Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Address</h4>
                          <p className="text-gray-600">Isurupaya, Battaramulla, Sri Lanka</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone</h4>
                          <p className="text-gray-600">+94 11 2785 141</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <p className="text-gray-600">info@moe.gov.lk</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                          <Globe className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Website</h4>
                          <p className="text-gray-600">www.moe.gov.lk</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Transportation</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Easily accessible by public transport. Bus routes 138, 177, and 240 stop nearby. 
                      Parking is available on-site for visitors.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}