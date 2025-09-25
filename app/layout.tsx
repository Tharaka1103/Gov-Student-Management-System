import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sri Lanka Institute of Local Governance",
    template: "%s | SILG"
  },
  description: "Official digital platform for the Sri Lanka Institute of Local Governance. Empowering education through innovative technology solutions, managing students, directors, and educational programs across Sri Lanka.",
  keywords: [
    "Sri Lanka Institute of Local Governance",
    "SILG",
    "Education Management",
    "Student Management System",
    "Government Education",
    "Digital Learning Platform",
    "Educational Technology",
    "Sri Lanka Education",
    "Local Governance",
    "Ministry of Education"
  ],
  authors: [
    {
      name: "Ministry of Education, Sri Lanka",
      url: "https://www.moe.gov.lk"
    }
  ],
  creator: "Ministry of Education, Sri Lanka",
  publisher: "Sri Lanka Institute of Local Governance",
  applicationName: "SILG Management System",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "/",
    title: "Sri Lanka Institute of Local Governance",
    description: "Official digital platform for educational management and student services in Sri Lanka.",
    siteName: "SILG",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Institute of Local Governance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Institute of Local Governance",
    description: "Official digital platform for educational management and student services in Sri Lanka.",
    images: ["/og-image.jpg"],
    creator: "@MoESriLanka",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  category: "education",
  classification: "Government Educational Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Government/Security Headers */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Additional SEO and Social Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SILG" />
        
        {/* Government Website Identification */}
        <meta name="government" content="true" />
        <meta name="country" content="LK" />
        <meta name="geo.region" content="LK" />
        <meta name="geo.placename" content="Sri Lanka" />
        
        {/* Structured Data for Government Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Sri Lanka Institute of Local Governance",
              "alternateName": "SILG",
              "url": process.env.NEXTAUTH_URL || "http://localhost:3000",
              "logo": "/logo.png",
              "description": "Official digital platform for the Sri Lanka Institute of Local Governance",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ministry of Education, Isurupaya",
                "addressLocality": "Battaramulla",
                "addressCountry": "LK"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+94-11-2785141",
                "contactType": "customer service",
                "email": "info@moe.gov.lk"
              },
              "sameAs": [
                "https://www.moe.gov.lk"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900`}
        suppressHydrationWarning
      >
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          
          {/* Main Application Content */}
          <div id="main-content" className="min-h-screen">
            {children}
          </div>
          
          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            expand={false}
            richColors
            closeButton
          />
          
          {/* Loading Indicator for Better UX */}
          <div id="loading-indicator" className="hidden">
  <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-red-900/30 to-red-900/20 backdrop-blur-lg z-50 flex items-center justify-center p-4">
    <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-yellow-200 p-6 sm:p-8 md:p-10 max-w-md w-full mx-4 overflow-hidden">
      
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-200/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -right-8 w-12 h-12 bg-red-900/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 sm:space-y-8">
        
        {/* Enhanced Spinner */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          {/* Outer Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin"></div>
          {/* Middle Circle */}
          <div className="absolute inset-3 rounded-full border-4 border-yellow-400 border-t-transparent border-r-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          {/* Inner Circle */}
          <div className="absolute inset-6 rounded-full border-2 border-red-900 border-b-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
          {/* Center Element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-900 to-red-700 rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>

        {/* Loading Text with Animation */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent animate-pulse">
              Loading
            </h3>
            {/* Underline Animation */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 animate-pulse rounded-full"
                 style={{ 
                   animation: 'expandWidth 2s ease-in-out infinite',
                   width: '60%'
                 }}>
            </div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium animate-pulse">
            Please wait while we process your request...
          </p>
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="space-y-4">
          {/* Bouncing Dots */}
          <div className="flex justify-center space-x-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-yellow-200/50 rounded-full h-2 sm:h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Optional Message */}
        <div className="text-xs sm:text-sm text-gray-500 font-medium animate-pulse">
          🔄 This may take a few moments
        </div>
      </div>
    </div>
  </div>
</div>
        
        {/* Performance and Analytics Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics or other analytics can be added here */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  );
}