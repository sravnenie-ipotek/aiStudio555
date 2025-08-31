'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  BookOpen,
  Award,
  MessageSquare,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,
  BarChart3,
  Calendar,
  Users,
  FileText,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter, usePathname } from 'next/navigation';

interface MobileNavigationProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
  messageCount?: number;
}

export function MobileNavigation({ user, notificationCount = 0, messageCount = 0 }: MobileNavigationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home, path: '/dashboard' },
    { id: 'courses', label: t('nav.courses'), icon: BookOpen, path: '/courses' },
    { id: 'certificates', label: t('nav.certificates'), icon: Award, path: '/certificates' },
    { id: 'messages', label: t('nav.messages'), icon: MessageSquare, path: '/messages', badge: messageCount },
  ];

  const menuItems = [
    {
      section: t('nav.learning'),
      items: [
        { id: 'my-courses', label: t('nav.myCourses'), icon: BookOpen, path: '/dashboard/courses' },
        { id: 'progress', label: t('nav.progress'), icon: BarChart3, path: '/dashboard/progress' },
        { id: 'schedule', label: t('nav.schedule'), icon: Calendar, path: '/dashboard/schedule' },
        { id: 'certificates', label: t('nav.certificates'), icon: Award, path: '/dashboard/certificates' },
      ],
    },
    {
      section: t('nav.community'),
      items: [
        { id: 'messages', label: t('nav.messages'), icon: MessageSquare, path: '/messages', badge: messageCount },
        { id: 'groups', label: t('nav.groups'), icon: Users, path: '/groups' },
        { id: 'forums', label: t('nav.forums'), icon: FileText, path: '/forums' },
      ],
    },
    {
      section: t('nav.account'),
      items: [
        { id: 'profile', label: t('nav.profile'), icon: User, path: '/profile' },
        { id: 'payments', label: t('nav.payments'), icon: CreditCard, path: '/payments' },
        { id: 'settings', label: t('nav.settings'), icon: Settings, path: '/settings' },
        { id: 'support', label: t('nav.support'), icon: HelpCircle, path: '/support' },
      ],
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b z-40 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 text-center">
            <h1 className="font-semibold text-lg">Projectdes Academy</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => router.push('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 relative ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => router.push(item.path)}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t('nav.menu')}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-6">
                {menuItems.map(section => (
                  <div key={section.section}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {section.section}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              router.push(item.path);
                              setIsMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center justify-between p-3 rounded-lg
                              transition-colors hover:bg-muted
                              ${isActive(item.path) ? 'bg-primary/10 text-primary' : ''}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && item.badge > 0 && (
                                <Badge variant="destructive" className="h-5 px-1.5">
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Logout Button */}
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      // Handle logout
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('nav.logout')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 lg:hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
              </div>

              {/* Search Results */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('search.recentSearches')}
                </h3>
                {/* Add search results here */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
