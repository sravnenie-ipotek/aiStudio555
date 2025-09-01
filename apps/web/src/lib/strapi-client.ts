/**
 * Strapi API Client for AiStudio555 Academy
 * ==========================================
 * 
 * Handles all communication with Strapi CMS for translations, media, and navigation
 */

interface StrapiConfig {
  baseUrl: string;
  apiToken: string;
  timeout: number;
}

interface TranslationEntry {
  id: number;
  key: string;
  en: string;
  ru: string;
  he: string;
  category: string;
  page?: string;
  section?: string;
  description?: string;
  isActive: boolean;
  isLocked?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface MediaEntry {
  id: number;
  key: string;
  type: 'image' | 'video' | 'document';
  source: 'upload' | 'youtube' | 'external';
  url: string;
  alternativeText: string;
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
  page: string;
  section: string;
  language: 'ru' | 'en' | 'he' | 'all';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface NavigationItem {
  id: number;
  key: string;
  titleKey: string;
  href?: string;
  order: number;
  parentId?: number;
  isActive: boolean;
  children?: NavigationItem[];
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

class StrapiClient {
  private config: StrapiConfig;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      apiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '',
      timeout: 10000,
    };

    if (!this.config.apiToken) {
      console.warn('⚠️ STRAPI_API_TOKEN not found - API calls may fail');
    }
  }

  /**
   * Generic API request method with caching and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string,
    cacheTtl: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    const url = `${this.config.baseUrl}/api${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiToken}`,
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `HTTP ${response.status}` 
        }));
        
        throw new Error(`Strapi API Error (${response.status}): ${errorData.message || errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (cacheKey && options.method !== 'POST') {
        this.cache.set(cacheKey, { data, timestamp: Date.now(), ttl: cacheTtl });
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error(`Strapi API timeout after ${this.config.timeout}ms`);
        }
        throw new Error(`Strapi connection failed: ${error.message}`);
      }
      throw new Error('Unknown Strapi API error');
    }
  }

  /**
   * Fetch all translations with optional filtering
   */
  async getTranslations(filters?: {
    category?: string;
    page?: string;
    section?: string;
    isActive?: boolean;
  }): Promise<TranslationEntry[]> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters?.category) params.append('filters[category][$eq]', filters.category);
    if (filters?.page) params.append('filters[page][$eq]', filters.page);
    if (filters?.section) params.append('filters[section][$eq]', filters.section);
    if (filters?.isActive !== undefined) params.append('filters[isActive][$eq]', String(filters.isActive));
    
    // Always fetch active content by default
    if (!filters?.isActive !== false) params.append('filters[isActive][$eq]', 'true');
    
    params.append('sort', 'order:asc,key:asc');
    params.append('pagination[pageSize]', '100');

    const cacheKey = `translations-${params.toString()}`;
    
    const response = await this.request<StrapiResponse<TranslationEntry[]>>(
      `/translations?${params.toString()}`,
      { method: 'GET' },
      cacheKey,
      5 * 60 * 1000 // 5 minutes cache
    );

    return response.data || [];
  }

  /**
   * Fetch navigation structure
   */
  async getNavigation(): Promise<NavigationItem[]> {
    const cacheKey = 'navigation';
    
    const response = await this.request<StrapiResponse<NavigationItem[]>>(
      '/navigation-items?sort=order:asc&filters[isActive][$eq]=true&populate=*',
      { method: 'GET' },
      cacheKey,
      10 * 60 * 1000 // 10 minutes cache
    );

    const items = response.data || [];
    
    // Build hierarchical structure
    const navigationMap = new Map<number, NavigationItem>();
    const rootItems: NavigationItem[] = [];

    // First pass: create map
    items.forEach(item => {
      navigationMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build hierarchy
    items.forEach(item => {
      const navItem = navigationMap.get(item.id)!;
      
      if (item.parentId) {
        const parent = navigationMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(navItem);
        }
      } else {
        rootItems.push(navItem);
      }
    });

    return rootItems;
  }

  /**
   * Fetch media entries with filtering
   */
  async getMedia(filters?: {
    page?: string;
    section?: string;
    language?: 'ru' | 'en' | 'he' | 'all';
    type?: 'image' | 'video' | 'document';
  }): Promise<MediaEntry[]> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('filters[page][$eq]', filters.page);
    if (filters?.section) params.append('filters[section][$eq]', filters.section);
    if (filters?.language) params.append('filters[language][$eq]', filters.language);
    if (filters?.type) params.append('filters[type][$eq]', filters.type);
    
    params.append('filters[isActive][$eq]', 'true');
    params.append('sort', 'order:asc');
    params.append('pagination[pageSize]', '100');

    const cacheKey = `media-${params.toString()}`;
    
    const response = await this.request<StrapiResponse<MediaEntry[]>>(
      `/media?${params.toString()}`,
      { method: 'GET' },
      cacheKey,
      15 * 60 * 1000 // 15 minutes cache
    );

    return response.data || [];
  }

  /**
   * Get translation by key with fallback logic
   */
  async getTranslation(
    key: string, 
    language: 'ru' | 'en' | 'he' = 'ru'
  ): Promise<string> {
    try {
      const translations = await this.getTranslations();
      const entry = translations.find(t => t.key === key);
      
      if (!entry) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key as fallback
      }

      // Fallback hierarchy: requested → ru → en → key
      return entry[language] || entry.ru || entry.en || key;
    } catch (error) {
      console.error(`Failed to fetch translation for key: ${key}`, error);
      return key;
    }
  }

  /**
   * Get multiple translations at once
   */
  async getTranslationsMap(
    keys: string[], 
    language: 'ru' | 'en' | 'he' = 'ru'
  ): Promise<Record<string, string>> {
    try {
      const translations = await this.getTranslations();
      const map: Record<string, string> = {};

      keys.forEach(key => {
        const entry = translations.find(t => t.key === key);
        if (entry) {
          map[key] = entry[language] || entry.ru || entry.en || key;
        } else {
          map[key] = key;
          console.warn(`Translation key not found: ${key}`);
        }
      });

      return map;
    } catch (error) {
      console.error('Failed to fetch translations map:', error);
      // Return keys as fallback
      return keys.reduce((acc, key) => ({ ...acc, [key]: key }), {});
    }
  }

  /**
   * Fetch navigation data from Strapi
   */
  async getNavigation(): Promise<any> {
    try {
      const response = await this.request<any>(
        '/navigation?populate[headerMenu][populate]=*&populate[ctaButton]=*&populate[footerMenu][populate]=*',
        { method: 'GET' },
        'navigation',
        10 * 60 * 1000 // 10 minutes cache for navigation
      );

      return response.data?.attributes || null;
    } catch (error) {
      console.error('Failed to fetch navigation:', error);
      return null;
    }
  }

  /**
   * Clear cache for specific key or all
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Health check for Strapi connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      await this.request('/translations?pagination[pageSize]=1', { method: 'GET' });
      return { status: 'ok', message: 'Strapi connection successful' };
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Singleton instance
export const strapiClient = new StrapiClient();

// Export types for use in other files
export type { 
  TranslationEntry, 
  MediaEntry, 
  NavigationItem, 
  StrapiResponse,
  StrapiError 
};

export default strapiClient;