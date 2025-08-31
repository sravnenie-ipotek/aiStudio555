'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Youtube, 
  Instagram,
  Facebook,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string
  logoSrc?: string
  logoAlt?: string
}

const footerLinks = {
  courses: [
    { label: "AI Transformation Manager", href: "/courses/ai-transformation" },
    { label: "No-Code Website Development", href: "/courses/no-code-development" },
    { label: "AI Video & Avatar Generation", href: "/courses/ai-video-avatar" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Support", href: "/contact" },
    { label: "Live Chat", href: "/chat" },
    { label: "Community", href: "/community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ],
}

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/projectdes-academy",
    icon: Linkedin,
    ariaLabel: "Follow us on LinkedIn"
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@projectdes-academy",
    icon: Youtube,
    ariaLabel: "Subscribe to our YouTube channel"
  },
  {
    name: "Instagram",
    href: "https://instagram.com/projectdes.academy",
    icon: Instagram,
    ariaLabel: "Follow us on Instagram"
  },
]

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@projectdes.academy",
    href: "mailto:info@projectdes.academy"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+972-50-123-4567",
    href: "tel:+972501234567"
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Tel Aviv, Israel",
    href: "https://maps.google.com/?q=Tel+Aviv+Israel"
  },
]

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, logoSrc, logoAlt = "Projectdes Academy", ...props }, ref) => {
    const currentYear = new Date().getFullYear()

    return (
      <footer
        ref={ref}
        className={cn(
          "bg-dark-header text-white",
          className
        )}
        role="contentinfo"
        {...props}
      >
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="inline-block mb-6 focus:outline-none focus:ring-2 focus:ring-primary-yellow rounded-md p-1"
                aria-label={`${logoAlt} - Go to homepage`}
              >
                {logoSrc ? (
                  <img 
                    src={logoSrc} 
                    alt={logoAlt}
                    className="h-10 w-auto"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-yellow rounded-lg flex items-center justify-center">
                      <span className="text-dark-pure font-bold text-xl">P</span>
                    </div>
                    <span className="text-xl font-bold text-primary-yellow">
                      Projectdes Academy
                    </span>
                  </div>
                )}
              </Link>

              {/* Description */}
              <p className="text-text-light mb-6 leading-relaxed">
                Transform your career with practical AI skills. Join thousands of professionals who've successfully transitioned into high-paying AI roles with our intensive, project-based programs.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 text-text-light hover:text-primary-yellow transition-colors duration-200 group min-h-[44px]"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={`${item.label}: ${item.value}`}
                  >
                    <item.icon 
                      className="h-5 w-5 text-primary-yellow group-hover:scale-110 transition-transform duration-200" 
                      aria-hidden="true"
                    />
                    <span>{item.value}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">
                Our Courses
              </h3>
              <ul className="space-y-3" role="list">
                {footerLinks.courses.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      href={link.href}
                      className="text-text-light hover:text-primary-yellow transition-colors duration-200 block py-1 min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">
                Company
              </h3>
              <ul className="space-y-3" role="list">
                {footerLinks.company.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      href={link.href}
                      className="text-text-light hover:text-primary-yellow transition-colors duration-200 block py-1 min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">
                Support
              </h3>
              <ul className="space-y-3" role="list">
                {footerLinks.support.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      href={link.href}
                      className="text-text-light hover:text-primary-yellow transition-colors duration-200 block py-1 min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">
                Legal
              </h3>
              <ul className="space-y-3" role="list">
                {footerLinks.legal.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      href={link.href}
                      className="text-text-light hover:text-primary-yellow transition-colors duration-200 block py-1 min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-dark-gray">
            <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
              <div className="lg:flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Stay Updated with AI Trends
                </h3>
                <p className="text-text-light">
                  Get weekly insights on AI transformation and exclusive course updates.
                </p>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                <form className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-md bg-dark-secondary border border-dark-gray text-white placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent min-h-[44px]"
                    required
                    aria-describedby="newsletter-description"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="default"
                    className="sm:flex-shrink-0"
                    aria-describedby="newsletter-description"
                  >
                    Subscribe
                  </Button>
                </form>
                <p id="newsletter-description" className="text-xs text-text-light mt-2">
                  No spam, unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-gray">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="text-text-light text-sm">
                © {currentYear} Projectdes Academy. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-text-light text-sm mr-2">Follow us:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-light hover:text-primary-yellow transition-colors duration-200 p-2 hover:bg-dark-secondary rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={social.ariaLabel}
                  >
                    <social.icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* Language/Region */}
              <div className="flex items-center space-x-2 text-text-light text-sm">
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span>Global • English</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = "Footer"

export { Footer }
export { footerLinks, socialLinks, contactInfo }