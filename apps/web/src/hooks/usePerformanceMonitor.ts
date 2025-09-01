/**
 * Performance Monitoring Hook
 * Tracks Core Web Vitals and performance metrics
 */

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface PerformanceBudget {
  lcp: number; // <2500ms
  fid: number; // <100ms
  cls: number; // <0.1
  fcp: number; // <1800ms
  ttfb: number; // <600ms
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
};

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  const [budgetViolations, setBudgetViolations] = useState<string[]>([]);

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    const observers: PerformanceObserver[] = [];

    // Observer for LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime: number; loadTime: number };
      const value = lastEntry.renderTime || lastEntry.loadTime;
      
      setMetrics(prev => ({ ...prev, lcp: value }));
      
      if (value > PERFORMANCE_BUDGET.lcp) {
        setBudgetViolations(prev => [...prev.filter(v => !v.includes('LCP')), `LCP exceeded: ${Math.round(value)}ms > ${PERFORMANCE_BUDGET.lcp}ms`]);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Observer for FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        const value = entry.processingStart - entry.startTime;
        setMetrics(prev => ({ ...prev, fid: value }));
        
        if (value > PERFORMANCE_BUDGET.fid) {
          setBudgetViolations(prev => [...prev.filter(v => !v.includes('FID')), `FID exceeded: ${Math.round(value)}ms > ${PERFORMANCE_BUDGET.fid}ms`]);
        }
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Observer for CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      setMetrics(prev => ({ ...prev, cls: clsValue }));
      
      if (clsValue > PERFORMANCE_BUDGET.cls) {
        setBudgetViolations(prev => [...prev.filter(v => !v.includes('CLS')), `CLS exceeded: ${clsValue.toFixed(3)} > ${PERFORMANCE_BUDGET.cls}`]);
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // Observer for FCP and TTFB
    const paintObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          setMetrics(prev => ({ ...prev, fcp: value }));
          
          if (value > PERFORMANCE_BUDGET.fcp) {
            setBudgetViolations(prev => [...prev.filter(v => !v.includes('FCP')), `FCP exceeded: ${Math.round(value)}ms > ${PERFORMANCE_BUDGET.fcp}ms`]);
          }
        }
      });
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
      observers.push(paintObserver);
    } catch (e) {
      console.warn('Paint observer not supported');
    }

    // Get navigation timing for TTFB
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const ttfbValue = navEntries[0].responseStart - navEntries[0].requestStart;
        setMetrics(prev => ({ ...prev, ttfb: ttfbValue }));
        
        if (ttfbValue > PERFORMANCE_BUDGET.ttfb) {
          setBudgetViolations(prev => [...prev.filter(v => !v.includes('TTFB')), `TTFB exceeded: ${Math.round(ttfbValue)}ms > ${PERFORMANCE_BUDGET.ttfb}ms`]);
        }
      }
    }

    // Cleanup observers on unmount
    return () => {
      observers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (e) {
          console.warn('Error disconnecting observer:', e);
        }
      });
    };
  }, []);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const hasAllMetrics = Object.values(metrics).every(value => value !== null);
      if (hasAllMetrics) {
        console.group('🟡 Performance Metrics');
        console.log(`LCP: ${metrics.lcp ? Math.round(metrics.lcp) : 'N/A'}ms (budget: ${PERFORMANCE_BUDGET.lcp}ms)`);
        console.log(`FCP: ${metrics.fcp ? Math.round(metrics.fcp) : 'N/A'}ms (budget: ${PERFORMANCE_BUDGET.fcp}ms)`);
        console.log(`FID: ${metrics.fid ? Math.round(metrics.fid) : 'N/A'}ms (budget: ${PERFORMANCE_BUDGET.fid}ms)`);
        console.log(`CLS: ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'} (budget: ${PERFORMANCE_BUDGET.cls})`);
        console.log(`TTFB: ${metrics.ttfb ? Math.round(metrics.ttfb) : 'N/A'}ms (budget: ${PERFORMANCE_BUDGET.ttfb}ms)`);
        
        if (budgetViolations.length > 0) {
          console.group('⚠️ Budget Violations');
          budgetViolations.forEach(violation => console.warn(violation));
          console.groupEnd();
        }
        console.groupEnd();
      }
    }
  }, [metrics, budgetViolations]);

  // Calculate performance score (0-100)
  const calculateScore = (): number => {
    const { lcp, fid, cls, fcp } = metrics;
    if (!lcp || !fid || cls === null || !fcp) return 0;

    let score = 100;
    
    // LCP scoring (40% weight)
    if (lcp > 4000) score -= 40;
    else if (lcp > 2500) score -= 20;
    
    // FID scoring (25% weight) 
    if (fid > 300) score -= 25;
    else if (fid > 100) score -= 12;
    
    // CLS scoring (25% weight)
    if (cls > 0.25) score -= 25;
    else if (cls > 0.1) score -= 12;
    
    // FCP scoring (10% weight)
    if (fcp > 3000) score -= 10;
    else if (fcp > 1800) score -= 5;
    
    return Math.max(0, Math.round(score));
  };

  return {
    metrics,
    budgetViolations,
    score: calculateScore(),
    isGood: budgetViolations.length === 0,
    budget: PERFORMANCE_BUDGET,
  };
}