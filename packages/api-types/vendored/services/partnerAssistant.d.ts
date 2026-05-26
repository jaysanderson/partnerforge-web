/** System prompt: forces specificity + multi-sentence + anti-tautology. */
export declare const PARTNER_ASSISTANT_SYSTEM: string;
/** Pre-built grounding pack for the partner assistant. */
export declare function partnerAssistantGrounding(): string[];
/** Defaults the chip row falls back to if generation fails. */
export declare const DEFAULT_AGENT_SUGGESTIONS: string[];
/**
 * Generate three short, diverse, partner-flavoured suggested questions via
 * `/predict/chat`. Returns the defaults on any failure so the UI is never
 * left empty.
 */
export declare function generateAgentSuggestions(): Promise<string[]>;
/**
 * Answer a partner question. Uses /predict/chat with the hand-curated
 * product + positioning brief as grounding, so answers stay specific and
 * non-tautological even when the enablement KB is thin. Returns the
 * assembled answer string; the caller streams it back to the UI as a
 * single SSE frame.
 */
export declare function answerPartnerQuestion(question: string, history?: {
    author: 'USER' | 'ARAG';
    text: string;
}[]): Promise<string>;
//# sourceMappingURL=partnerAssistant.d.ts.map