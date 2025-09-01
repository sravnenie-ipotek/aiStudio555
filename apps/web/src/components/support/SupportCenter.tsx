'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Mail,
  Phone,
  Globe,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  SortAsc,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  responses: Array<{
    id: string;
    message: string;
    author: string;
    role: 'user' | 'support';
    timestamp: Date;
  }>;
}

interface SupportResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  url: string;
  duration?: string;
  readTime?: string;
}

interface SupportCenterProps {
  faqs: FAQItem[];
  tickets: SupportTicket[];
  resources: SupportResource[];
  onCreateTicket: (ticket: Partial<SupportTicket>) => void;
  onReplyToTicket: (ticketId: string, message: string) => void;
  onRateFAQ: (faqId: string, helpful: boolean) => void;
}

export function SupportCenter({
  faqs,
  tickets,
  resources,
  onCreateTicket,
  onReplyToTicket,
  onRateFAQ,
}: SupportCenterProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium' as const,
    attachments: [] as File[],
  });
  const [replyMessage, setReplyMessage] = useState('');

  const categories = ['all', 'general', 'technical', 'billing', 'courses', 'certificates'];

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const variants = {
      low: 'secondary' as const,
      medium: 'default' as const,
      high: 'warning' as const,
      urgent: 'destructive' as const,
    };
    return (
      <Badge variant={variants[priority]}>
        {t(`support.priority.${priority}`)}
      </Badge>
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'video':
        return Video;
      case 'guide':
        return Book;
      default:
        return HelpCircle;
    }
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const handleCreateTicket = () => {
    onCreateTicket({
      ...newTicket,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: [],
    });
    setNewTicket({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium',
      attachments: [],
    });
    setShowNewTicket(false);
  };

  const handleReplyToTicket = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    onReplyToTicket(selectedTicket.id, replyMessage);
    setReplyMessage('');
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t('support.title')}</CardTitle>
          <CardDescription>{t('support.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('support.email')}</p>
                    <p className="text-sm text-muted-foreground">support@aistudio555.ai</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('support.phone')}</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('support.liveChat')}</p>
                    <p className="text-sm text-muted-foreground">{t('support.available247')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('support.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {t(`support.categories.${category}`)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">{t('support.faq')}</TabsTrigger>
          <TabsTrigger value="tickets">{t('support.tickets')}</TabsTrigger>
          <TabsTrigger value="resources">{t('support.resources')}</TabsTrigger>
          <TabsTrigger value="contact">{t('support.contact')}</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.frequentlyAsked')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFAQs.map(faq => (
                  <div
                    key={faq.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium pr-4">{faq.question}</h4>
                        {expandedFAQs.has(faq.id) ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedFAQs.has(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">
                            <p className="text-muted-foreground">{faq.answer}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {t('support.wasHelpful')}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onRateFAQ(faq.id, true)}
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {faq.helpful}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onRateFAQ(faq.id, false)}
                                >
                                  <ThumbsDown className="w-4 h-4 mr-1" />
                                  {faq.notHelpful}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('support.myTickets')}</CardTitle>
                <Button onClick={() => setShowNewTicket(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('support.newTicket')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('support.noTickets')}</p>
                    <Button
                      onClick={() => setShowNewTicket(true)}
                      className="mt-4"
                    >
                      {t('support.createFirstTicket')}
                    </Button>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(ticket.status)}
                            <h4 className="font-medium">{ticket.subject}</h4>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{t('support.ticket')} #{ticket.id}</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>{ticket.responses.length} {t('support.responses')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.helpfulResources')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => {
                  const Icon = getResourceIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{resource.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary">{resource.category}</Badge>
                              {resource.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {resource.duration}
                                </span>
                              )}
                              {resource.readTime && (
                                <span className="flex items-center gap-1">
                                  <Book className="w-3 h-3" />
                                  {resource.readTime}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="link"
                              className="p-0 h-auto mt-2"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              {t('support.viewResource')}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.getInTouch')}</CardTitle>
              <CardDescription>{t('support.contactDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">{t('support.yourName')}</Label>
                  <Input id="contact-name" />
                </div>
                <div>
                  <Label htmlFor="contact-email">{t('support.yourEmail')}</Label>
                  <Input id="contact-email" type="email" />
                </div>
                <div>
                  <Label htmlFor="contact-subject">{t('support.subject')}</Label>
                  <Input id="contact-subject" />
                </div>
                <div>
                  <Label htmlFor="contact-message">{t('support.message')}</Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder={t('support.messagePlaceholder')}
                  />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {t('support.sendMessage')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowNewTicket(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-background rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{t('support.createNewTicket')}</h3>

            <div className="space-y-4">
              <div>
                <Label>{t('support.subject')}</Label>
                <Input
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder={t('support.subjectPlaceholder')}
                />
              </div>

              <div>
                <Label>{t('support.category')}</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                >
                  <option value="general">{t('support.categories.general')}</option>
                  <option value="technical">{t('support.categories.technical')}</option>
                  <option value="billing">{t('support.categories.billing')}</option>
                  <option value="courses">{t('support.categories.courses')}</option>
                  <option value="certificates">{t('support.categories.certificates')}</option>
                </select>
              </div>

              <div>
                <Label>{t('support.priority')}</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                >
                  <option value="low">{t('support.priority.low')}</option>
                  <option value="medium">{t('support.priority.medium')}</option>
                  <option value="high">{t('support.priority.high')}</option>
                  <option value="urgent">{t('support.priority.urgent')}</option>
                </select>
              </div>

              <div>
                <Label>{t('support.description')}</Label>
                <Textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder={t('support.descriptionPlaceholder')}
                  rows={5}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.subject || !newTicket.description}
                  className="flex-1"
                >
                  {t('support.createTicket')}
                </Button>
                <Button
                  onClick={() => setShowNewTicket(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTicket(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedTicket.status)}
                  <span className="text-sm text-muted-foreground">
                    {t('support.ticket')} #{selectedTicket.id}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </div>
              <Button
                onClick={() => setSelectedTicket(null)}
                variant="ghost"
                size="icon"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-4 mb-4">
              <div className="space-y-4">
                {/* Initial Message */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{t('support.you')}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>

                {/* Responses */}
                {selectedTicket.responses.map(response => (
                  <div
                    key={response.id}
                    className={`rounded-lg p-4 ${
                      response.role === 'support' ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {response.role === 'support' ? response.author : t('support.you')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(response.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{response.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedTicket.status !== 'closed' && (
              <div className="space-y-4">
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={t('support.typeReply')}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReplyToTicket}
                    disabled={!replyMessage.trim()}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('support.sendReply')}
                  </Button>
                  <Button
                    onClick={() => setSelectedTicket(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('common.close')}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
