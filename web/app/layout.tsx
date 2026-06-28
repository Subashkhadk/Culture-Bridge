'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { TranslationProvider } from '@/lib/context/TranslationContext';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import BottomNav from '@/app/components/BottomNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </head>
      <body className={`${inter.variable} antialiased bg-surface text-on-surface font-body-md flex flex-col pb-16 md:pb-0`}>
        <ThemeProvider>
          <AuthProvider>
            <TranslationProvider>
              <LanguageProvider>
                {children}
                <BottomNav />
              </LanguageProvider>
            </TranslationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
