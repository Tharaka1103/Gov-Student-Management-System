'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Building2,
    Users,
    Send,
    CheckCircle,
    Globe,
    Calendar,
    MessageSquare,
    ArrowRight,
    Navigation,
    Car,
    Bus,
    Plane,
    FileAxis3D
} from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                organization: '',
                subject: '',
                message: ''
            });
        }, 2000);
    };

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

    const contactMethods = [
        {
            icon: <Phone className="w-8 h-8" />,
            title: "Phone",
            primary: "+94 11 2785 141",
            secondary: "+94 11 2785 142",
            description: "Monday to Friday, 8:30 AM - 4:30 PM",
            color: "bg-green-100 text-green-700"
        },
        {
            icon: <Mail className="w-8 h-8" />,
            title: "Email",
            primary: "info@silg.gov.lk",
            secondary: "training@silg.gov.lk",
            description: "We'll respond within 24 hours",
            color: "bg-blue-100 text-blue-700"
        },
        {
            icon: <FileAxis3D className="w-8 h-8" />,
            title: "Fax",
            primary: "+94 11 2785 143",
            secondary: "",
            description: "For official correspondence",
            color: "bg-purple-100 text-purple-700"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Website",
            primary: "www.silg.gov.lk",
            secondary: "",
            description: "Online resources and information",
            color: "bg-orange-100 text-orange-700"
        }
    ];

    const departments = [
        {
            name: "Training & Development",
            head: "Dr. Kumari Perera",
            phone: "+94 11 2785 144",
            email: "training@silg.gov.lk",
            description: "Course enrollment, curriculum, certification"
        },
        {
            name: "Research & Policy",
            head: "Mr. Rajesh Fernando",
            phone: "+94 11 2785 145",
            email: "research@silg.gov.lk",
            description: "Policy development, research initiatives"
        },
        {
            name: "Administration",
            head: "Ms. Nilmini Silva",
            phone: "+94 11 2785 146",
            email: "admin@silg.gov.lk",
            description: "General inquiries, administrative support"
        },
        {
            name: "Finance & Accounts",
            head: "Mr. Pradeep Wickrama",
            phone: "+94 11 2785 147",
            email: "finance@silg.gov.lk",
            description: "Fee payments, financial inquiries"
        }
    ];

    const officeHours = [
        { day: "Monday - Friday", time: "8:30 AM - 4:30 PM", status: "Open" },
        { day: "Saturday", time: "9:00 AM - 12:00 PM", status: "Limited Service" },
        { day: "Sunday & Holidays", time: "Closed", status: "Closed" }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />
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
                                Get in Touch • We're Here to Help
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold leading-tight"
                            variants={itemVariants}
                        >
                            Contact Us
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-red-100"
                            variants={itemVariants}
                        >
                            Have questions about our training programs or need assistance?
                            Our dedicated team is ready to support your local governance journey.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Contact Methods */}
            <motion.section
                className="py-20 bg-yellow-50"
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
                        <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">Get in Touch</h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            Multiple ways to reach us for your convenience
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <Card className="h-full bg-white border-2 border-yellow-200 hover:border-red-200 hover:shadow-xl transition-all duration-500">
                                    <CardHeader className="text-center">
                                        <div className={`w-16 h-16 ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                            {method.icon}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-red-900">
                                            {method.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center space-y-2">
                                        <p className="font-semibold text-gray-900">{method.primary}</p>
                                        {method.secondary && (
                                            <p className="font-medium text-gray-700">{method.secondary}</p>
                                        )}
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Main Contact Section */}
            <motion.section
                className="py-20 bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Card className="bg-gray-50 border-2 border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-red-900">Send us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you within 24 hours
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isSubmitted ? (
                                        <motion.div
                                            className="text-center py-8"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-green-600 mb-2">Message Sent Successfully!</h3>
                                            <p className="text-gray-600">Thank you for contacting us. We'll respond soon.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name *</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="border-2 border-gray-300 focus:border-red-400"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="border-2 border-gray-300 focus:border-red-400"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="border-2 border-gray-300 focus:border-red-400"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="organization">Organization</Label>
                                                    <Input
                                                        id="organization"
                                                        name="organization"
                                                        value={formData.organization}
                                                        onChange={handleInputChange}
                                                        className="border-2 border-gray-300 focus:border-red-400"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject *</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="border-2 border-gray-300 focus:border-red-400"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message *</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={6}
                                                    className="border-2 border-gray-300 focus:border-red-400"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-red-900 hover:bg-red-800 text-white py-3 text-lg rounded-xl"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Office Location */}
                            <Card className="bg-red-50 border-2 border-red-200">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-red-900 flex items-center">
                                        <MapPin className="w-6 h-6 mr-2" />
                                        Our Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-red-900 mb-2">Sri Lanka Institute of Local Governance</h4>
                                        <p className="text-gray-700">
                                            No. 358, T.B. Jayah Mawatha,<br />
                                            Colombo 10,<br />
                                            Sri Lanka
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Navigation className="w-4 h-4" />
                                        <span>Located near Ministry of Public Administration</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Office Hours */}
                            <Card className="bg-yellow-50 border-2 border-yellow-200">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-red-900 flex items-center">
                                        <Clock className="w-6 h-6 mr-2" />
                                        Office Hours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {officeHours.map((schedule, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-yellow-200 last:border-b-0">
                                                <div>
                                                    <p className="font-medium text-gray-900">{schedule.day}</p>
                                                    <p className="text-sm text-gray-600">{schedule.time}</p>
                                                </div>
                                                <Badge className={`${schedule.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                        schedule.status === 'Limited Service' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {schedule.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Departments */}
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
                        <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">Department Contacts</h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            Reach out to specific departments for specialized assistance
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {departments.map((dept, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <Card className="h-full bg-white border-2 border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-500">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Building2 className="w-6 h-6 text-red-900" />
                                            <CardTitle className="text-xl font-bold text-red-900">
                                                {dept.name}
                                            </CardTitle>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{dept.head}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-gray-600">{dept.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium">{dept.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium">{dept.email}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Emergency Contact */}
            <motion.section
                className="py-20 bg-red-900 text-white"
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
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Need Urgent Assistance?
                        </h2>
                        <p className="text-xl text-red-100 mb-8 leading-relaxed">
                            For urgent training-related matters or emergency support, contact our dedicated helpline
                        </p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                                <div className="text-center">
                                    <Phone className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
                                    <p className="text-lg font-semibold">Emergency Hotline</p>
                                    <p className="text-2xl font-bold text-yellow-300">+94 70 123 4567</p>
                                    <p className="text-sm text-red-100">Available 24/7</p>
                                </div>
                                <div className="text-center">
                                    <MessageSquare className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
                                    <p className="text-lg font-semibold">WhatsApp Support</p>
                                    <p className="text-2xl font-bold text-yellow-300">+94 71 987 6543</p>
                                    <p className="text-sm text-red-100">Quick responses</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
            <Footer />
        </div>
    );
}