import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider';
import { ThemeProvider } from '@/components/theme/themeProvider';
import { Toaster } from '@/components/ui/toaster';
import { SchoolProvider } from '@/lib/provider/schoolContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eduflow',
  description: 'Inflowsol Pvt. Ltd.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SchoolProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </ReactQueryProvider>
        </SchoolProvider>
      </body>
    </html>
  );
}
