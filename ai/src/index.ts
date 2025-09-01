/**
 * @aistudio555/ai - AI Services & Integrations
 * LangChain-based AI services for Projectdes Academy
 */

// Export all AI services
export * from './services';

// Export AI agents
export * from './agents';

// Export LangChain configurations
export * from './chains';

// Export prompts
export * from './prompts';

// Core AI functionality placeholder exports
// These will be implemented as AI services are developed
export const AI_SERVICES = {
  CONTENT_GENERATION: 'content_generation',
  COURSE_RECOMMENDATIONS: 'course_recommendations',
  STUDENT_ASSESSMENT: 'student_assessment',
  CHAT_ASSISTANT: 'chat_assistant',
} as const;
