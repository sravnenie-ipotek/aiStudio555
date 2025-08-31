'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Download,
  Share2,
  Printer,
  CheckCircle,
  Calendar,
  User,
  Shield,
  ExternalLink,
  Copy,
  Mail,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateData {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: Date;
  instructorName: string;
  certificateNumber: string;
  grade?: string;
  skills: string[];
  validationUrl: string;
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
}

export function CertificateGenerator({
  certificateData,
  onDownload,
  onShare,
}: CertificateGeneratorProps) {
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const downloadCertificate = async (format: 'pdf' | 'png') => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `certificate-${certificateData.certificateNumber}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`certificate-${certificateData.certificateNumber}.pdf`);
      }

      onDownload?.();
    } catch (error) {
      // TODO: Implement proper error logging
      // Error generating certificate
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCertificate = (platform: 'linkedin' | 'twitter' | 'email' | 'copy') => {
    const shareText = t('certificates.shareText', {
      courseName: certificateData.courseName,
    });
    const shareUrl = certificateData.validationUrl;

    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank',
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
    }

    onShare?.();
    setShareMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('certificates.yourCertificate')}</CardTitle>
            <Badge variant="success">
              <CheckCircle className="w-4 h-4 mr-1" />
              {t('certificates.verified')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={certificateRef}
            className="relative bg-white p-12 rounded-lg border-4 border-primary/20"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23635bff\' stroke-width=\'0.2\' opacity=\'0.1\'%3E%3Cpath d=\'M50 30 L70 50 L50 70 L30 50 Z\'/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '100px 100px',
            }}
          >
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                {t('certificates.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('certificates.subtitle')}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-6">
              <div>
                <p className="text-lg text-muted-foreground mb-2">
                  {t('certificates.presentedTo')}
                </p>
                <h2 className="text-3xl font-bold">
                  {certificateData.studentName}
                </h2>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-2">
                  {t('certificates.forCompleting')}
                </p>
                <h3 className="text-2xl font-semibold text-primary">
                  {certificateData.courseName}
                </h3>
              </div>

              {certificateData.grade && (
                <div>
                  <p className="text-lg text-muted-foreground mb-2">
                    {t('certificates.withGrade')}
                  </p>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {certificateData.grade}
                  </Badge>
                </div>
              )}

              {/* Skills */}
              {certificateData.skills.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('certificates.skillsAcquired')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificateData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Date and Signature */}
              <div className="flex justify-between items-end mt-12 pt-8 border-t">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('certificates.completionDate')}
                  </p>
                  <p className="font-medium">
                    {new Date(certificateData.completionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="border-b-2 border-primary/50 w-48 mb-2"></div>
                  <p className="font-medium">{certificateData.instructorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('certificates.instructor')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('certificates.certificateNumber')}
                  </p>
                  <p className="font-mono font-medium">
                    {certificateData.certificateNumber}
                  </p>
                </div>
              </div>

              {/* Validation Footer */}
              <div className="mt-6 pt-4 border-t text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>{t('certificates.verifyAt')}</span>
                  <a
                    href={certificateData.validationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {certificateData.validationUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => downloadCertificate('pdf')}
              disabled={isGenerating}
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('certificates.downloadPDF')}
            </Button>
            <Button
              onClick={() => downloadCertificate('png')}
              disabled={isGenerating}
              variant="outline"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('certificates.downloadPNG')}
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="lg"
            >
              <Printer className="w-4 h-4 mr-2" />
              {t('certificates.print')}
            </Button>
            <div className="relative">
              <Button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                variant="outline"
                size="lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('certificates.share')}
              </Button>

              {shareMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 right-0 bg-background border
                    rounded-lg shadow-lg p-2 min-w-[200px] z-10"
                >
                  <button
                    onClick={() => shareCertificate('linkedin')}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => shareCertificate('twitter')}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => shareCertificate('email')}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    onClick={() => shareCertificate('copy')}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {t('certificates.copyLink')}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('certificates.info.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('certificates.info.blockchainVerified')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('certificates.info.blockchainDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('certificates.info.industryRecognized')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('certificates.info.industryDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('certificates.info.lifetimeValid')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('certificates.info.lifetimeDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('certificates.info.dateIssued')}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(certificateData.completionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
