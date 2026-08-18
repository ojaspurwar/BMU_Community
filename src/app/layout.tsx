import type { Metadata } from 'next';
import './globals.css';
import { CampusPulseProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'CampusPulse • BML Munjal University Operating System',
  description:
    'A unified real-time campus OS for student events, peer skill & gear trading, live study spot radar, and verified campus announcements at BMU.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070b12] text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        <CampusPulseProvider>{children}</CampusPulseProvider>
      </body>
    </html>
  );
}
