import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin,
  Building2,
  ExternalLink,
  Heart
} from 'lucide-react';

export default function Footer() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo and Description */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-7 h-7 text-red-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold">SILG</h3>
                <p className="text-sm text-red-100">Sri Lanka Institute of Local Governance</p>
              </div>
            </div>
            <p className="text-sm text-red-100 leading-relaxed">
              Empowering local governance through innovative training programs and capacity building solutions. 
              Building stronger communities across Sri Lanka.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-red-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-red-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-red-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-red-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-red-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-red-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-red-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-red-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h4 className="text-lg font-semibold text-yellow-300">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Local Institutions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h4 className="text-lg font-semibold text-yellow-300">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/municipal-training" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Municipal Administration
                </Link>
              </li>
              <li>
                <Link href="/governance-programs" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Governance Programs
                </Link>
              </li>
              <li>
                <Link href="/certification" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Digital Certification
                </Link>
              </li>
              <li>
                <Link href="/capacity-building" className="text-red-100 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                  Capacity Building
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h4 className="text-lg font-semibold text-yellow-300">Contact Info</h4>
            <div className="space-y-4">
              <motion.div 
                className="flex items-start space-x-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-100 leading-relaxed">
                    Ministry of Public Administration<br />
                    & Management<br />
                    Colombo, Sri Lanka
                  </p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <p className="text-sm text-red-100">+94 11 2785 141</p>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <p className="text-sm text-red-100">info@silg.gov.lk</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-red-950 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-red-100">
              © {new Date().getFullYear()} Sri Lanka Institute of Local Governance. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link href="/privacy" className="text-sm text-red-100 hover:text-white transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-red-100 hover:text-white transition-colors hover:underline">
                Terms of Service
              </Link>
              <Link href="/support" className="text-sm text-red-100 hover:text-white transition-colors hover:underline">
                Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}