/**
 * AI Chains
 * LangChain configurations and chain definitions
 */
export declare class Chain {
    name: string;
    steps: string[];
    constructor(name: string, steps?: string[]);
    run(input: any): Promise<any>;
    private processStep;
}
export declare class ConversationChain extends Chain {
    constructor();
    chat(message: string): Promise<string>;
}
export declare class AnalysisChain extends Chain {
    constructor();
    analyze(content: string): Promise<any>;
}
export { Chain as default };
//# sourceMappingURL=index.d.ts.map