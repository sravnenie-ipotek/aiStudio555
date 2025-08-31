'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff,
  Check,
  X,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  Users,
  Settings,
  Trash2,
  Archive,
  MoreVertical,
  Clock,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'course' | 'payment' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sound: boolean;
  courseUpdates: boolean;
  messages: boolean;
  payments: boolean;
  achievements: boolean;
  promotions: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  preferences: NotificationPreferences;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  onUpdatePreferences: (preferences: NotificationPreferences) => void;
  onAction?: (notificationId: string, actionUrl: string) => void;
}

export function NotificationCenter({
  notifications,
  preferences,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onDelete,
  onUpdatePreferences,
  onAction
}: NotificationCenterProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return XCircle;
      case 'message':
        return MessageSquare;
      case 'course':
        return BookOpen;
      case 'payment':
        return DollarSign;
      case 'achievement':
        return Award;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'message':
        return 'text-purple-500';
      case 'course':
        return 'text-indigo-500';
      case 'payment':
        return 'text-emerald-500';
      case 'achievement':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.justNow');
    if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
    if (hours < 24) return t('notifications.hoursAgo', { count: hours });
    if (days < 7) return t('notifications.daysAgo', { count: days });
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (selectedTab === 'unread') return !n.read && !n.archived;
    if (selectedTab === 'archived') return n.archived;
    if (filter !== 'all') return n.type === filter && !n.archived;
    return !n.archived;
  });

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      onAction?.(notification.id, notification.actionUrl);
    }
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          {preferences.sound ? (
            <Bell className="w-5 h-5" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-xl z-50"
            >
              <Card className="border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('notifications.title')}</CardTitle>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onMarkAllAsRead}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {t('notifications.markAllRead')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {showSettings ? (
                    <div className="p-4 space-y-4">
                      <h3 className="font-medium mb-4">{t('notifications.preferences')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notif">{t('notifications.emailNotifications')}</Label>
                          <Switch
                            id="email-notif"
                            checked={preferences.email}
                            onCheckedChange={(checked) => 
                              onUpdatePreferences({ ...preferences, email: checked })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-notif">{t('notifications.pushNotifications')}</Label>
                          <Switch
                            id="push-notif"
                            checked={preferences.push}
                            onCheckedChange={(checked) => 
                              onUpdatePreferences({ ...preferences, push: checked })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-notif">{t('notifications.soundNotifications')}</Label>
                          <Switch
                            id="sound-notif"
                            checked={preferences.sound}
                            onCheckedChange={(checked) => 
                              onUpdatePreferences({ ...preferences, sound: checked })
                            }
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">{t('notifications.notificationTypes')}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="course-updates">{t('notifications.courseUpdates')}</Label>
                            <Switch
                              id="course-updates"
                              checked={preferences.courseUpdates}
                              onCheckedChange={(checked) => 
                                onUpdatePreferences({ ...preferences, courseUpdates: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="messages">{t('notifications.messages')}</Label>
                            <Switch
                              id="messages"
                              checked={preferences.messages}
                              onCheckedChange={(checked) => 
                                onUpdatePreferences({ ...preferences, messages: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="payments">{t('notifications.payments')}</Label>
                            <Switch
                              id="payments"
                              checked={preferences.payments}
                              onCheckedChange={(checked) => 
                                onUpdatePreferences({ ...preferences, payments: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="achievements">{t('notifications.achievements')}</Label>
                            <Switch
                              id="achievements"
                              checked={preferences.achievements}
                              onCheckedChange={(checked) => 
                                onUpdatePreferences({ ...preferences, achievements: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowSettings(false)}
                      >
                        {t('common.done')}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="w-full justify-start rounded-none border-b">
                          <TabsTrigger value="all">{t('notifications.all')}</TabsTrigger>
                          <TabsTrigger value="unread">
                            {t('notifications.unread')}
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                                {unreadCount}
                              </Badge>
                            )}
                          </TabsTrigger>
                          <TabsTrigger value="archived">{t('notifications.archived')}</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[400px]">
                          <div className="p-2">
                            {filteredNotifications.length === 0 ? (
                              <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                  {selectedTab === 'unread' 
                                    ? t('notifications.noUnread')
                                    : selectedTab === 'archived'
                                    ? t('notifications.noArchived')
                                    : t('notifications.noNotifications')
                                  }
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {filteredNotifications.map(notification => {
                                  const Icon = getNotificationIcon(notification.type);
                                  return (
                                    <motion.div
                                      key={notification.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`
                                        p-3 rounded-lg cursor-pointer transition-colors
                                        ${notification.read ? 'hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}
                                      `}
                                      onClick={() => handleNotificationAction(notification)}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${getNotificationColor(notification.type)}`}>
                                          <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                              <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                              </p>
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                              </p>
                                              {notification.actionUrl && (
                                                <Button
                                                  variant="link"
                                                  size="sm"
                                                  className="p-0 h-auto mt-2"
                                                >
                                                  {notification.actionLabel || t('notifications.viewDetails')}
                                                  <ChevronRight className="w-3 h-3 ml-1" />
                                                </Button>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              {!notification.read && (
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                              )}
                                              <div className="relative">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Show menu
                                                  }}
                                                >
                                                  <MoreVertical className="w-4 h-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-muted-foreground">
                                              {formatTimestamp(notification.timestamp)}
                                            </span>
                                            {notification.priority && notification.priority !== 'medium' && (
                                              <Badge 
                                                variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                                                className="h-4 px-1 text-xs"
                                              >
                                                {t(`notifications.priority.${notification.priority}`)}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </Tabs>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Toast notification component for real-time notifications
export function NotificationToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const { t } = useTranslation();
  const Icon = notification.type === 'success' ? CheckCircle :
               notification.type === 'error' ? XCircle :
               notification.type === 'warning' ? AlertCircle :
               Info;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 max-w-sm bg-background border rounded-lg shadow-lg p-4 z-50"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${
          notification.type === 'success' ? 'text-green-500' :
          notification.type === 'error' ? 'text-red-500' :
          notification.type === 'warning' ? 'text-yellow-500' :
          'text-blue-500'
        }`} />
        <div className="flex-1">
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}