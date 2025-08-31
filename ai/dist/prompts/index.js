"use strict";
/**
 * AI Prompts
 * Prompt templates and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPTS = exports.PromptManager = void 0;
class PromptManager {
    prompts;
    constructor() {
        this.prompts = new Map();
        this.initializePrompts();
    }
    initializePrompts() {
        // Course generation prompt
        this.addPrompt({
            name: 'course_generation',
            template: 'Generate a comprehensive course outline for: {topic}. Include modules, lessons, and learning objectives.',
            variables: ['topic']
        });
        // Support query prompt
        this.addPrompt({
            name: 'support_query',
            template: 'Provide helpful support for the following query: {query}. Be professional and informative.',
            variables: ['query']
        });
        // Content summary prompt
        this.addPrompt({
            name: 'content_summary',
            template: 'Summarize the following content in a clear and concise manner: {content}',
            variables: ['content']
        });
    }
    addPrompt(prompt) {
        this.prompts.set(prompt.name, prompt);
    }
    getPrompt(name) {
        return this.prompts.get(name);
    }
    formatPrompt(name, variables) {
        const prompt = this.getPrompt(name);
        if (!prompt) {
            throw new Error(`Prompt ${name} not found`);
        }
        let formatted = prompt.template;
        for (const [key, value] of Object.entries(variables)) {
            formatted = formatted.replace(`{${key}}`, value);
        }
        return formatted;
    }
}
exports.PromptManager = PromptManager;
// Preset prompts
exports.PROMPTS = {
    COURSE: {
        OUTLINE: 'Generate a detailed course outline for {topic}',
        MODULE: 'Create a module for {topic} including lessons and exercises',
        LESSON: 'Design a lesson plan for {topic} with objectives and activities'
    },
    SUPPORT: {
        GREETING: 'Welcome! How can I help you today?',
        CLARIFICATION: 'Could you please provide more details about {issue}?',
        RESOLUTION: 'Here is a solution for your issue: {solution}'
    },
    ANALYSIS: {
        SENTIMENT: 'Analyze the sentiment of: {text}',
        SUMMARY: 'Summarize the key points from: {content}',
        EXTRACTION: 'Extract important information from: {document}'
    }
};
exports.default = PromptManager;
//# sourceMappingURL=index.js.map