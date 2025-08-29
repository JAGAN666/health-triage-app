import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HealthDataProvider } from "@/contexts/HealthDataContext";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import SessionProvider from "@/components/providers/SessionProvider";
// import ServiceWorkerManager from "@/components/common/ServiceWorkerManager"; // DISABLED
import ClientOnlyScripts from "@/components/common/ClientOnlyScripts";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "HealthTriage AI - Professional Healthcare Platform",
  description: "AI-powered health triage, telehealth consultations, emergency detection, and health analytics. HIPAA compliant, WCAG accessible healthcare technology platform.",
  keywords: [
    "health triage", "AI healthcare", "telehealth", "telemedicine", 
    "emergency detection", "health analytics", "symptom checker", 
    "healthcare platform", "medical AI", "health assessment"
  ],
  authors: [{ name: "HealthTriage AI Team" }],
  creator: "HealthTriage AI",
  publisher: "HealthTriage AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'healthcare',
  openGraph: {
    title: "HealthTriage AI - Professional Healthcare Platform",
    description: "AI-powered health triage, telehealth consultations, emergency detection, and health analytics. HIPAA compliant healthcare technology.",
    url: '/',
    siteName: 'HealthTriage AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HealthTriage AI - Professional Healthcare Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HealthTriage AI - Professional Healthcare Platform",
    description: "AI-powered health triage, telehealth consultations, emergency detection, and health analytics.",
    images: ['/og-image.png'],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'HealthTriage AI',
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, geistMono.variable)}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Healthcare compliance indicators */}
        <meta name="hipaa-compliant" content="true" />
        <meta name="healthcare-category" content="health triage, telemedicine, emergency detection" />
        <meta name="accessibility-standard" content="WCAG 2.1 AAA" />
        
        {/* Structured data for healthcare organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalOrganization',
              name: 'HealthTriage AI',
              description: 'AI-powered healthcare platform providing health triage, telehealth consultations, emergency detection, and health analytics.',
              url: 'https://healthtriage.ai',
              logo: 'https://healthtriage.ai/favicon.svg',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-800-HEALTH',
                contactType: 'customer service',
                availableLanguage: ['English', 'Spanish', 'French'],
                hoursAvailable: '24/7'
              },
              medicalSpecialty: [
                'Health Triage',
                'Telemedicine', 
                'Emergency Medicine',
                'Preventive Care',
                'Health Analytics'
              ],
              areaServed: 'Global',
              hasCredential: [
                {
                  '@type': 'EducationalOccupationalCredential',
                  credentialCategory: 'HIPAA Compliance'
                },
                {
                  '@type': 'EducationalOccupationalCredential', 
                  credentialCategory: 'WCAG AAA Accessibility'
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-inter antialiased",
          "selection:bg-blue-200 selection:text-blue-900",
          "focus-within:scroll-smooth"
        )}
        style={{
          colorScheme: 'light',
          scrollBehavior: 'smooth',
        }}
        suppressHydrationWarning
      >
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-all duration-200"
        >
          Skip to main content
        </a>
        
        {/* Live region for dynamic announcements */}
        <div
          id="announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
        
        {/* Emergency announcements */}
        <div
          id="emergency-announcements"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        />
        
        <SessionProvider>
          <DemoAuthProvider>
            <HealthDataProvider>
              <LanguageProvider>
                <div id="app-root" className="relative">
                <main id="main-content" role="main" className="relative">
                  {children}
                </main>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '16px',
                    },
                  }}
                />
                {/* ServiceWorkerManager - DISABLED per user request to remove PWA/app install popups */}
                {/* <ServiceWorkerManager 
                  enableOfflineSupport={true}
                  enableUpdatePrompts={true}
                  enableInstallPrompt={true}
                /> */}
                <ClientOnlyScripts />
                </div>
              </LanguageProvider>
            </HealthDataProvider>
          </DemoAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
