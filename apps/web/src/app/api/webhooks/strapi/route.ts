import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { strapiClient } from '@/lib/strapi-client';

// Webhook secret for security
const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET || 'your-webhook-secret';

interface StrapiWebhookPayload {
  event: 'entry.create' | 'entry.update' | 'entry.delete' | 'entry.publish' | 'entry.unpublish';
  createdAt: string;
  model: string;
  uid: string;
  entry: {
    id: number;
    [key: string]: any;
  };
}

/**
 * Strapi Webhook Handler
 * 
 * Handles real-time updates from Strapi CMS:
 * - Translation updates
 * - Navigation changes
 * - Media updates
 * - Cache invalidation
 * 
 * Security: Validates webhook secret
 * Performance: Selective cache clearing
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const headersList = headers();
    const webhookSecret = headersList.get('x-webhook-secret');
    
    if (webhookSecret !== WEBHOOK_SECRET) {
      console.warn('🚨 Unauthorized webhook request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: StrapiWebhookPayload = await request.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 Strapi webhook received:', {
        event: payload.event,
        model: payload.model,
        entryId: payload.entry?.id,
        timestamp: payload.createdAt,
      });
    }

    // Handle different content types
    switch (payload.model) {
      case 'translation':
        await handleTranslationUpdate(payload);
        break;
      case 'navigation-item':
        await handleNavigationUpdate(payload);
        break;
      case 'media':
        await handleMediaUpdate(payload);
        break;
      default:
        if (process.env.NODE_ENV === 'development') {
          console.log(`ℹ️ Unhandled webhook for model: ${payload.model}`);
        }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully',
      event: payload.event,
      model: payload.model,
    });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle translation content updates
 */
async function handleTranslationUpdate(payload: StrapiWebhookPayload) {
  try {
    const { event, entry } = payload;
    
    // Clear specific translation cache
    if (entry?.key) {
      strapiClient.clearCache(`translations-${entry.key}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Translation cache cleared for key: ${entry.key}`);
      }
    }
    
    // Clear general translation cache
    strapiClient.clearCache('translations');
    
    // Optionally, trigger cache warming for critical translations
    if (event === 'entry.publish') {
      await warmCriticalTranslations();
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌍 Translation ${event} processed for entry: ${entry?.id}`);
    }
    
  } catch (error) {
    console.error('❌ Translation update handling failed:', error);
    throw error;
  }
}

/**
 * Handle navigation structure updates
 */
async function handleNavigationUpdate(payload: StrapiWebhookPayload) {
  try {
    const { event, entry } = payload;
    
    // Clear navigation cache
    strapiClient.clearCache('navigation');
    
    // Warm navigation cache for better performance
    if (event === 'entry.publish') {
      try {
        await strapiClient.getNavigation();
        if (process.env.NODE_ENV === 'development') {
          console.log('🗂️ Navigation cache warmed');
        }
      } catch (error) {
        console.warn('⚠️ Failed to warm navigation cache:', error);
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧭 Navigation ${event} processed for entry: ${entry?.id}`);
    }
    
  } catch (error) {
    console.error('❌ Navigation update handling failed:', error);
    throw error;
  }
}

/**
 * Handle media content updates
 */
async function handleMediaUpdate(payload: StrapiWebhookPayload) {
  try {
    const { event, entry } = payload;
    
    // Clear media cache
    strapiClient.clearCache('media');
    
    // Clear specific media cache if key is available
    if (entry?.key) {
      strapiClient.clearCache(`media-${entry.key}`);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🖼️ Media ${event} processed for entry: ${entry?.id}`);
    }
    
  } catch (error) {
    console.error('❌ Media update handling failed:', error);
    throw error;
  }
}

/**
 * Pre-warm cache for critical translations
 */
async function warmCriticalTranslations() {
  const criticalKeys = [
    'nav.courses',
    'nav.instructors', 
    'nav.blog',
    'nav.enrollNow',
    'common.loading',
    'common.error',
  ];
  
  try {
    for (const language of ['ru', 'en', 'he']) {
      await strapiClient.getTranslationsMap(criticalKeys, language as any);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 Critical translations cache warmed');
    }
  } catch (error) {
    console.warn('⚠️ Failed to warm critical translations:', error);
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}