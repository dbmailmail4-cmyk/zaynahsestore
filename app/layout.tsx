import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

import { getSettings } from '@/lib/services/settings';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    const title = settings.storeName || "Zaynahs E-Store";
    const description = settings.tagline || "Modern Pakistani E-Commerce — Premium Mobile Shop";
    const fav = settings.faviconUrl || settings.logoUrl || "/favicon.ico";
    return {
      title: title,
      description: description,
      manifest: "/manifest.json",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: title,
      },
      icons: {
        icon: fav,
        shortcut: fav,
        apple: settings.logoUrl || fav,
      }
    };
  } catch (err) {
    return {
      title: "Zaynahs E-Store",
      description: "Modern Pakistani E-Commerce — Premium Mobile Shop",
      manifest: "/manifest.json",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Zaynahs E-Store",
      },
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${outfit.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className={`${jakarta.variable} ${outfit.variable} font-body min-h-full flex flex-col bg-gray-50 dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100 overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
          
          {/* Register Service Worker */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      console.log('SW registered:', reg);
                    }).catch(function(err) {
                      console.log('SW registration failed:', err);
                    });
                  });
                }
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
