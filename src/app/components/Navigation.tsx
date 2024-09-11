'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="bg-gray-100 dark:bg-gray-700 p-4">
      <nav className="container mx-auto flex justify-start space-x-4">
        <Link
          href="/"
          className={`px-3 py-2 rounded-md ${
            pathname === '/'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 dark:text-gray-200'
          }`}
        >
          박스 견적
        </Link>
        <Link
          href="/panel"
          className={`px-3 py-2 rounded-md ${
            pathname === '/panel'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 dark:text-gray-200'
          }`}
        >
          판재 계산
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
