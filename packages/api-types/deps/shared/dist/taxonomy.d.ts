/**
 * ARAG labelset taxonomy. Initialised in ARAG during deployment. New labels
 * may be added via the admin UI, but these are the canonical defaults and the
 * source of truth for enum-like values used across the platform.
 */
export declare const LABELSETS: {
    readonly industry: readonly ["Healthcare", "Financial Services", "Cybersecurity", "Manufacturing", "Retail", "Education", "Government", "Technology", "Telecommunications", "Professional Services", "Energy"];
    readonly product: readonly ["Sitefinity", "ShareFile", "MOVEit", "WhatsUp Gold", "Flowmon", "Kemp", "Chef", "OpenEdge", "Agentic RAG", "DataDirect", "MarkLogic"];
    readonly deal_stage: readonly ["Registered", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
    readonly partner_tier: readonly ["Registered", "Silver", "Gold", "Platinum", "Strategic"];
    readonly partner_type: readonly ["Reseller", "SI", "ISV", "Referral", "Technology", "Distribution", "Consulting"];
    readonly content_type: readonly ["Battle Card", "Case Study", "Pricing Sheet", "Product Overview", "Training Module", "Webinar", "Template", "Sales Playbook", "ROI Tool", "Data Sheet", "Solution Brief", "Demo Script"];
    readonly region: readonly ["NA", "EMEA", "APJ", "CALA"];
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
/**
 * Progress business units. A BU bundles one or more products; it's the
 * top-level "who are you?" axis the Console scopes by (DX person sees DX
 * partners, etc.). Stored as a single value per partner on `SfAccount`.
 */
export declare const BUSINESS_UNITS: readonly ["DX", "INFRA", "ADP"];
export type BusinessUnit = (typeof BUSINESS_UNITS)[number];
/**
 * Which BU owns each product. Used to seed a partner's `businessUnit` from
 * its `productCoverage`, to drive the Console's cascading Product picker,
 * and as the mapping we'll mirror onto the Salesforce custom field once the
 * live org is connected.
 *
 *  - DX (Digital Experience): Sitefinity, ShareFile, MOVEit
 *  - INFRA (Infrastructure Management): WhatsUp Gold, Flowmon, Kemp, Chef
 *  - ADP (App Dev & Data Platform): OpenEdge, Agentic RAG, DataDirect, MarkLogic
 */
export declare const PRODUCT_TO_BU: Record<Product, BusinessUnit>;
/** Products belonging to each BU — drives the cascading Product dropdown. */
export declare const BU_PRODUCTS: Record<BusinessUnit, Product[]>;
/** Products for a BU (empty array for an unknown BU). */
export declare function productsForBU(bu: string): Product[];
/** Resolve a partner's BU from its product coverage (first product wins). */
export declare function businessUnitForProducts(products: readonly string[]): BusinessUnit;
/** Open pipeline stages (everything that is not closed). */
export declare const OPEN_DEAL_STAGES: ReadonlyArray<DealStage>;
/** Tier ordering for content-access gating (higher index = more access). */
export declare const TIER_RANK: Record<PartnerTier, number>;
/** Can a partner of `tier` access content gated at `requiredTier`? */
export declare function tierAllows(tier: PartnerTier, requiredTier: PartnerTier): boolean;
//# sourceMappingURL=taxonomy.d.ts.map