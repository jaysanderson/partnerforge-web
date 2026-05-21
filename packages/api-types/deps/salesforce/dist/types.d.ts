/**
 * Salesforce-shaped domain types. Salesforce is the system of record; these
 * mirror the SF objects PartnerForge projects to partners. Field names lean
 * SF-ish on purpose so the real connector is a thin mapping later.
 */
import type { BusinessUnit, PartnerTier, PartnerType, Region } from '@partnerforge/shared';
export type OpportunityStage = 'Registered' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type OpportunityStatus = 'open' | 'won' | 'lost';
export type AssetStatus = 'active' | 'expiring' | 'expired';
export type QuoteType = 'new' | 'renewal' | 'expansion';
/** SF Account = a partner organisation. */
export interface SfAccount {
    id: string;
    name: string;
    domain: string;
    tier: PartnerTier;
    type: PartnerType;
    region: Region;
    /**
     * Business unit this partner belongs to (DX / Data Platform / Chef / AI).
     * The Console's top-level scope axis — a DX-scoped user only sees DX
     * partners. Derived from `productCoverage` in the mock; will map to an
     * SF custom field on the live org.
     */
    businessUnit: BusinessUnit;
    /** Languages the partner operates in (ISO codes). */
    languages: string[];
    /** Product families the partner is authorised to sell. */
    productCoverage: string[];
    isDistributor: boolean;
}
export type PartnerPersona = 'partner_manager' | 'sales' | 'enablement_only' | 'reseller' | 'distributor';
/** SF Contact = a partner user. */
export interface SfContact {
    id: string;
    accountId: string;
    name: string;
    email: string;
    persona: PartnerPersona;
}
export interface SfLineItem {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
}
export interface SfOpportunity {
    id: string;
    accountId: string;
    name: string;
    customerName: string;
    customerDomain: string;
    amount: number;
    currency: string;
    stage: OpportunityStage;
    status: OpportunityStatus;
    closeDate: string;
    ownerName: string;
    contactName: string | null;
    product: string;
    lineItems: SfLineItem[];
    /** Set when this opp was created from an asset/license renewal. */
    sourceAssetId: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface SfLead {
    id: string;
    accountId: string;
    company: string;
    contactName: string;
    email: string;
    status: 'new' | 'working' | 'qualified' | 'disqualified';
    product: string;
    createdAt: string;
}
/** SF Asset / License record. */
export interface SfAsset {
    id: string;
    accountId: string;
    customerName: string;
    product: string;
    sku: string;
    quantity: number;
    startDate: string;
    endDate: string;
    status: AssetStatus;
    renewalEligible: boolean;
}
export interface SfQuote {
    id: string;
    accountId: string;
    /** Linked record — opportunity, asset, or renewal. */
    relatedTo: {
        type: 'opportunity' | 'asset' | 'renewal';
        id: string;
    };
    type: QuoteType;
    amount: number;
    currency: string;
    fileName: string;
    fileUrl: string;
    createdAt: string;
}
export interface SfProduct {
    id: string;
    sku: string;
    name: string;
    family: string;
    /** Tiers allowed to see/sell this product. */
    eligibleTiers: PartnerTier[];
}
/** Pricing varies by tier; partners may see MSRP or partner price. */
export interface SfPriceEntry {
    productId: string;
    tier: PartnerTier;
    msrp: number;
    partnerPrice: number;
    currency: string;
}
/** Dependent-picklist + validation metadata, surfaced so the platform never
 *  re-implements SF rules — it consumes them. */
export interface SfPicklistMetadata {
    /** region -> valid countries. */
    countriesByRegion: Record<string, string[]>;
    /** product family -> valid SKUs. */
    skusByProduct: Record<string, string[]>;
    /** region -> eligible distributor account ids. */
    distributorsByRegion: Record<string, string[]>;
    stages: OpportunityStage[];
}
export interface SfFieldMeta {
    /** Internal SF API name. */
    apiName: string;
    /** Cleaner partner-facing label (R29). */
    partnerLabel: string;
    visibleToPartner: boolean;
    editableByPartner: boolean;
}
//# sourceMappingURL=types.d.ts.map