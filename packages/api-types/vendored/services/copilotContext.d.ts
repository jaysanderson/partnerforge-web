import type { Context } from '../context.js';
export interface CopilotContext {
    queryContext: string[];
    partnerCount: number;
}
/**
 * Build the grounding pack: one fact line per partner (tier, BU, region,
 * engagement, churn risk, open pipeline, won revenue, deal count) plus
 * portfolio-level pipeline-by-stage and top-deal summaries.
 */
export declare function buildCopilotContext(ctx: Context): CopilotContext;
export declare const COPILOT_SYSTEM_PROMPT: string;
//# sourceMappingURL=copilotContext.d.ts.map