import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from './components/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '아크릴 견적 시스템',
  description: '아크릴 박스 및 판재 견적 계산기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-white dark:bg-gray-800">
          <NavBar />
          <main className="container mx-auto mt-8 px-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
