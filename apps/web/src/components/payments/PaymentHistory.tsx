'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar,
  CreditCard,
  DollarSign,
  Receipt,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Mail,
  Printer
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

interface Payment {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  description: string;
  courseName?: string;
  invoiceNumber?: string;
  transactionId?: string;
  installment?: {
    current: number;
    total: number;
  };
}

interface PaymentSummary {
  totalSpent: number;
  pendingPayments: number;
  completedPayments: number;
  upcomingPayments: number;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
}

interface PaymentHistoryProps {
  payments: Payment[];
  summary: PaymentSummary;
  onDownloadInvoice?: (paymentId: string) => void;
  onRequestRefund?: (paymentId: string) => void;
}

export function PaymentHistory({
  payments,
  summary,
  onDownloadInvoice,
  onRequestRefund
}: PaymentHistoryProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      completed: 'success' as const,
      pending: 'warning' as const,
      failed: 'destructive' as const,
      refunded: 'secondary' as const,
    };
    return (
      <Badge variant={variants[status]}>
        {t(`payments.status.${status}`)}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return <DollarSign className="w-4 h-4" />;
      case 'bank_transfer':
        return <Receipt className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      searchQuery === '' ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || payment.status === selectedStatus;
    
    const matchesDateRange = 
      (!dateRange.start || new Date(payment.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(payment.date) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleExportData = () => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Status', 'Method', 'Invoice'],
      ...filteredPayments.map(p => [
        new Date(p.date).toLocaleDateString(),
        p.description,
        `${p.currency}${p.amount}`,
        p.status,
        p.method,
        p.invoiceNumber || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-history.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.totalSpent')}</p>
                <p className="text-2xl font-bold">${summary.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.completed')}</p>
                <p className="text-2xl font-bold">{summary.completedPayments}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.pending')}</p>
                <p className="text-2xl font-bold">{summary.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.upcoming')}</p>
                <p className="text-2xl font-bold">{summary.upcomingPayments}</p>
                {summary.nextPaymentDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(summary.nextPaymentDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('payments.history')}</CardTitle>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t('payments.export')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('payments.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder={t('payments.startDate')}
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder={t('payments.endDate')}
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>

            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList>
                <TabsTrigger value="all">{t('payments.all')}</TabsTrigger>
                <TabsTrigger value="completed">{t('payments.status.completed')}</TabsTrigger>
                <TabsTrigger value="pending">{t('payments.status.pending')}</TabsTrigger>
                <TabsTrigger value="failed">{t('payments.status.failed')}</TabsTrigger>
                <TabsTrigger value="refunded">{t('payments.status.refunded')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('payments.date')}</TableHead>
                  <TableHead>{t('payments.description')}</TableHead>
                  <TableHead>{t('payments.amount')}</TableHead>
                  <TableHead>{t('payments.status')}</TableHead>
                  <TableHead>{t('payments.method')}</TableHead>
                  <TableHead>{t('payments.invoice')}</TableHead>
                  <TableHead className="text-right">{t('payments.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">{t('payments.noPayments')}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          {payment.courseName && (
                            <p className="text-sm text-muted-foreground">{payment.courseName}</p>
                          )}
                          {payment.installment && (
                            <p className="text-xs text-muted-foreground">
                              {t('payments.installment', {
                                current: payment.installment.current,
                                total: payment.installment.total
                              })}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {payment.currency}{payment.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          {getStatusBadge(payment.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.method)}
                          <span className="text-sm">{t(`payments.methods.${payment.method}`)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.invoiceNumber ? (
                          <Badge variant="outline">{payment.invoiceNumber}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payment.invoiceNumber && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDownloadInvoice?.(payment.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {payment.status === 'completed' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onRequestRefund?.(payment.id)}
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-background rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{t('payments.details')}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.transactionId')}</p>
                <p className="font-mono">{selectedPayment.transactionId || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.date')}</p>
                <p>{new Date(selectedPayment.date).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.amount')}</p>
                <p className="text-2xl font-bold">
                  {selectedPayment.currency}{selectedPayment.amount.toFixed(2)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('payments.status')}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedPayment.status)}
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    onDownloadInvoice?.(selectedPayment.id);
                    setSelectedPayment(null);
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('payments.downloadInvoice')}
                </Button>
                <Button
                  onClick={() => setSelectedPayment(null)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('common.close')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}