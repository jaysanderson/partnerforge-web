/**
 * ARAG labelset taxonomy. Initialised in ARAG during deployment. New labels
 * may be added via the admin UI, but these are the canonical defaults and the
 * source of truth for enum-like values used across the platform.
 */
export declare const LABELSETS: {
    readonly industry: readonly ["Healthcare", "Financial Services", "Cybersecurity", "Manufacturing", "Retail", "Education", "Government", "Technology", "Telecommunications", "Professional Services", "Energy"];
    readonly product: readonly ["Sitefinity", "OpenEdge", "DataDirect", "MarkLogic", "Chef", "WhatsUp Gold", "MOVEit", "Kemp", "Agentic RAG", "Flowmon"];
    readonly deal_stage: readonly ["Registered", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
    readonly partner_tier: readonly ["Registered", "Silver", "Gold", "Platinum", "Strategic"];
    readonly partner_type: readonly ["Reseller", "SI", "ISV", "Referral", "Technology", "Distribution", "Consulting"];
    readonly content_type: readonly ["Battle Card", "Case Study", "Pricing Sheet", "Product Overview", "Training Module", "Webinar", "Template", "Sales Playbook", "ROI Tool", "Data Sheet", "Solution Brief", "Demo Script"];
    readonly region: readonly ["North America", "EMEA", "APAC", "LATAM", "ANZ"];
    readonly content_stage: readonly ["Awareness", "Consideration", "Decision", "Implementation", "Expansion"];
};
export type Labelset = keyof typeof LABELSETS;
export type DealStage = (typeof LABELSETS.deal_stage)[number];
export type PartnerTier = (typeof LABELSETS.partner_tier)[number];
export type PartnerType = (typeof LABELSETS.partner_type)[number];
export type Region = (typeof LABELSETS.region)[number];
export type Industry = (typeof LABELSETS.industry)[number];
export type Product = (typeof LABELSETS.product)[number];
export type ContentType = (typeof LABELSETS.content_type)[number];
export type ContentStage = (typeof LABELSETS.content_stage)[number];
/** Open pipeline stages (everything that is not closed). */
export declare const OPEN_DEAL_STAGES: ReadonlyArray<DealStage>;
/** Tier ordering for content-access gating (higher index = more access). */
export declare const TIER_RANK: Record<PartnerTier, number>;
/** Can a partner of `tier` access content gated at `requiredTier`? */
export declare function tierAllows(tier: PartnerTier, requiredTier: PartnerTier): boolean;
