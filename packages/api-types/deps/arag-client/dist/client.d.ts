import { type AragAskRequest, type AragAskResponse, type AragConfig, type AragFindRequest, type AragFindResponse, type AragHealth, type AragLabelsetDef, type AragLabelsetsResponse, type AragPredictChatRequest, type AragResourceInput, type AragUpsertResult } from './types.js';
/**
 * Typed ARAG API client. All AI features route through here — there are no
 * direct LLM calls anywhere in the codebase. Transient failures (network,
 * timeout, 5xx) are retried with exponential backoff; everything else throws
 * a typed AragError so callers can degrade gracefully.
 */
export declare class AragClient {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly timeoutMs;
    private readonly maxRetries;
    constructor(config: AragConfig);
    private kbPath;
    private raw;
    private backoff;
    private json;
    private askBody;
    /**
     * RAG-powered Q&A. Uses the synchronous mode (`X-Synchronous: true`) so the
     * caller gets one assembled answer + citations instead of an NDJSON stream.
     */
    ask(kbId: string, req: AragAskRequest): Promise<AragAskResponse>;
    /**
     * Streaming /ask. The Progress/Nuclia API returns newline-delimited JSON
     * items (`{"item":{"type":"answer","text":"…"}}`). Yields answer text as
     * it arrives.
     */
    askStream(kbId: string, req: AragAskRequest): AsyncGenerator<string>;
    /**
     * Non-grounded LLM call via /predict/chat — ARAG as the AI gateway.
     *
     * /predict/chat is RAG-grounded by default and returns "Not enough data."
     * for prompts the KB can't answer. Supplying `query_context` (caller-owned
     * grounding strings) tells ARAG to skip retrieval and run as a pure model
     * call. The response body is the assembled answer with a trailing
     * citation-count token (`0` ok, `-2` no-data) that we strip.
     *
     * `model` is forwarded as a hint; this Nuclia deployment silently falls
     * back to the KB default for unknown values, so don't rely on it as
     * validation. Use the model the KB is provisioned with.
     */
    predictChat(kbId: string, req: AragPredictChatRequest): Promise<string>;
    find(kbId: string, req: AragFindRequest): Promise<AragFindResponse>;
    /** Authenticated KB info — also the per-KB health/auth check. */
    kbInfo(kbId: string): Promise<{
        uuid: string;
        title: string;
    }>;
    private resourceBody;
    /**
     * Idempotent resource upsert keyed by `slug`. Creates via POST /resources;
     * on 409 (slug exists) updates via PATCH /slug/{slug}. Stale ARAG data
     * (>24h) is a defect, so sync jobs call this on every change.
     */
    upsertResource(kbId: string, r: AragResourceInput): Promise<AragUpsertResult>;
    deleteResourceBySlug(kbId: string, slug: string): Promise<void>;
    /**
     * Create a new resource and return its ARAG-assigned uuid. Used for
     * video uploads where we need the id to issue subsequent TUS calls.
     */
    createResource(kbId: string, input: import('./types.js').AragVideoResourceInput): Promise<import('./types.js').AragCreatedResource>;
    /**
     * GET /resource/{id}?show=... — used by the Watch page to read the file
     * url, the transcript text, the DA-agent-generated chapters / titles /
     * descriptions, and the processing status (PROCESSED | PENDING | ERROR).
     *
     * `show` defaults to the recipe's required fields. Returns the raw ARAG
     * response shape — caller picks what it needs.
     */
    getResource(kbId: string, resourceId: string, opts?: {
        show?: string[];
    }): Promise<Record<string, unknown>>;
    /**
     * TUS chunked upload of a single file field on an existing resource.
     *
     *   POST  /kb/{kbId}/resource/{id}/file/{fieldId}/tusupload   → returns Location header
     *   PATCH {location}                                          → one PATCH per chunk
     *
     * Yields progress to `onProgress` (0 → 1). 5 MiB default chunk.
     * Body is `Buffer | Uint8Array` because the API server proxies the
     * browser upload bytes (we don't expose the service-account key client-
     * side).
     */
    tusUploadFile(kbId: string, opts: import('./types.js').AragTusUploadOpts): Promise<{
        uploadUrl: string;
    }>;
    /**
     * Provision a Data Augmentation task on a KB. Used at video-KB setup to
     * install the 8 TubeRAG agents. Idempotent — server returns 200 OK on
     * re-create when the task name already exists.
     */
    setupDaTask(kbId: string, spec: import('./types.js').AragDaTaskParams): Promise<{
        ok: boolean;
    }>;
    /** Read installed DA tasks on a KB (used to skip re-install). */
    listDaTasks(kbId: string): Promise<{
        tasks: Array<{
            id: string;
            name: string;
            status: string;
            task_name: string;
        }>;
    }>;
    listLabelsets(kbId: string): Promise<AragLabelsetsResponse>;
    /** Idempotent upsert of one labelset (POST /labelset/{id}). */
    putLabelset(kbId: string, labelsetId: string, def: AragLabelsetDef): Promise<void>;
    deleteLabelset(kbId: string, labelsetId: string): Promise<void>;
    graph(kbId: string): Promise<unknown>;
    /**
     * Lightweight reachability probe. Any HTTP response (even 401/404) means
     * ARAG is reachable; only network/timeout failures count as down.
     */
    health(): Promise<AragHealth>;
}
/** The three Knowledge Boxes. Each has its own scoped API key. */
export type KbName = 'partner' | 'deal' | 'enablement' | 'video';
/**
 * A client bound to one Knowledge Box (its own id + its own scoped key), so
 * callers never pass a kbId — and a Partner-KB key can never reach the Deal
 * KB by mistake.
 */
export declare class AragKbClient {
    private readonly client;
    readonly kbId: string;
    readonly name: KbName;
    constructor(name: KbName, kbId: string, config: AragConfig);
    ask(req: AragAskRequest): Promise<AragAskResponse>;
    askStream(req: AragAskRequest): AsyncGenerator<string>;
    /** Non-grounded LLM call via /predict/chat (ARAG as AI gateway). */
    predictChat(req: AragPredictChatRequest): Promise<string>;
    /**
     * Translate UI strings via /predict/chat (ARAG as AI gateway). Returns a
     * source→translation map; the caller caches aggressively so each
     * (string, locale) is generated once.
     */
    translate(targetLanguage: string, texts: string[], protectedTerms?: string[], model?: string): Promise<Record<string, string>>;
    find(req: AragFindRequest): Promise<AragFindResponse>;
    upsertResource(r: AragResourceInput): Promise<AragUpsertResult>;
    deleteResourceBySlug(slug: string): Promise<void>;
    createResource(input: import('./types.js').AragVideoResourceInput): Promise<import('./types.js').AragCreatedResource>;
    getResource(resourceId: string, opts?: {
        show?: string[];
    }): Promise<Record<string, unknown>>;
    tusUploadFile(opts: import('./types.js').AragTusUploadOpts): Promise<{
        uploadUrl: string;
    }>;
    setupDaTask(spec: import('./types.js').AragDaTaskParams): Promise<{
        ok: boolean;
    }>;
    listDaTasks(): Promise<{
        tasks: Array<{
            id: string;
            name: string;
            status: string;
            task_name: string;
        }>;
    }>;
    listLabelsets(): Promise<AragLabelsetsResponse>;
    putLabelset(labelsetId: string, def: AragLabelsetDef): Promise<void>;
    deleteLabelset(labelsetId: string): Promise<void>;
    graph(): Promise<unknown>;
    kbInfo(): Promise<{
        uuid: string;
        title: string;
    }>;
    /** Real per-KB health: authenticated GET of this KB. */
    health(): Promise<AragHealth>;
}
/**
 * Build a KB-bound client from environment. Each KB reads its own key
 * (`ARAG_<KB>_KB_KEY`); falls back to a shared `ARAG_API_KEY` if a per-KB
 * key isn't set, so single-key setups still work.
 */
export declare function aragKbFromEnv(name: KbName): AragKbClient;
/** Generic reachability probe — uses whichever KB key is configured first. */
export declare function aragHealthClientFromEnv(): AragClient;
//# sourceMappingURL=client.d.ts.map