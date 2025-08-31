'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export interface LayoutWrapperProps {
  children: React.ReactNode;
  headerVariant?: 'transparent' | 'opaque';
  showFooter?: boolean;
}

export function LayoutWrapper({ 
  children, 
  headerVariant = 'opaque',
  showFooter = true 
}: LayoutWrapperProps) {
  return (
    <>
      <Header variant={headerVariant} />
      <main id="main-content" className="pt-16 md:pt-20 min-h-screen">
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}