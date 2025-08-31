'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User,
  LogIn,
  BookOpen,
  Info,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: 'Программы',
    href: '/programs',
    icon: GraduationCap,
    children: [
      { label: 'AI Transformation Manager', href: '/programs/ai-manager' },
      { label: 'No-Code Development', href: '/programs/no-code' },
      { label: 'AI Video Generation', href: '/programs/ai-video' },
      { label: 'Все курсы', href: '/programs' },
    ],
  },
  { label: 'О нас', href: '/about', icon: Info },
  { label: 'Контакты', href: '/contact', icon: Phone },
];

export interface HeaderProps {
  variant?: 'transparent' | 'opaque';
  className?: string;
}

export function Header({ variant = 'transparent', className }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const isActive = (href: string) => pathname === href;

  const headerClass = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    variant === 'transparent' && !isScrolled
      ? 'bg-transparent'
      : 'bg-white dark:bg-dark-header shadow-sm backdrop-blur-lg',
    className
  );

  return (
    <header className={headerClass}>
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="w-10 h-10 bg-primary-yellow rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-dark-pure" />
            </div>
            <span className={cn(
              'hidden sm:inline',
              variant === 'transparent' && !isScrolled
                ? 'text-white'
                : 'text-text-primary dark:text-white'
            )}>
              Projectdes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden lg:flex">
            <NavigationMenu.List className="flex items-center gap-8">
              {navigation.map((item) => (
                <NavigationMenu.Item key={item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenu.Trigger
                        className={cn(
                          'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                          'hover:bg-surface-light/10',
                          variant === 'transparent' && !isScrolled
                            ? 'text-white hover:text-primary-yellow'
                            : 'text-text-primary hover:text-primary-yellow dark:text-white'
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute top-full left-0 mt-2">
                        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-xl border border-border-light p-2 min-w-[200px]">
                          {item.children.map((child) => (
                            <NavigationMenu.Link key={child.label} asChild>
                              <Link
                                href={child.href!}
                                className={cn(
                                  'block px-4 py-2 text-sm rounded-md transition-colors',
                                  'hover:bg-surface-light hover:text-primary-yellow',
                                  isActive(child.href!) && 'bg-primary-yellow/10 text-primary-yellow'
                                )}
                              >
                                {child.label}
                              </Link>
                            </NavigationMenu.Link>
                          ))}
                        </div>
                      </NavigationMenu.Content>
                    </>
                  ) : (
                    <NavigationMenu.Link asChild>
                      <Link
                        href={item.href!}
                        className={cn(
                          'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                          'hover:bg-surface-light/10',
                          variant === 'transparent' && !isScrolled
                            ? 'text-white hover:text-primary-yellow'
                            : 'text-text-primary hover:text-primary-yellow dark:text-white',
                          isActive(item.href!) && 'text-primary-yellow'
                        )}
                      >
                        <span className="flex items-center gap-1">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          {item.label}
                        </span>
                      </Link>
                    </NavigationMenu.Link>
                  )}
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher variant="minimal" className="hidden md:flex" />
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="md"
                  asChild
                >
                  <Link href="/dashboard" className="inline-flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Кабинет
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="md"
                  asChild
                >
                  <Link href="/auth/login" className="inline-flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  asChild
                >
                  <Link href="/auth/register">
                    Регистрация
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-light/10 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 md:top-20 bg-white dark:bg-dark-header z-40">
          <nav className="container-custom py-4 space-y-4 h-full overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 text-base font-medium cursor-pointer hover:bg-surface-light rounded-lg">
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.label}
                      </div>
                      <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 ml-7 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href!}
                          className={cn(
                            'block px-4 py-2 text-sm rounded-lg transition-colors',
                            'hover:bg-surface-light hover:text-primary-yellow',
                            isActive(child.href!) && 'bg-primary-yellow/10 text-primary-yellow'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg transition-colors',
                      'hover:bg-surface-light hover:text-primary-yellow',
                      isActive(item.href!) && 'bg-primary-yellow/10 text-primary-yellow'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t border-border-light">
              <LanguageSwitcher variant="mobile" />
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-border-light space-y-3">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  asChild
                >
                  <Link href="/dashboard" className="inline-flex items-center justify-center">
                    <User className="w-5 h-5 mr-2" />
                    Личный кабинет
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    asChild
                  >
                    <Link href="/auth/login" className="inline-flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Войти
                    </Link>
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    asChild
                  >
                    <Link href="/auth/register">
                      Регистрация
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}