'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, Facebook, Instagram, Menu, Phone, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: 'Курсы',
    href: '/courses',
    children: [
      { label: 'AI Transformation Manager', href: '/courses/ai-manager' },
      { label: 'No-Code Development', href: '/courses/no-code' },
      { label: 'AI Video Generation', href: '/courses/ai-video' },
      { label: 'Все курсы', href: '/courses' },
    ],
  },
  { label: 'Старты месяца', href: '/monthly-starts' },
  { label: 'Преподаватели', href: '/teachers' },
  { label: 'Блог', href: '/blog' },
  {
    label: 'О школе',
    children: [
      { label: 'О нас', href: '/about' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Карьерный центр', href: '/career-center' },
      { label: 'Профориентация', href: '/proforientation' },
    ],
  },
];

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleDropdownToggle = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'bg-dark-header border-b border-dark-secondary/50',
          isScrolled && 'shadow-lg',
          className
        )}
      >
        <div className="w-full">
          <nav className="w-full flex items-center justify-between h-[70px] px-4 sm:px-6 lg:px-12 xl:px-20">
            {/* Logo - Left aligned */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary-yellow">Projectdes</span>
            </Link>

            {/* Desktop Navigation - Center aligned with proper spacing */}
            <div className="hidden lg:flex flex-grow justify-center">
              <ul className="flex items-center gap-8">
                {navigation.map(item => (
                  <li key={item.label} className="relative nav-dropdown">
                    {item.children ? (
                      <>
                        <button
                          onClick={e => handleDropdownToggle(item.label, e)}
                          className={cn(
                            'flex items-center gap-1 text-white text-[15px] font-medium transition-colors whitespace-nowrap',
                            'hover:text-primary-yellow py-2',
                            openDropdown === item.label && 'text-primary-yellow'
                          )}
                        >
                          <span className="whitespace-nowrap">{item.label}</span>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              openDropdown === item.label && 'rotate-180'
                            )}
                          />
                        </button>
                        {openDropdown === item.label && (
                          <div className="absolute top-full left-0 mt-2 bg-dark-secondary rounded-lg shadow-xl border border-dark-gray/30 py-2 min-w-[220px] z-dropdown">
                            {item.children.map(child => (
                              <Link
                                key={child.label}
                                href={child.href!}
                                className={cn(
                                  'block px-4 py-2.5 text-sm text-white transition-colors',
                                  'hover:bg-dark-gray/50 hover:text-primary-yellow',
                                  isActive(child.href!) && 'bg-dark-gray/30 text-primary-yellow'
                                )}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={cn(
                          'text-white text-[15px] font-medium transition-colors py-2 whitespace-nowrap',
                          'hover:text-primary-yellow',
                          isActive(item.href!) && 'text-primary-yellow'
                        )}
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Phone */}
              <a
                href="tel:+12345678901"
                className="flex items-center gap-2 text-white hover:text-primary-yellow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-[15px] font-medium whitespace-nowrap">+1 234 567 890</span>
              </a>

              {/* CTA Button */}
              <Link href="/consultation" className="inline-block">
                <button className="bg-primary-yellow hover:bg-yellow-hover text-dark-pure font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap text-[14px]">
                  Бесплатная консультация
                </button>
              </Link>

              {/* Social Links */}
              <div className="flex items-center gap-1">
                <a
                  href="https://www.facebook.com/teachmeskills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-2.5 h-2.5 text-dark-pure" />
                </a>
                <a
                  href="https://vk.com/tms_education"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="VKontakte"
                >
                  <svg
                    className="w-2.5 h-2.5 text-dark-pure"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.719-1.033-1.001-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.305-.491.744-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.492-.085.744-.576.744z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/teachmeskills/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-2.5 h-2.5 text-dark-pure" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCrpbZ8VZjn8FtMv0-I1VJ2A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-2.5 h-2.5 text-dark-pure" />
                </a>
                <a
                  href="https://t.me/tms_client_bot?start=n_82778__c_4003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="Telegram"
                >
                  <svg
                    className="w-2.5 h-2.5 text-dark-pure"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.27-1.13 7.75-1.6 10.28-.2 1.07-.59 1.43-.97 1.46-.82.07-1.45-.54-2.24-1.06-1.24-.82-1.95-1.33-3.15-2.13-1.39-.93-.49-1.44.3-2.27.21-.22 3.82-3.5 3.89-3.8.01-.04.01-.19-.07-.27-.09-.08-.22-.05-.32-.03-.13.03-2.24 1.42-6.32 4.18-.6.41-1.14.61-1.63.6-.54-.01-1.57-.3-2.34-.55-.94-.31-1.69-.47-1.62-.99.03-.28.41-.57 1.13-.86 4.44-1.94 7.4-3.22 8.88-3.84 4.24-1.77 5.12-2.08 5.69-2.09.13 0 .41.03.59.18.15.12.19.29.21.43.02.1.04.3.02.46z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@teachmeskills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:bg-primary-yellow transition-colors group"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-2.5 h-2.5 text-dark-pure"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.34 6.34 0 0 0-.88-.05 6.33 6.33 0 0 0 0 12.66 6.32 6.32 0 0 0 6.33-6.33V9.65a8.16 8.16 0 0 0 4.78 1.52v-3.4a4.85 4.85 0 0 1-1-1.08z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-dark-header z-40 lg:hidden" style={{ top: '70px' }}>
          <nav className="h-full overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-dark-gray/30">
              <span className="text-lg font-semibold text-white">Меню</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="px-4 pb-6">
              {navigation.map(item => (
                <div key={item.label} className="mb-4">
                  {item.children ? (
                    <details className="group">
                      <summary className="flex items-center justify-between py-2 text-white hover:text-primary-yellow cursor-pointer transition-colors">
                        <span className="font-medium">{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 ml-4 space-y-2">
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            href={child.href!}
                            className="block py-1.5 text-sm text-gray-300 hover:text-primary-yellow transition-colors"
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
                      className="block py-2 text-white hover:text-primary-yellow font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Social Links */}
              <div className="pt-4 border-t border-dark-gray/30 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <a
                    href="https://www.facebook.com/teachmeskills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-dark-secondary hover:bg-dark-gray text-white hover:text-primary-yellow transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-dark-secondary hover:bg-dark-gray text-white hover:text-primary-yellow transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-dark-secondary hover:bg-dark-gray text-white hover:text-primary-yellow transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>

                {/* Mobile Phone */}
                <a
                  href="tel:+12345678901"
                  className="flex items-center gap-2 text-white hover:text-primary-yellow transition-colors mb-4"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 234 567 890</span>
                </a>

                {/* Mobile CTA Button */}
                <Link href="/consultation" className="block">
                  <button className="w-full bg-primary-yellow hover:bg-yellow-hover text-dark-pure font-semibold py-3 rounded-lg transition-all text-sm">
                    Бесплатная консультация
                  </button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
