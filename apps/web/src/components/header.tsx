'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, Facebook, Instagram, Menu, Phone, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { strapiClient } from '@/lib/strapi-client';
import { languageManager, type SupportedLanguage } from '@/lib/language-manager';
// import { LanguageSelector } from '@/components/ui/language-selector';

interface NavItem {
  id: number;
  key: string;
  titleKey: string;
  href?: string;
  order: number;
  parentId?: number;
  isActive: boolean;
  children?: NavItem[];
  label: string; // Resolved translation
}

// Fallback navigation structure with translation keys
interface FallbackNavItem {
  titleKey: string;
  href?: string;
  children?: FallbackNavItem[];
}

const fallbackNavigationStructure: FallbackNavItem[] = [
  {
    titleKey: 'nav.courses',
    href: '/courses',
    children: [
      { titleKey: 'nav.aiManager', href: '/courses/ai-manager' },
      { titleKey: 'nav.noCode', href: '/courses/no-code' },
      { titleKey: 'nav.aiVideo', href: '/courses/ai-video' },
      { titleKey: 'nav.allCourses', href: '/courses' },
    ],
  },
  { titleKey: 'nav.monthlyStarts', href: '/monthly-starts' },
  { titleKey: 'nav.instructors', href: '/teachers' },
  { titleKey: 'nav.blog', href: '/blog' },
  {
    titleKey: 'nav.aboutSchool',
    children: [
      { titleKey: 'nav.aboutUs', href: '/about' },
      { titleKey: 'nav.contacts', href: '/contacts' },
      { titleKey: 'nav.careerCenter', href: '/career-center' },
      { titleKey: 'nav.profOrientation', href: '/proforientation' },
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
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [isNavigationLoading, setIsNavigationLoading] = useState(true);
  
  const { tSync, isUsingFallback, strapiConnected } = useTranslation();

  // Helper function to convert fallback navigation structure to NavItems
  const convertFallbackToNavItems = (items: FallbackNavItem[]): NavItem[] => {
    return items.map((item, index) => ({
      id: index,
      key: item.titleKey,
      titleKey: item.titleKey,
      href: item.href,
      order: index,
      isActive: true,
      label: tSync(item.titleKey) || item.titleKey,
      children: item.children ? convertFallbackToNavItems(item.children) : undefined,
    }));
  };

  // Load navigation data from Strapi with fallback
  useEffect(() => {
    console.log('🚀 Navigation useEffect triggered');
    
    const loadNavigation = async () => {
      console.log('📝 Loading navigation from Strapi...');
      setIsNavigationLoading(true);
      
      try {
        // Try to fetch from Strapi first
        const strapiNav = await strapiClient.getNavigation();
        const currentLang = languageManager.getCurrentLanguage();
        
        if (strapiNav?.headerMenu && strapiNav.headerMenu.length > 0) {
          console.log('✅ Loaded navigation from Strapi:', strapiNav.headerMenu.length, 'items');
          
          // Transform Strapi data to NavItem format
          const transformedNav: NavItem[] = strapiNav.headerMenu.map((item: any) => {
            // Get label based on current language
            const labelField = `label${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
            const label = item[labelField] || item.labelRu || item.labelEn || tSync(item.titleKey);
            
            const navItem: NavItem = {
              id: item.id,
              key: item.titleKey || `nav-${item.id}`,
              titleKey: item.titleKey,
              href: item.url,
              order: item.order || 0,
              isActive: item.isActive !== false,
              label: label,
            };
            
            // Transform dropdown items if they exist
            if (item.hasDropdown && item.dropdownItems?.length > 0) {
              navItem.children = item.dropdownItems.map((dropItem: any) => {
                const dropLabelField = `label${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
                const dropLabel = dropItem[dropLabelField] || dropItem.labelRu || dropItem.labelEn || tSync(dropItem.titleKey);
                
                return {
                  id: dropItem.id,
                  key: dropItem.titleKey || `dropdown-${dropItem.id}`,
                  titleKey: dropItem.titleKey,
                  href: dropItem.url,
                  order: dropItem.order || 0,
                  isActive: dropItem.isActive !== false,
                  label: dropLabel,
                };
              });
            }
            
            return navItem;
          });
          
          // Sort by order
          transformedNav.sort((a, b) => a.order - b.order);
          setNavigation(transformedNav);
        } else {
          console.log('⚠️ No navigation data from Strapi, using fallback');
          // Use fallback hardcoded navigation
          const fallbackNav: NavItem[] = [
            {
              id: 1,
              key: 'courses',
              titleKey: 'nav.courses',
              href: '/courses',
              order: 1,
              isActive: true,
              label: tSync('nav.courses'),
            },
            { id: 2, key: 'monthly-starts', titleKey: 'nav.monthlyStarts', href: '/monthly-starts', order: 2, isActive: true, label: tSync('nav.monthlyStarts') },
            { id: 3, key: 'instructors', titleKey: 'nav.instructors', href: '/teachers', order: 3, isActive: true, label: tSync('nav.instructors') },
            { id: 4, key: 'blog', titleKey: 'nav.blog', href: '/blog', order: 4, isActive: true, label: tSync('nav.blog') },
            {
              id: 5,
              key: 'about-school',
              titleKey: 'nav.aboutSchool',
              order: 5,
              isActive: true,
              label: tSync('nav.aboutSchool'),
              children: [
                { id: 51, key: 'prof-orientation', titleKey: 'nav.profOrientation', href: '/proforientation', order: 1, isActive: true, label: tSync('nav.profOrientation') },
                { id: 52, key: 'career-center', titleKey: 'nav.careerCenter', href: '/career-center', order: 2, isActive: true, label: tSync('nav.careerCenter') },
              ],
            },
          ];
          setNavigation(fallbackNav);
        }
      } catch (error) {
        console.error('❌ Failed to load navigation:', error);
        // Use minimal fallback navigation
        const minimalNav: NavItem[] = [
          { id: 1, key: 'courses', titleKey: 'nav.courses', href: '/courses', order: 1, isActive: true, label: 'Курсы' },
          { id: 2, key: 'about', titleKey: 'nav.aboutSchool', href: '/about', order: 2, isActive: true, label: 'О школе' },
        ];
        setNavigation(minimalNav);
      } finally {
        setIsNavigationLoading(false);
        console.log('🏁 Navigation loading completed');
      }
    };
    
    // Use setTimeout to ensure component is mounted
    setTimeout(loadNavigation, 100);
  }, [tSync]);

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
      {/* Development Mode Translation Source Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
          {/* Fallback Indicator */}
          {isUsingFallback && (
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
              📝 FALLBACK MODE
            </div>
          )}
          {/* Strapi Connection Status */}
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
            strapiConnected 
              ? "bg-green-500 text-white" 
              : strapiConnected === false 
                ? "bg-red-500 text-white" 
                : "bg-gray-500 text-white"
          )}>
            {strapiConnected 
              ? "✅ Strapi Connected" 
              : strapiConnected === false 
                ? "❌ Strapi Offline" 
                : "⏳ Checking Strapi..."}
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'bg-dark-header border-b border-dark-secondary/50',
          isScrolled && 'shadow-lg',
          className,
        )}
      >
        <div className="w-full">
          <nav className="w-full flex items-center justify-between h-[70px] px-4 sm:px-6 lg:px-12 xl:px-20">
            {/* Mobile Logo - Visible on mobile only */}
            <Link href="/" className="flex-shrink-0 lg:hidden">
              <span className="text-[19px] font-normal">
                <span className="text-primary-yellow">AiStudio555</span>
                <span className="text-white">Курсы</span>
              </span>
            </Link>

            {/* Left Side - Logo and Navigation (Desktop) */}
            <div className="hidden lg:flex items-center gap-10">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <span className="text-[19px] font-normal">
                  <span className="text-primary-yellow">AiStudio555</span>
                  <span className="text-white">Курсы</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              {isNavigationLoading ? (
                <div className="flex items-center gap-6">
                  {/* Loading skeleton */}
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-6 w-20 bg-dark-secondary/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="flex items-center gap-6">
                  {navigation.map(item => (
                    <li key={item.key || item.label} className="relative nav-dropdown">
                    {item.children ? (
                      <>
                        <button
                          onClick={e => handleDropdownToggle(item.key || item.label, e)}
                          className={cn(
                            'flex items-center gap-1 text-white text-[14px] font-normal transition-colors whitespace-nowrap',
                            'hover:text-primary-yellow py-2',
                            openDropdown === (item.key || item.label) && 'text-primary-yellow',
                          )}
                        >
                          <span className="whitespace-nowrap">{tSync(item.titleKey || item.label)}</span>
                          <ChevronDown
                            className={cn(
                              'w-3.5 h-3.5 transition-transform',
                              openDropdown === (item.key || item.label) && 'rotate-180',
                            )}
                          />
                        </button>
                        {openDropdown === (item.key || item.label) && (
                          <div className="absolute top-full left-0 mt-2 bg-dark-secondary rounded-lg shadow-xl border border-dark-gray/30 py-2 min-w-[220px] z-dropdown">
                            {item.children?.map(child => (
                              <Link
                                key={child.key || child.label}
                                href={child.href!}
                                className={cn(
                                  'block px-4 py-2.5 text-sm text-white transition-colors',
                                  'hover:bg-dark-gray/50 hover:text-primary-yellow',
                                  isActive(child.href!) && 'bg-dark-gray/30 text-primary-yellow',
                                )}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {tSync(child.titleKey || child.label)}
                              </Link>
                            )) || []}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={cn(
                          'text-white text-[14px] font-normal transition-colors py-2 whitespace-nowrap',
                          'hover:text-primary-yellow',
                          isActive(item.href!) && 'text-primary-yellow',
                        )}
                      >
                        <span className="whitespace-nowrap">{tSync(item.titleKey || item.label)}</span>
                      </Link>
                    )}
                  </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0 ml-auto">
              {/* Language Selector */}
              {/* Language selector temporarily disabled for debugging */}
              <div className="text-white text-[13px] font-normal">RU</div>
              
              {/* Phone */}
              <a
                href="tel:+73752916959"
                className="flex items-center gap-1.5 text-white hover:text-primary-yellow transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="text-[14px] font-normal whitespace-nowrap">+375 29 169-59-59</span>
              </a>

              {/* CTA Button */}
              <Link href="/consultation" className="inline-block">
                <button className="bg-primary-yellow hover:bg-yellow-hover text-dark-pure font-medium px-5 py-2 rounded-lg transition-all whitespace-nowrap text-[13px]">
                  {tSync('nav.enrollNow')}
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
              {isNavigationLoading ? (
                <div className="space-y-4">
                  {/* Loading skeleton for mobile menu */}
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-10 bg-dark-secondary/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                navigation.map(item => (
                  <div key={item.key || item.label} className="mb-4">
                    {item.children ? (
                      <details className="group">
                        <summary className="flex items-center justify-between py-2 text-white hover:text-primary-yellow cursor-pointer transition-colors">
                          <span className="font-medium">{tSync(item.titleKey || item.label)}</span>
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-2 ml-4 space-y-2">
                          {item.children.map(child => (
                            <Link
                              key={child.key || child.label}
                              href={child.href!}
                              className="block py-1.5 text-sm text-gray-300 hover:text-primary-yellow transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {tSync(child.titleKey || child.label)}
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
                        {tSync(item.titleKey || item.label)}
                      </Link>
                    )}
                  </div>
                ))
              )}

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-dark-gray/30 mt-4">
                <div className="mb-4">
                  <span className="text-sm text-gray-400 mb-2 block">{tSync('common.language') || 'Language'}</span>
                  {/* Language selector temporarily disabled */}
                  <div className="text-white text-sm">RU</div>
                </div>
                
                {/* Mobile Social Links */}
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
