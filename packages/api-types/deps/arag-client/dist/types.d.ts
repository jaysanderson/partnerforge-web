/** Typed surface for the ARAG endpoints PartnerForge uses. */
export interface AragConfig {
    baseUrl: string;
    apiKey: string;
    timeoutMs?: number;
    maxRetries?: number;
}
export interface AragClassification {
    labelset: string;
    label: string;
}
/** A knowledge-graph relation to an entity (drives conflict detection). */
export interface AragRelation {
    /** Entity surface form, e.g. the prospect company name. */
    entity: string;
    /** Entity group, e.g. 'prospect' | 'partner'. */
    entityGroup: string;
}
/**
 * A resource to upsert. `slug` is the stable idempotency key (deterministic
 * per source row). Bare uploads without classifications/relations are not
 * acceptable — the knowledge graph is what powers conflict detection.
 */
export interface AragResourceInput {
    slug: string;
    title: string;
    /** Plain-text body fields, keyed by field id (e.g. { summary }). */
    texts: Record<string, string>;
    classifications: AragClassification[];
    relations: AragRelation[];
}
export interface AragUpsertResult {
    slug: string;
    resourceId?: string;
    created: boolean;
}
export interface AragCitation {
    resourceId: string;
    title: string;
    snippet?: string;
    score?: number;
}
/** One turn of multi-turn context. ARAG /ask is stateless; callers pass this. */
export interface AragContextTurn {
    author: 'USER' | 'ARAG';
    text: string;
}
export interface AragAskRequest {
    query: string;
    context?: AragContextTurn[];
    filters?: AragClassification[];
}
export interface AragAskResponse {
    answer: string;
    citations: AragCitation[];
}
export interface AragFindRequest {
    query: string;
    filters?: AragClassification[];
    limit?: number;
}
export interface AragFindHit {
    resourceId: string;
    /** Stable slug (e.g. `deal-dl_x`) — maps back to the source row. */
    slug?: string;
    title: string;
    score: number;
    snippet?: string;
}
export interface AragFindResponse {
    hits: AragFindHit[];
}
export interface AragUploadResponse {
    resourceId: string;
}
/** A labelset definition (taxonomy). `kind` defaults to ['RESOURCES']. */
export interface AragLabelsetDef {
    title: string;
    color?: string;
    kind?: string[];
    labels: {
        title: string;
    }[];
}
export interface AragLabelsetsResponse {
    uuid: string;
    labelsets: Record<string, AragLabelsetDef & {
        multiple?: boolean;
    }>;
}
export interface AragHealth {
    ok: boolean;
    detail?: string;
}
/**
 * Non-grounded LLM call via ARAG's predict/chat. ARAG is our AI gateway —
 * direct-LLM call sites (translation, form parsing, ad-hoc generation) use
 * this instead of importing OpenAI/Gemini SDKs directly. The KB's RAG path
 * is suppressed by supplying `queryContext` (caller-owned grounding); the
 * `model` hint is forwarded to ARAG when present.
 */
export interface AragPredictChatRequest {
    /** The prompt the LLM should answer. */
    question: string;
    /**
     * Caller-supplied context strings. Their presence is what tells ARAG to
     * skip KB retrieval and run as a pure model call. Pass at least one entry
     * (a system prompt or instructions) even for "no context" prompts.
     */
    queryContext: string[];
    /** Optional model id (ARAG resolves; unknown values fall back to KB default). */
    model?: string;
    /** Optional system prompt (in addition to queryContext). */
    systemPrompt?: string;
}
export type AragErrorKind = 'network' | 'timeout' | 'http' | 'parse' | 'config';
export declare class AragError extends Error {
    readonly kind: AragErrorKind;
    readonly status?: number;
    constructor(kind: AragErrorKind, message: string, status?: number);
}
