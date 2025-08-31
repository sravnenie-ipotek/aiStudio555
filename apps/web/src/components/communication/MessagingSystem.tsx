'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send,
  Paperclip,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Users,
  MessageSquare,
  Star,
  Edit,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  edited?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
  }>;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    online?: boolean;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  pinned?: boolean;
  archived?: boolean;
}

interface MessagingSystemProps {
  userId: string;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, message: string, attachments?: File[]) => void;
  onMarkAsRead: (conversationId: string, messageId: string) => void;
}

export function MessagingSystem({
  userId,
  conversations,
  onSendMessage,
  onMarkAsRead: _onMarkAsRead,
}: MessagingSystemProps) {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations[0]?.id || null,
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demo
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    [conversations[0]?.id || '']: [
      {
        id: '1',
        senderId: 'instructor1',
        senderName: 'Dr. Sarah Johnson',
        content: 'Welcome to the AI Transformation course! How can I help you today?',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: '2',
        senderId: userId,
        senderName: 'You',
        content: 'Thank you! I have a question about the first assignment.',
        timestamp: new Date(Date.now() - 3000000),
        read: true,
      },
      {
        id: '3',
        senderId: 'instructor1',
        senderName: 'Dr. Sarah Johnson',
        content: 'Of course! What would you like to know about the assignment?',
        timestamp: new Date(Date.now() - 2400000),
        read: true,
      },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: 'You',
      content: messageInput,
      timestamp: new Date(),
      read: false,
      attachments: attachments.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      })),
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));

    onSendMessage(selectedConversation, messageInput, attachments);
    setMessageInput('');
    setAttachments([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== userId);
      return otherParticipant?.name || t('messaging.unknown');
    }
    return conversation.participants.map(p => p.name).join(', ');
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== userId);
      return otherParticipant?.avatar;
    }
    return null;
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation || ''] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('messaging.conversations')}</CardTitle>
            <Button size="icon" variant="ghost">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('messaging.searchConversations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="all">{t('messaging.all')}</TabsTrigger>
              <TabsTrigger value="unread">{t('messaging.unread')}</TabsTrigger>
              <TabsTrigger value="archived">{t('messaging.archived')}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[450px]">
                {conversations
                  .filter(c => !c.archived)
                  .filter(c =>
                    searchQuery === '' ||
                    getConversationName(c).toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`
                        w-full p-4 hover:bg-muted/50 transition-colors text-left
                        ${selectedConversation === conversation.id ? 'bg-muted' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={getConversationAvatar(conversation)} />
                          <AvatarFallback>
                            {conversation.type === 'group' ? (
                              <Users className="w-4 h-4" />
                            ) : (
                              getConversationName(conversation).charAt(0)
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              {getConversationName(conversation)}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {conversation.pinned && (
                              <Star className="w-3 h-3 text-primary" />
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 px-1.5">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            {conversation.type === 'support' && (
                              <Badge variant="secondary" className="h-5 px-1.5">
                                {t('messaging.support')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="lg:col-span-2 flex flex-col">
        {currentConversation ? (
          <>
            {/* Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={getConversationAvatar(currentConversation)} />
                    <AvatarFallback>
                      {currentConversation.type === 'group' ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        getConversationName(currentConversation).charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{getConversationName(currentConversation)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentConversation.type === 'group'
                        ? `${currentConversation.participants.length} ${t('messaging.members')}`
                        : currentConversation.participants.find(p => p.id !== userId)?.online
                          ? t('messaging.online')
                          : t('messaging.offline')
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {currentMessages.map((message, index) => {
                    const isOwn = message.senderId === userId;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          {!isOwn && (
                            <p className="text-xs text-muted-foreground mb-1 px-3">
                              {message.senderName}
                            </p>
                          )}
                          <div
                            className={`
                              rounded-lg px-4 py-2
                              ${isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'}
                            `}
                          >
                            {message.replyTo && (
                              <div className="mb-2 p-2 rounded bg-black/10 border-l-2 border-white/50">
                                <p className="text-xs opacity-70">{message.replyTo.senderName}</p>
                                <p className="text-sm">{message.replyTo.content}</p>
                              </div>
                            )}
                            <p className="break-words">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map(attachment => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center gap-2 p-2 rounded bg-black/10"
                                  >
                                    <Paperclip className="w-4 h-4" />
                                    <span className="text-sm">{attachment.name}</span>
                                    <span className="text-xs opacity-70">({attachment.size})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {message.edited && (
                                <span className="text-xs opacity-70">{t('messaging.edited')}</span>
                              )}
                              {isOwn && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachments.map((file, index) => (
                    <Badge key={index} variant="secondary">
                      {file.name}
                      <button
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder={t('messaging.typeMessage')}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() && attachments.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('messaging.selectConversation')}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
