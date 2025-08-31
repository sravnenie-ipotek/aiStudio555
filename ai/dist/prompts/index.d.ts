/**
 * AI Prompts
 * Prompt templates and management
 */
export interface PromptTemplate {
    name: string;
    template: string;
    variables: string[];
}
export declare class PromptManager {
    private prompts;
    constructor();
    private initializePrompts;
    addPrompt(prompt: PromptTemplate): void;
    getPrompt(name: string): PromptTemplate | undefined;
    formatPrompt(name: string, variables: Record<string, string>): string;
}
export declare const PROMPTS: {
    COURSE: {
        OUTLINE: string;
        MODULE: string;
        LESSON: string;
    };
    SUPPORT: {
        GREETING: string;
        CLARIFICATION: string;
        RESOLUTION: string;
    };
    ANALYSIS: {
        SENTIMENT: string;
        SUMMARY: string;
        EXTRACTION: string;
    };
};
export default PromptManager;
//# sourceMappingURL=index.d.ts.map