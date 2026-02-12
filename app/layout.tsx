// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CTATracker } from '@/components/CTATracker';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { OrganizationSchema, ProductSchema, WebsiteSchema } from '@/components/StructuredData';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://prbuild.ai'),
  title: {
    default: 'PRBuild - Professional Press Releases That Get Coverage',
    template: '%s | PRBuild'
  },
  description: 'AI-powered press release writing with human quality control. 16 journalist personas review every release. 23% pickup rate. First release free.',
  keywords: [
    'press release service',
    'PR distribution',
    'press release writing',
    'media coverage',
    'PR newswire alternative',
    'affordable press release',
    'AI press release',
    'journalist outreach'
  ],
  authors: [{ name: 'PRBuild' }],
  creator: 'PRBuild',
  publisher: 'PRBuild',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prbuild.ai',
    siteName: 'PRBuild',
    title: 'PRBuild - Professional Press Releases That Get Coverage',
    description: 'AI-powered press release writing with human quality control. 16 journalist personas review every release. First release free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PRBuild - Professional Press Releases'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'PRBuild - Professional Press Releases That Get Coverage',
    description: 'AI-powered press release writing with human quality control. First release free.',
    images: ['/og-image.png'],
  },
  
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  manifest: '/site.webmanifest',
  
  alternates: {
    canonical: 'https://prbuild.ai',
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  },

  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `(function(){document.documentElement.classList.remove('dark');})();`;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gaScript = gaId ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId.replace(/'/g, "\\'")}');` : '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: gaScript }} />
          </>
        )}
        <OrganizationSchema />
        <ProductSchema />
        <WebsiteSchema />
      </head>
      <body className="font-sans bg-background text-foreground antialiased" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <ThemeProvider>
          <CTATracker />
          <AnalyticsProvider />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50"
          >
            Skip to main content
          </a>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
