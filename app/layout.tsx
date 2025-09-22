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
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-700 font-medium">Loading...</span>
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