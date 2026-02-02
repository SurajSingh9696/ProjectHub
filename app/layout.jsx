import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'ProjectHub - Modern Project Management',
  description: 'Streamline your workflow with our powerful project management platform',
  icons: {
    icon: '/logo/logo.svg',
    shortcut: '/logo/logo.svg',
    apple: '/logo/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${poppins.variable} antialiased bg-charcoal-900`}>
        <ThemeProvider />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
