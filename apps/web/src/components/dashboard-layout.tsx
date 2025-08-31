'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from './protected-route';

const navigation = [
  {
    name: 'Обзор',
    href: '/dashboard',
    icon: '📊',
  },
  {
    name: 'Мои курсы',
    href: '/dashboard/courses',
    icon: '📚',
  },
  {
    name: 'Обучение',
    href: '/learn',
    icon: '🎓',
    activePattern: '/learn',
  },
  {
    name: 'Настройки',
    href: '/settings',
    icon: '⚙️',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // TODO: Implement proper error handling for logout
      // Logout error handling
    }
  };

  const isActiveLink = (item: any) => {
    if (item.activePattern) {
      return pathname.startsWith(item.activePattern);
    }
    return pathname === item.href;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light-bg">
        {/* Header */}
        <header className="bg-white shadow-card border-b border-border-light sticky top-0 z-40">
          <div className="max-w-1160 mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href="/dashboard"
                className="text-24 font-bold text-text-primary no-underline"
              >
                Projectdes AI
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 no-underline
                      ${
                        isActiveLink(item)
                          ? 'bg-primary-yellow text-text-primary font-semibold'
                          : 'text-text-gray hover:text-text-primary hover:bg-light-bg'
                      }
                    `}
                  >
                    <span className="text-16">{item.icon}</span>
                    <span className="text-16">{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-yellow flex items-center justify-center">
                    <span className="text-14 font-bold text-text-primary">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-16 text-text-primary font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-text-gray hover:text-error transition-colors duration-200 text-16"
                  title="Выход"
                >
                  🚪
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 text-text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Открыть меню"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-border-light">
              <nav className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 no-underline
                      ${
                        isActiveLink(item)
                          ? 'bg-primary-yellow text-text-primary font-semibold'
                          : 'text-text-gray hover:bg-light-bg'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-18">{item.icon}</span>
                    <span className="text-16">{item.name}</span>
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-border-light">
                  <div className="flex items-center gap-3 px-3 py-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-yellow flex items-center justify-center">
                      <span className="text-16 font-bold text-text-primary">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-16 font-medium text-text-primary">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-14 text-text-gray">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-error hover:bg-light-bg transition-colors duration-200 w-full text-left"
                  >
                    <span className="text-18">🚪</span>
                    <span className="text-16">Выход</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-1160 mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
